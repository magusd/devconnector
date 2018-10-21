const express = require("express");
const router = express.Router();

// @route GET api/posts/test
// @desc Test post route
// @access public
router.get("/test", (req, res) => res.json({ hello: "post" }));

module.exports = router;
