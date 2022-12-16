const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema ({
  from_user: {type:Schema.Types.ObjectId, ref:'User'},
  date:Date,
  message: {type:String, minLength:3, required:true},
  to_user: {type:Schema.Types.ObjectId, ref: 'User'},
  replies: [{type: Schema.Types.ObjectId, ref:'Message'}],
  parent_message: {type:Schema.Types.ObjectId, ref:'Message', required: false},
})

/*Message.virtual('url')
  .get(function() {
    return `/posts/${this._id}`
  })*/

module.exports = mongoose.model('Message', Message)