const express = require('express');
const viewsController = require('../controllers/viewsController');
const authControllers = require('../controllers/authController');

const router = express.Router();

router.get('/', authControllers.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authControllers.isLoggedIn, viewsController.getTour);
router.get('/login', authControllers.isLoggedIn, viewsController.login);
router.get('/me', authControllers.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authControllers.protect,
  viewsController.updateUserData
);

module.exports = router;
