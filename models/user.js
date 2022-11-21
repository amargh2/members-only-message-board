const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema ({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  birthday: String,
  messages: Array
})

module.exports = mongoose.model('User', User)