//require all the things
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
const postsController = require('../controllers/postsController')
require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const Post = require('../models/post');
const usersController = require('../controllers/usersController');

//Sign up and register get and post pages first; catch all underneath to ensure logged in users.

//GET login form
router.get('/login', (req, res) => res.render('login'));

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

  

  //POST login form
  router.post('/login', 
    passport.authenticate('local', {
      failureRedirect:'/login',
      successRedirect:'/'
    })
  );

  //POST logout
  router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) {return next(err)}
      res.redirect('/login')
    })
  })


//catch all redirect to prevent unauthenticated users from accessing authenticated routes
router.get('*', function(req, res, next) {
  if(!req.user) {
    res.redirect('/login')
  } else {
    next()
  }
})

/* GET home page. */

router.get('/', async function(req, res, next) {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const posts = await Post.find().limit({val:10}).sort({date:-1}).populate('author')
    res.render('index', { title: 'The Discourse', user:req.user, posts:posts });
  } catch (err) {
    throw err
  }
  
});

router.post(
    '/post', 
    body('message', 'Posts must be at least 15 characters.').isLength({min:15, max:undefined}),
    async function (req, res, next) {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.redirect('/') 
      }
      try {
        mongoose.connect(process.env.MONGO_URI)
        const post = new Post({
          author: req.user.id || currentUser.id,
          date: new Date(),
          subject: req.body.subject,
          message: req.body.message
        })
        await post.save()
        res.redirect('/')
      } catch (err) { 
        res.render('error', {error:err})
      }
    }
    )

    //GET get user pofile
    router.get('/user/:username', usersController.userProfile)


    //GET get a specific post
    router.get('/posts/:postid', postsController.getPost)

    //POST post a reply
    router.post('/posts/:postid/reply', postsController.replyToPost)

    //POST delete a post
    router.post('/posts/:postid/delete', postsController.deletePost)

    //POST perform a search
    router.post('/posts/search', postsController.search)

    // GET send new message page
    router.get('/user/:username/messages/compose', usersController.composeMessagePage)

    //POST send a message to a user
    router.post('/user/:username/messages/send', usersController.sendMessage)

    //GET messages page
    router.get('/user/:username/messages', usersController.getMessages)

    //GET message thread
    router.get('/user/:username/messages/:messageid', usersController.getMessageThread)

    // POST response to message (ie, create a response)
    router.post('/user/:username/messages/:messageid/reply', usersController.replyToMessage)

    module.exports = router;
