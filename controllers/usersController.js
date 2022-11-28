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
    console.log(req.params['username'])
    const user = await User.find({username:req.params['username']}).lean()
    console.log(user[0])
    const posts = await Post.find({author:user[0]._id})
    console.log(posts)
    res.render('profile', {user: user[0], posts:posts})
  } catch (err) {
    res.render('error', {error: err})
  }
}