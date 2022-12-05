//require all the things
const mongoose = require('mongoose')
const User = require('../models/user');
require('dotenv').config()
const Post = require('../models/post');
const Reply = require('../models/reply')

exports.getPost = async function(req, res) {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const post = await Post.findById(req.params.postid).populate('author');
    const replies = await Reply.find({parent_post:post._id}).populate('author')
    res.render('post', {post: post, replies: replies})
  } catch (err) {
    throw err
  }
}

exports.replyToPost = async function(req, res) {
  try {
    mongoose.connect(process.env.MONGO_URI)
    const parentPost = await Post.findById(req.params.postid)
    const reply = new Reply({
      author: req.user.id || currentUser.id,
      date: new Date(),
      subject: req.body.subject,
      message: req.body.reply,
      parent_post: parentPost._id
    })
    parentPost.replies.push(reply._id)
    await parentPost.save()
    await reply.save()
    res.redirect(`/posts/${req.params.postid}`)
  } catch (err) {
    throw err
  }
}

exports.deletePost = async function (req, res) {
  try {
    mongoose.connect(process.env.MONGO_URI);
    //calling post to perform final user === user check (users can't delete posts that aren't theirs)
    const post = await Post.findById(req.params.postid).populate('author')
    if (post.author.username === req.user.username) {
      await Post.findByIdAndDelete(post._id)
      res.redirect(post.author.url)
    } else {
      res.redirect('/')
    }
  } catch (err) {
    throw err
  }
}