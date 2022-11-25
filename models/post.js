const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema ({
  author: {type:Schema.Types.ObjectId, ref:'User'},
  date:String,
  message: String,
})

module.exports = mongoose.model('Post', Post)