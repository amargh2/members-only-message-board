const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema ({
  author: {type:Schema.Types.ObjectId, ref:'User'},
  date:Date,
  message: String,
  replies: [{type:Schema.Types.ObjectId, ref:'Reply', ref:'User'}],
  reply: {type: Boolean, default:false}
})

module.exports = mongoose.model('Post', Post)