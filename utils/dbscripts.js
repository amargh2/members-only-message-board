// just playing around with mongoose and the objects it returns in this file

const mongoose = require('mongoose');
const { findOne } = require('../models/post');
const Post = require('../models/post');
const reply = require('../models/reply');
const Message = require('../models/message');
const User = require('../models/user');


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
      author: sender._id,
      date: new Date(),
      message: 'hey nerd just wanna tell you i think you are strong and good',
      to: to._id,
      submessages: []
    })
    await message.save()
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

getMessage()


module.exports = searchUserName()