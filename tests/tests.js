// one large file for now while learning
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const expect = require('chai').expect
const request = require('supertest');
const chai = require('chai');
const { response } = require('../app');
chai.use(require('chai-dom'))

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

  describe('validation', function(){
    it('rejects bad passwords', async function(done) {
      //sending post req to sign up form with bad password
      const responseObject = request(app)
        .post('/sign-up-form')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          first_name:'Anthony',
          password:'ezpw',
          username:'loler',
          last_name: 'Margherio',
          birthday: '6-16-88'
        }).then(response => {
          return response
        })
        expect(responseObject).to.have.text('Invalid Password', done())
      })

      it('rejects bad passwords', async function(done) {
        //sending post req to sign up form with bad password
        const responseObject = request(app)
          .post('/sign-up-form')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send({
            first_name:'Anthony',
            password:'ezpw',
            username:'loler',
            last_name: 'Margherio',
            birthday: '6-16-88'
          }).then(response => {
            return response
          })
          expect(responseObject).to.have.text('Invalid Password', done())
        })


        it('rejects bad passwords', async function(done) {
          //sending post req to sign up form with bad password
          const responseObject = request(app)
            .post('/sign-up-form')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name:'Anthony',
              password:'ezpw',
              username:'loler',
              last_name: 'Margherio',
              birthday: '6-16-88'
            }).then(response => {
              return response
            })
            expect(responseObject).to.have.text('Invalid Password', done())
          })


          it('rejects bad passwords', async function(done) {
            //sending post req to sign up form with bad password
            const responseObject = request(app)
              .post('/sign-up-form')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send({
                first_name:'Anthony',
                password:'ezpw',
                username:'loler',
                last_name: 'Margherio',
                birthday: '6-16-88'
              }).then(response => {
                return response
              })
              expect(responseObject).to.have.text('Invalid Password', done())
            })
  })

  //delete records, execute done callback when complete
  after(async function (done) {
    await User.deleteMany({}, done())
  })

})