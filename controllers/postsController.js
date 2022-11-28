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

exports.getPost = async function(req, res) {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const post = await Post.findById(req.params.postid).populate('author').lean()
    res.render('post', {post: post})
  } catch (err) {
    throw err
  }
}