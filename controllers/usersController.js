//require all the things
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const Post = require('../models/post');
const Message = require('../models/message')
const Conversation = require('../models/conversation');
const conversation = require('../models/conversation');

exports.registerUser = async function(req, res) {

      //No errors, so continue on with the request
      if (!errors.isEmpty()) {
        res.render('register', {errors:errors.array(), 
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username:req.body.username
        })
      } else {
        //No errors, so continue on with the request
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10)
          mongoose.connect(process.env.MONGO_URI)
          const user = new User({
            first_name: req.body.first_name,
            username: req.body.username,
            last_name: req.body.last_name,
            password: hashedPassword,
            birthday:req.body.birthday,
            messages:[]
          })
          user.save()
          res.redirect('/login')
          } catch (error) {
          res.render('error', {error:error})
      }}
    };

exports.userProfile = async  (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const user = await User.find({username:req.params['username']}).lean()
    const posts = await Post.find({author:user[0]._id})
    res.render('profile', {user: user[0], posts:posts, title:`${user[0].username}'s profile`})
  } catch (err) {
    res.render('error', {error: err})
  }
}

exports.sendMessage = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    
    //users
    const recipient = await User.findOne({username:req.body.recipient})
    const author = await User.findOne({username:req.params['username']})

    //check if a convo exists between the two users

    const conversationInProgress = await Conversation.findOne(
      {participants:{$all:[author.id, recipient.id]}}
    )
    
    if (!conversationInProgress) {
      const message = new Message ({
        from_user: author.id,
        date: new Date(),
        message: req.body.message,
        to_user: recipient.id,
      })
      message.save()
      
      const newConversation = new Conversation({
        participants:[recipient.id, author.id],
        date: new Date(),
        messages:message.id,
        conversation_id: message.id
      })
      newConversation.save()
    } else {
      const message = new Message ({
        from_user: author.id,
        date: new Date(),
        message: req.body.message,
        to_user: recipient.id,
        conversation_id: conversationInProgress.conversation_id
      })
      message.save()
      conversationInProgress.messages.push(message._id)
      conversationInProgress.save()
    }

    res.redirect(`/user/${req.params['username']}/messages`)        
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.getMessages = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const user = await User.findOne({username:req.params['username']})
    const conversations = await Conversation.find({participants: user.id}).populate({ path: 'messages', populate:[{path:'from_user', model:'User'},{path:'to_user', model:'User'}]})
    res.render('messages', {conversations:conversations})
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.getMessageThread = async(req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const conversation = await Conversation.findById(req.params['messageid']).
    populate({
      path:'messages', 
      populate:[{path:'from_user', model:'User'}, {path:'to_user', model:'User'}]})
      .populate('participants')
    res.render('messagethread', {conversation:conversation})
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.replyToMessage = async(req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('made it this far')
    const conversation = await Conversation.findById(req.params['messageid']);
    const sender = await User.findOne({username:req.params['username']})
    const recipient = await User.findById(req.body.recipient)
    
    console.log(conversation, sender, recipient)
    const message = new Message ({
      from_user: sender.id,
      date: new Date(),
      to_user: req.body.recipient,
      message: req.body.submessage,
    })
    message.save();
    conversation.messages.push(message.id)
    conversation.save()
    res.redirect(`/user/${req.params['username']}/messages/${conversation.id}`)
  } catch (err) {
    res.render('error', {error: err})
  }
}

exports.composeMessagePage = async (req, res) => {
  res.render('newmessage')
}