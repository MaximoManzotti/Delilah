const express = require('express');
const router = express.Router()
const User = require('../models/User');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/auth')
const checkAdmin = require ('../middleware/Admin')
//GET /users

router.get('/',checkAdmin,  async (req, res) => {
  try {
    const user = await User.findAll();
    console.log('Getting users')
    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//POST users/login
router.post('/login', async (req, res) => {
  const email = req.body.email
  try {

    const user = await User.findOne({
      where: {
        email: email
      }
    });
    if (user.lenght > 1) {
      res.status(401).json({ message: ' Unauthorized ' });

    } else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) { res.status(401).json({ message: ' Unauthorized ' }) }
        else {
          let token = JWT.sign({
            email: email,
          }, process.env.SECRET, { expiresIn: '1h' })
          res.cookie("token", token, { httpOnly: true });
          res.cookie("id", user.id ,{httpOnly: true} )
          res.status(200).json({ message: user, token })
        }
      })
    }
  } catch (err) {
    res.status(400).json({ error: "User or Password are incorrect" });
  }
});

// POST user/register

router.post('/register' ,async (req, res) => {
  const data = req.body;
  let {
    username,
    firstname,
    lastname,
    email,
    phone,
    address,
    password
  } = data;

  try {
    const usernameAlreadyRegistered = await User.findAll({
      where: { username },
    });
    const emailAlreadyRegistered = await User.findAll({ where: { email } });
     
    if (usernameAlreadyRegistered.length) {
      res
        .status(409)
        .json({ message: `Username in use, Please chose other` });
    } else if (emailAlreadyRegistered.length) {
      res.status(409).json({
        message: `Email is linked with a acount`,
      });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const newUser = await User.create({
            username,
            firstname,
            lastname,
            email,
            phone,
            address,
            password: hash
          });
          res.status(200).json({ message: 'User created succesfully!' });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "faltan campos o se produjo un error" });
  }
});
//POST DELETE

router.delete('/delete', async (req, res) => {
  try{
  const data = req.body.email;
    const removedUser = await User.destroy({ where: { email: data} });
    if (!removedUser) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User Deleted!' });
    }}catch(err){
    res.status(500).json({ message: "Delete failed" });
  }
});
module.exports = router;