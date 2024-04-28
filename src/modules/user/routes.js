const express = require('express');
const userController = require('./controllers/UserController');

const router = express.Router();

router.post('/', userController.createUser);
router.post('/followers/following', userController.createFollowersAndFollowingFromUser);

module.exports = router
