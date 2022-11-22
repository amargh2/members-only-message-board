var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const {body, validationResult} = require('express-validator');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Discourse' });
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Please log in'})
})

router.get('/sign-up-form', function(req, res, next) {
  res.render('sign-up-form', {title: 'Sign Up'})
})

router.post('/sign-up-form', async function(req, res, next) {
  //check if the form data is valid
  /*body('first_name').isAlpha();
  body('last_name').isAlpha();
  body('username').isLength({min: 4})
  body('password').isStrongPassword()
  body('password').equals(req.body.password, req.body.confirmpassword)*/
  //check for errors and send error response if present
  //valid, so save new user to the database
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
    console.log(user)
    user.save()
    res.redirect('/')
  } catch (error) {
    res.render('error', {error:error})
  }
})


module.exports = router;
