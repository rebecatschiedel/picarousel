const express = require('express');
const router = express.Router();

router.get('/problem', (req, res) => {
    res.render('error', {title: "OOOPS!!"})
});

module.exports = router;