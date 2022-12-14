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
const Response = require('../models/response');
const message = require('../models/message');

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
    // find the user to send to
    const recipient = await User.findOne({username:req.body.recipient})
    const author = await User.findOne({username:req.params['username']})
    const message = new Message ({
      from_user: author.id,
      date: new Date(),
      message: req.body.message,
      to_user: recipient.id
    })
    message.save()
    res.redirect(`/user/${req.params['username']}/messages`)
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.getMessages = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const user = await User.findOne({username:req.params['username']})
    const messages = await Message.find({$or:[{to:user.id}, {from:user.id}]}).populate('from_user').populate('to_user')
    
    res.render('messages', {messages:messages})
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.getMessageThread = async(req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const messages = await Message.find({$or:[{id: req.params['messageid']}, {parent_message:req.params['messageid']}]}).populate('from_user').populate('to_user')
    res.render('messagethread', {messages:messages})
  } catch (err) {
    res.render('error', {error:err})
  }
}

exports.replyToMessage = async(req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const from_user = await User.findOne({username:req.params['username']})
    const op = await Message.findById(req.params['messageid']).populate('from_user').populate('to_user')
    const message = new Message ({
      from_user: from_user.id,
      date: new Date(),
      to_user: op.from_user.id === req.user.id ? op.to_user.id : op.from_user.id,
      message: req.body.submessage,
      parent_message: op.id
    })
    message.save();
    op.replies.push(message._id)
    op.save()
    res.redirect(`/user/${req.params['username']}/messages/${op.id}`)
  } catch (err) {
    res.render('error', {error: err})
  }
}

exports.composeMessagePage = async (req, res) => {
  res.render('newmessage')
}