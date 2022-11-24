const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema ({
  author: {type:Schema.Types.ObjectId, ref:'user'},
  username: String,
  date:String,
  message: String,
})

module.exports = mongoose.model('Post', Post)