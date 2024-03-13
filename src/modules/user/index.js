const express = require('express');
const User = require('./routes');

const router = express.Router();

router.use('/user', User);

module.exports = router
