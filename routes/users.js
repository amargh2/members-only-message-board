
var express = require('express');
const { default: mongoose } = require('mongoose');
var router = express.Router();
const User = require('../models/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', async function(req, res, next) {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const user = new User({
      first_name: 'Anthony',
      last_name: 'Margherio',
      birthday: '06-16-1988',
      messages:[]
    })
    await user.save()
    res.redirect('/')
  } catch (err) {
    res.send(`oops ${err}`)
  }
})

module.exports = router;
