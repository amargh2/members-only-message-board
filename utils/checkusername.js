// just playing around with mongoose and the objects it returns in this file

User = require('../models/user')
const mongoose = require('mongoose');
const Post = require('../models/post');
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


async function addPost() {
  try {
    const user = new post{()}
  }
}

module.exports = searchUserName()