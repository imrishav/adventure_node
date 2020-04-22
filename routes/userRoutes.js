const express = require('express');
const {
  getAllUsers,
  getUser,
  createUsers,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMe', authController.protect, updateMe);
router.delete('/deleteMe', authController.protect, deleteMe);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.route('/').get(getAllUsers).post(createUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
