var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/user');
const {body, validationResult, check} = require('express-validator');
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

router.post('/sign-up-form', 
body('password', 'A strong password must be 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one symbol.').isStrongPassword(), 
body('username', 'Usernames must be at least 4 characters.').isLength({min:4}),
body('first_name', 'Names must only contain alphabet characters.').isAlpha(),
body('last_name', 'Names must only contain alphabet characters.').isAlpha(),
body('password').custom((value, {req}) => {
  if (value !== req.body.confirmpassword) {
    throw new Error('Passwords must match.')
  } else {
    return true
  }
}),
async function(req, res, next) {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    res.render('sign-up-form', {errors:errors.array()})
  } else {
    try {
      mongoose.connect(process.env.MONGO_URI)
      if (await User.find({username: req.body.username}).lean().username !== undefined){
        const newError = {
          msg:'That username is taken.'
        }
        res.render('sign-up-form', {errors:[newError]} )
      } else {
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
      }
  } catch (error) {
    res.render('error', {error:error})
  }
  }
})


module.exports = router;
