// just playing around with mongoose and the objects it returns in this file

const mongoose = require('mongoose');
const { findOne } = require('../models/post');
const Post = require('../models/post');
const reply = require('../models/reply');
const Message = require('../models/message');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const message = require('../models/message');

require('dotenv').config()
async function searchUserName(value) {
  //if the name exists, return false (ie an error)
  try {
    mongoose.connect(process.env.MONGO_URI);
    const user = await User.find({username:value}).lean()
    console.log(user[0])
  } catch (err) {
    throw err
  }
}



async function clearUsers() {
  try {
    await User.deleteMany({})
  } catch (err) {
    throw err
  }
}


async function addUser() {
  try {
    const user = new User({
      name: 'Anthony',
      username:'ideogesis',
      password:'2022IsAlmostOver',
      birthday:'06-16-1988'
    })
    await user.save()
    return
  } catch (err) {
    throw err
  }
}


async function getPost() {
  try {
    const post = await Post.findById("6380046fb17d5ea58747a7e7").populate('author')
    console.log(post)
    console.log(post.author, post.author.username)
  } catch (err) {
    throw err
  }
}

async function addPost() {
  try {
    const post = new Post({
      author: await User.findOne({username:'ideogesis'}),
      message: 'Test post.',
      date: new Date().toLocaleDateString()
    })
    post.save()
  } catch (err) {
    throw err
  }
}

async function removePosts() {
  try {
    await Post.deleteMany({})
    console.log('delete done')
  } catch (err) {
    throw err
  }
}

async function removeReplies(){
  try {
    await reply.deleteMany({});
    console.log('delete many done')
  } catch (err) {
    throw err
  }
}

async function createMessage(){
  try {
    mongoose.connect(process.env.MONGO_URI)
    const sender = await User.findOne({username:'plender'})
    const to = await User.findOne({username:'ideogesis'})
    const message = new Message({
      from_user: sender._id,
      to_user: to._id,
      date: new Date(),
      message: 'hey nerd just wanna tell you i think you are strong and good',
    })
    await message.save()
    console.log('done')
  } catch (err) {
    throw err
  }
}

async function getMessage(){
  try {
    mongoose.connect(process.env.MONGO_URI)
    const to = await User.findOne({username:'ideogesis'})
    console.log(to)
    const messages = await Message.find({to:to.id }).populate('author')
    console.log(messages)
  } catch (err) {
    throw err
  }
}

async function clearMessages() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    await Message.deleteMany({})
    await Conversation.deleteMany({})
    console.log('done')
  } catch (err) {
    throw err
  } 
    
}

async function searchConversations() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const search = await Conversation.find(
      {participants:{$all:['6397f020d1108e1ce01ec746', '63911dd96152608145bc0918']}}
    )
    .populate(
      {
        path: 'messages',
        populate:[ 
          {
            path: 'from_user',
            model: 'User'
          },
          {
            path:'to_user',
            model:'User'
          } 
        ]
      }
    )
    console.log(search[0].messages.at(-1))
  } catch (err) {
    throw err
  }
}

clearMessages()

module.exports = searchUserName()