const express = require("express");
const router = express.Router();

// @route GET api/users/test
// @desc Test user route
// @access public
router.get("/test", (req, res) => res.json({ hello: "user" }));

module.exports = router;
