const express = require('express');
const Repository = require('./routes');

const router = express.Router();

router.use('/repositories', Repository);

module.exports = router
