const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: 'Homepage'})
});

router.post("/", (req, res) => {
    res.redirect(`/photos/${req.body.search}`);
});

module.exports = router;