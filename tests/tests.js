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
  before (function () {
    mongoose.connect(process.env.MONGO_URI)
  })
  it('adds new users to the database when data is valid', async function(done) {
    request(app)
      .post('/sign-up-form')
      .set('Content-Type', 'application/json')
      .send({
        first_name: 'Anthony', 
        last_name: 'Margherio',
        username: 'ideogesis',
        password: 'DummyPassword2!',
        confirmpassword: 'DummyPassword2!',
        birthday:'6-16-1988'
      })
    .done()
    const createdUser = async () => await JSON.stringify(User.find({username:'ideogesis'}))
  
    expect(createdUser()).to.include({first_name:'Anthony'})
    done()
  })

})