var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
require('dotenv').config()
const user = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Discourse' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Please log in'})
})

//GET sign up form
router.get('/sign-up-form', function(req, res, next) {
  res.render('sign-up-form', {title: 'Sign Up'})
})

//POST sign up form 
router.post(
  '/sign-up-form', 
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
    res.render('sign-up-form', {errors:errors.array(), 
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username:req.body.username
    })
  } else {
    //No errors, so continue on with the request
    try {
      mongoose.connect(process.env.MONGO_URI)
      const user = new User({
        first_name: req.body.first_name,
        username: req.body.username,
        last_name: req.body.last_name,
        password: req.body.password,
        birthday:req.body.birthday,
        messages:[]
      })
      user.save()
      res.redirect('/')
      } catch (error) {
    res.render('error', {error:error})
  }
  }
})


module.exports = router;
