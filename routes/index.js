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
const usersController = require('../controllers/usersController')

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    req.user ?? res.redirect('/login')
    mongoose.connect(process.env.MONGO_URI)
    const posts = await Post.find({}).limit({val:10}).populate('author')
    console.log(posts)
    res.render('index', { title: 'The Discourse', user:req.user, posts:posts });
  } catch (err) {
    throw err
  }
  
});

//GET login page
router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Please log in'})
})

//GET sign up form
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Sign Up'})
})

//POST sign up form 
router.post('/register',
  
  //all validators need to pass in the function arguments - per express-validator docs
  body('password', 'A strong password must be 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one symbol.').trim().isStrongPassword(), 
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
//after validator tests, process request
async function(req, res, next) {
  //first run validation check; if errors, render the sign-up-form with the errors
  const errors = validationResult(req);
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
});

  //GET login form
  router.get('/login', (req, res) => res.render('login'));

  //POST login form
  router.post('/login', 
    passport.authenticate('local', {
      failureRedirect:'/login',
      successRedirect:'/'
    })
  );

  router.post(
    '/post', 
    body('message', 'Posts must be at least 15 characters.').isLength({min:15, max:undefined}),
    async function (req, res, next) {
      const errors = validationResult(req)
      !errors.isEmpty() ? res.redirect('/') : async () => {
      try {
        mongoose.connect()
      } catch (err) { 
        throw err
      }
    }
    })


module.exports = router;
