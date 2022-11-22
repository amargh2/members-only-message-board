// one large file for now while learning
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const expect = require('chai').expect
const request = require('supertest');

describe('Message Board', function() {
  it('should understand basic math', function(done) {
    5 === 5 ? done() : done(new Error("lol math"))
  }
)})

describe('User registration', function(done) {
  //connect to db before making requests
  before(function () {
    mongoose.connect(process.env.MONGO_URI)
  })
  it('adds new users to the database when data is valid', async function(done) {
    request(app)
      .post('/sign-up-form')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        first_name: 'Anthony', 
        last_name: 'Margherio',
        username: 'ideogesis',
        password: 'DummyPassword2!',
        confirmpassword: 'DummyPassword2!',
        birthday:'6-16-1988'
      }).end(function (err, res) {
        if (err) throw err
      })
    const user = async () => await User.find({username:'ideogesis'}).lean()
    expect(user()).to.include('ideogesis', done())
  })
  after(async function (done) {
    await User.deleteMany({}, done())
  })
})