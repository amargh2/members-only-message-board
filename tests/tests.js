// one large file for now while learning
const User = require('../models/user')
const app = require('../app')
const mongoose = require('mongoose')
const expect = require('chai').expect
const request = require('supertest');
const chai = require('chai');
const { response } = require('../app');
chai.use(require('chai-dom'))
const fs = require('fs');
const testUser = request.agent(app)
const Post = require('../models/post')
describe('User registration', function() {
  //connect to db before making requests
  before(function () {
    mongoose.connect(process.env.MONGO_URI)
  })
  
  //make a good request and check database to ensure user creation
  it('adds new users to the database when data is valid', async function(done) {
    request(app)
      .post('/register')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        first_name: 'Anthony', 
        last_name: 'Margherio',
        username: 'plender',
        password: 'DummyPassword2!',
        confirmpassword: 'DummyPassword2!',
        birthday:'6-16-1988'
      }).then(function (err, res) {
        if (err) throw err
      })
    const user = async () => await User.find({username:'ideogesis'}).lean()
    expect(user()).to.include('ideogesis', done())
  })})

  //tests of validation
  describe('validation', function(){
    // all these tests make a request to the server
    // the response is stored as responseObject, 
    //then inspected for error text with Chai expect
    
    it('rejects bad passwords and alerts the user', async function() {
      const responseObject = await request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          first_name:'Anthony',
          password:'rapture',
          username:'loler',
          last_name: 'Margherio',
          birthday: '6-16-88'
        })
        expect(responseObject.text).to.have.string('A strong password must')
      })


      it('rejects bad usernames and alerts the user', async function() {
        const responseObject = await request(app)
          .post('/register')
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
            .post('/register')
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
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name: 'Anthony', 
              last_name: 'Margherio',
              username: 'ideogesis',
              password: 'DummyPassword2!',
              confirmpassword: 'DummyPassworwwfd2!',
              birthday:'6-16-1988'
            })
            expect(responseObject.text).to.include('Passwords must match.')
          })

        it('does not allow duplicate user names', async function(){
          const responseObject = await request(app)
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name: 'Anthony', 
              last_name: 'Margherio',
              username: 'ideogesis',
              password: 'DummyPassword2!',
              confirmpassword: 'DummyPassword2!',
              birthday:'6-16-1988'
            })
            expect(responseObject.text).to.include('is taken.')
        })

        it('repopulates the form with non-sensitive user input if rejected', async function() {
          const responseObject = await request(app)
            .post('/register')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
              first_name: 'Anthony', 
              last_name: 'Margherio',
              username: 'ideogesis',
              password: 'DummyPassword2!',
              confirmpassword: 'DummyPassword2!',
              birthday:'6-16-1988'
            })
            expect(responseObject.text).to.include('Anthony').and.to.include('Margherio').and.to.include('ideogesis')
        })
  })

  //tests for the post model
  describe('post functions', function() {
    
    //creating an authenticated user that 'remembers' it's logged in with superagent (via supertest)
    before(async function() {
      mongoose.connect(process.env.MONGO_URI);
      await testUser
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth('ideogesis', 'DummyPassword2!')
        .send({
          username: 'ideogesis',
          password: 'DummyPassword2!'
        })
    })
    //this function calls the user we just made to do an authenticated user only function
    it('allows a user to post to the main page', async function(){
      mongoose.connect(process.env.MONGO_URI)
      try {
        const author = await User.findOne({username:'ideogesis'})
        const response = await testUser
        .post('/post')
        .auth('ideogesis', 'DummyPassword2!')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          author: author._id,
          date: new Date().toLocaleDateString(),
          message: 'silly little post'
        })
        expect(response.statusCode).to.equal(302)
      } catch (err) {
      } 
    })

    it('redirects unauthenticated users to the login page', async function() {
      // to simulate an unauthenticated request, just call the app w/o agent
      try {
        const response = await request(app)
          .get('/')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
        expect(response.statusCode).to.equal(302)
      }
      catch (err) {
        throw err
      }  
    })

      //tests for authenticated view feature
    it('displays user information on the profile page', async function() {
      try {
        const response = await testUser
          .get('/user/ideogesis')
          .auth('ideogesis', 'DummyPassword2!')
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
        expect(response.text).to.include('Anthony')
      } catch (err) {
        throw(err)
      }
    })

  

  it('displays a post to an authenticated user', async function() {
    //originally had the hard coded url which uses object id, which changed when i cleared the db 
    //so creating a bit more flexible test that just gets the id of the post we created further up based on text match
    // same story for the user id - just calling the user and getting the id
    try {
      mongoose.connect(process.env.MONGO_URI)
      const post = await Post.findOne({message:'silly little post'})
      const response = await testUser
        .get(`/posts/${post.id}`)
        .auth('ideogesis', 'DummyPassword2!')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response.text).to.include('silly little post')
    } catch (err) {
      throw(err)
    }
  })

  it('allows an authenticated user to post a reply, and redirects to the post', 
    async function() {
    //originally had the hard coded url which uses object id, which changed when i cleared the db 
    //so creating a bit more flexible test that just gets the id of the post we created further up based on text match
    try {
      mongoose.connect(process.env.MONGO_URI)
      const author = await User.find({username:'ideogesis'})
      const post = await Post.findOne({message:'silly little post'})
      const response = await testUser
        .post(`/posts/${post._id}/reply`)
        .auth('ideogesis', 'DummyPassword2!')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({
          author: author._id,
          date: new Date(),
          message: 'this is a reply',
          parent_post: post._id
        })
      expect(response.statusCode).to.equal(302) 
      //currently just checks the redirect happened, which means the rest of the code executed properly
    } catch (err) {
      throw(err)
    }
  })

  it('allows a user to delete a post they wrote', async function() {
    try {
      mongoose.connect(process.env.MONGO_URI);
      const post = await Post.findOne({username:'ideogesis'})
      const id = post.id
      console.log(id)
      await testUser
        .post(`/posts/${post.id}/delete`)
        .auth('ideogesis', 'DummyPassword2!')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      const postAfterDeletion = await Post.findById(post.id)
      console.log(postAfterDeletion)
      expect(postAfterDeletion).to.equal(null)
    } catch (err) {
      throw err
    }
  })

})
  //delete records, execute done callback when complete
  //after(async function (done) {
    //await User.deleteMany({}, done())
  //})


