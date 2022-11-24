// one large file for now while learning
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const expect = require('chai').expect
const request = require('supertest');
const chai = require('chai');
const { response } = require('../app');
chai.use(require('chai-dom'))
const fs = require('fs')
describe('Message Board', function() {
  it('should understand basic math', function(done) {
    5 === 5 ? done() : done(new Error("lol math"))
  }
)})

describe('User registration', function() {
  //connect to db before making requests
  before(function () {
    mongoose.connect(process.env.MONGO_URI)
  })
  
  //make a good request and check database to ensure user creation
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
      }).then(function (err, res) {
        if (err) throw err
      })
    const user = async () => await User.find({username:'ideogesis'}).lean()
    expect(user()).to.include('ideogesis', done())
  })

  //tests of validation
  describe('validation', function(){
    // all these tests make a request to the server
    // the response is stored as responseObject, then inspected for error text with Chai
    
    it('rejects bad passwords and alerts the user', async function() {
      const responseObject = await request(app)
        .post('/sign-up-form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          first_name:'Anthony',
          password:'rapture',
          username:'loler',
          last_name: 'Margherio',
          birthday: '6-16-88'
        })
        console.log(responseObject.text)
        expect(responseObject.text).to.have.string('A strong password must:')
      })


      it('rejects bad usernames and alerts the user', async function() {
        const responseObject = await request(app)
          .post('/sign-up-form')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send({
            first_name:'Anthony',
            password:'ezpw',
            username:'lol',
            last_name: 'Margherio',
            birthday: '6-16-88'
          })
          expect(responseObject.text).to.include('Usernames must be at least')
        })


        it('rejects bad first and last names and alerts the user', async function() {
          const responseObject = await request(app)
            .post('/sign-up-form')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name: 'Anth54ony', 
              last_name: 'Marghe7rio',
              username: 'ideogesis',
              password: 'DummyPassword2!',
              confirmpassword: 'DummyPassword2!',
              birthday:'6-16-1988'
            })
            expect(responseObject.text).to.include('Names must only contain alphabet characters')
          })

          it('rejects mismatched passwords and provides error text', async function() { 
            const responseObject = await request(app)
            .post('/sign-up-form')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name: 'Anthony', 
              last_name: 'Margherio',
              username: 'ideogesis',
              password: 'DummyPassword2!',
              confirmpassword: 'DummyPass4word2!',
              birthday:'6-16-1988'
            })
            expect(responseObject.text).to.include('Passwords do not match.')
          })
  })

  //delete records, execute done callback when complete
  after(async function (done) {
    await User.deleteMany({}, done())
  })

})