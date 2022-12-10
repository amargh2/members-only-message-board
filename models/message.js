const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema ({
  author: {type:Schema.Types.ObjectId, ref:'User'},
  date:Date,
  message: {type:String, minLength:15, required:true},
  to: {type:Schema.Types.ObjectId, ref: 'User'},
  submessages: Array
})

/*Message.virtual('url')
  .get(function() {
    return `/posts/${this._id}`
  })*/

module.exports = mongoose.model('Message', Message)