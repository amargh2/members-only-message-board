const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Reply = new Schema({
  author:{type:Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  message: String,
  parent_post: {type:Schema.Types.ObjectId, ref:'Post'}
})

module.exports = mongoose.model('Reply', Reply)