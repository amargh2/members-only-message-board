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

exports.registerUser = async function(req, res, next) {
    body('username', 'Usernames must be at least 4 characters.').trim().isLength({min:4}),
    body('first_name', 'Names must only contain alphabet characters.').trim().isAlpha(),
    body('last_name', 'Names must only contain alphabet characters.').trim().isAlpha(),
  
  //custom validator to check if the passwords match

    body('password').custom((value, {req}) => {
      if (value !== req.body.confirmpassword) {
        throw new Error('Passwords must match.')
      } else {
        return true
      }
    }),
  
  //custom validator to check if username is taken
  body('username').custom(async (value) => {
      try {
        mongoose.connect(process.env.MONGO_URI)
        const user = await User.find({username:value})
        console.log('hey hey you you' + user)
        if (user[0] !== undefined) {
          throw new Error('Username is taken.')
        } else {
          return true
        }      
      } catch (err) {
        throw err
      }
    }),
    (req,res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
      res.render('sign-up-form', {errors:errors.array(), 
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username:req.body.username
      })
    }
    try{
      const hashedPassword = async () => await bcrypt.hash(req.body.password, 10)
      console.log(hashedPassword)
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
}