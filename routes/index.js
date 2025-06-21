const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registration form' });
});

router.get('/thankyou', (req, res) => {
    res.render('thankyou', { title: 'Thank You Message' });
});

router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrations', { title: 'Listing registrations', registrations });
    })
    .catch((err) => { 
      console.log(err);
      res.send('Sorry! Something went wrong.'); 
    });
}));

router.post('/register', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
        check('username')
        .isLength({ min: 1 })
        .withMessage('Please enter a username'),
        check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    ],
    async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const registration = new Registration(req.body);

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);

        // set user password to hashed password
        registration.password = await bcrypt.hash(registration.password, salt);

        // save registration
        await registration.save();

        res.redirect('/thankyou');
      } catch (err) {
        console.log(err);
        res.send('Sorry! Something went wrong.');
      }
    } else {
      res.render('register', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
          }
    });

module.exports = router;