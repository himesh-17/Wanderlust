const express = require('express');
const router = express.Router({strict : true , caseSensitive : true});

router.get("/privacy", (req, res) => {
  res.render("includes/privacy");
});
router.get("/terms", (req, res) => {
  res.render("includes/terms");
});

module.exports = router;