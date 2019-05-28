const express = require('express');
const router = express.Router();
const auth = require('./verifyToken');

router.get('/',auth, (req, res) => {
    res.json({
        posts: {
            title: 'my first post',
            description: 'random data you shouldnt access'
        }
    });
});

module.exports = router;