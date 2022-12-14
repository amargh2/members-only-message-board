const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Response = new Schema({
  author:{type:Schema.Types.ObjectId, ref: 'User'},
  date: Date,
  message: String,
  parent_message: {type:Schema.Types.ObjectId, ref:'Post'},
  parent_post_id: String,
})

/*Reply.virtual('url')
  .get(function() {
    return `/posts/${this.id}`
  })*/

module.exports = mongoose.model('Response', Response)