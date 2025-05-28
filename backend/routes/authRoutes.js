const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const securityMiddleware = require('../middleware/SecurityMiddleware');

// Routes publiques (pas besoin d'authentification)
// Mais protégées contre les attaques par force brute avec le rate limiter
router.post('/register', securityMiddleware.rateLimit.getDefaultLimiter(), authController.register);
router.post('/login', securityMiddleware.rateLimit.getDefaultLimiter(), authController.login);
router.post('/verify-email', securityMiddleware.rateLimit.getDefaultLimiter(), authController.verifyEmail);
router.post('/resend-verification', securityMiddleware.rateLimit.getDefaultLimiter(), authController.resendVerification);
router.post('/forgot-password', securityMiddleware.rateLimit.getDefaultLimiter(), authController.forgotPassword);
router.post('/reset-password', securityMiddleware.rateLimit.getDefaultLimiter(), authController.resetPassword);

// Route protégée nécessitant une authentification
router.get('/me', 
    securityMiddleware.jwt.authenticateToken(),
    authController.getCurrentUser
);

module.exports = router; 