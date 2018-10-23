const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../../config/keys").secret;
const passport = require("passport");
const User = require("../../models/User");

// @route GET api/users/test
// @desc Test user route
// @access public
router.get("/test", (req, res) => res.json({ hello: "user" }));

// @route POST api/users/register
// @desc Register user
// @access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/loing
// @desc Login User/Returns JWT Token
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    //Check user exists
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Sign token
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        };
        const token = jwt.sign(payload, secret, { expiresIn: 3600 });
        res.json({
          success: true,
          token: "Bearer " + token
        });
      }
      return res.status(404).json({ password: "Password incorrect." });
    });
  });
});

// @route GET api/users/current
// @desc Returns current user
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
