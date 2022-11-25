const mongoose = require('mongoose')
const User = require('../models/user');

const validationRoutine = function (body) {  
  body('password', 'A strong password must be 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one symbol.').trim().isStrongPassword(), 
    body('username', 'Usernames must be at least 4 characters.').trim().isLength({min:4}),
    body('first_name', 'Names must only contain alphabet characters.').trim().isAlpha(),
    body('last_name', 'Names must only contain alphabet characters.').trim().isAlpha(),
    
    //custom validator to check if the passwords match
  
    body('password').custom((value, {req}) => {
      if (value !== req.body.confirmpassword) {
        throw new Error('Passwords must match.')
      } else {
        return true
      }
    }),
    
    //custom validator to check if username is taken
    body('username').custom(async (value) => {
        try {
          mongoose.connect(process.env.MONGO_URI)
          const user = await User.find({username:value})
          console.log('hey hey you you' + user)
          if (user[0] !== undefined) {
            throw new Error('Username is taken.')
          } else {
            return true
          }      
        } catch (err) {
          throw err
        }
    })
  }
module.exports = validationRoutine