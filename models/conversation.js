const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversation = new Schema ({
  participants: [{type:Schema.Types.ObjectId, ref:'User'}],
  date:Date,
  messages: [{type: Schema.Types.ObjectId, ref:'Message'}],
  conversation_id: {type:Schema.Types.ObjectId, ref:'Message', required: false},
})

module.exports = mongoose.model('Conversation', Conversation)