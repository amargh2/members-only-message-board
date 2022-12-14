const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema ({
  first_name: String,
  last_name: String,
  username: String,
  password: String,
  birthday: Date,
  posts: Array,
  replies: Array,
  date_created: Date,
})

User.virtual('url')
  .get(function() {
    return `/user/${this.username}`
  })

module.exports = mongoose.model('User', User)