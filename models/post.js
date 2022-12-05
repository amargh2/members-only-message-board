const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema ({
  author: {type:Schema.Types.ObjectId, ref:'User'},
  date:Date,
  subject: {type: String, minLength:5},
  message: {type:String, minLength:15, required:true},
  replies: [{type:Schema.Types.ObjectId, ref:'Reply', ref:'User'}],
})

Post.virtual('url')
  .get(function() {
    return `/posts/${this._id}`
  })

module.exports = mongoose.model('Post', Post)