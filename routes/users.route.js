const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, getUserCount} = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();


router.route('/')
    .get(verifyToken, getUsers)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

router.route('/get/count')
    .get(getUserCount)

module.exports = router;