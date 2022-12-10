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

exports.getMessages = async (req, res) => {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const to = await User.findOne({username:req.params['username']})
    console.log(to)
    const messages = await Message.find({to: to}).populate('author')
    res.render('messages', {messages:messages})
  } catch (err) {
    res.render('error', {error:err})
  }
}