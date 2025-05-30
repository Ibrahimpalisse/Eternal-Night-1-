const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwtMiddleware = require('../middleware/JwtMiddleware');

exports.register = async (req, res) => {
  try {
    // Hasher le mot de passe avant de créer l'utilisateur
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    // Remplacer le mot de passe en clair par le mot de passe hashé
    const userData = {
      ...req.body,
      password: hashedPassword
    };
    
    console.log('Données utilisateur avant création:', { ...userData, password: '[PROTECTED]' });
    
    const result = await User.create(userData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur d\'inscription:', error);
    
    // Gérer spécifiquement l'erreur d'email déjà utilisé
    if (error.message === 'Cet email est déjà utilisé.') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    // Autres erreurs
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Une erreur est survenue lors de l\'inscription.' 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.'
      });
    }
    
    // Vérifier si l'email est vérifié
    const isVerified = await User.isEmailVerified(user.id);
    
    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter.',
        needVerification: true,
        email: user.email
      });
    }
    
    // Récupérer les rôles de l'utilisateur
    const roles = await User.getUserRoles(user.id);
    
    // Récupérer les rôles avec descriptions
    const rolesWithDescription = await User.getUserRolesWithDescription(user.id);
    
    // Générer un token JWT
    const token = jwtMiddleware.generateToken({ 
      id: user.id, 
      email: user.email,
      roles
    });
    
    // Générer un refresh token
    const refreshToken = jwtMiddleware.generateRefreshToken({
      id: user.id,
      email: user.email
    });
    
    // Récupérer le profil utilisateur
    const profile = await User.getUserProfile(user.id);
    
    // Définir la durée d'expiration des cookies en fonction de rememberMe
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 jours ou 1 jour
    
    // Définir les options de sécurité pour les cookies
    const cookieOptions = {
      httpOnly: true, // Empêche l'accès via JavaScript
      secure: process.env.NODE_ENV === 'production', // Cookies sécurisés en production
      sameSite: 'strict', // Protection contre les attaques CSRF
      maxAge: maxAge
    };
    
    // Stocker les tokens dans des cookies sécurisés
    res.cookie('access_token', token, cookieOptions);
    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      path: '/api/auth/refresh-token' // Le refresh token n'est accessible que par cette route
    });
    
    // Réponse avec le token (pour la compatibilité) et les informations de l'utilisateur
    res.json({
      success: true,
      token, // Conserver pour la compatibilité avec le frontend actuel
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        rolesWithDescription,
        isVerified,
        profile,
        created_at: user.created_at
      },
      message: 'Connexion réussie.'
    });
    
  } catch (error) {
    console.error('Erreur dans le contrôleur de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la connexion.'
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await User.verifyEmail(email, code);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur de vérification d\'email:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Une erreur est survenue lors de la vérification.' 
    });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.resendVerificationCode(email);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur de renvoi de code:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Une erreur est survenue lors du renvoi du code.' 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await User.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur de demande de réinitialisation:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Une erreur est survenue lors de la demande de réinitialisation.' 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;
    const result = await User.resetPassword(code, password);
    res.json(result);
  } catch (error) {
    console.error('Erreur dans le contrôleur de réinitialisation de mot de passe:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe.' 
    });
  }
};

// Contrôleur pour récupérer les informations de l'utilisateur authentifié
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user est défini par le middleware authenticateToken
    const userId = req.user.id;
    
    // Récupérer les informations complètes de l'utilisateur
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur dans le contrôleur getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des informations de l\'utilisateur.'
    });
  }
};

// Méthode pour vérifier la validité d'un token de réinitialisation de mot de passe
exports.checkResetToken = async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Code de réinitialisation manquant' });
    }
    
    // Vérifier si le code existe et n'est pas expiré
    const [rows] = await User.db.execute(
      'SELECT user_id FROM verification WHERE password_reset_code = ? AND password_reset_expires > NOW()',
      [code]
    );
    
    if (!rows.length) {
      return res.status(200).json({ valid: false, message: 'Code de réinitialisation invalide ou expiré' });
    }
    
    return res.status(200).json({ valid: true, message: 'Code de réinitialisation valide' });
  } catch (error) {
    console.error('Erreur lors de la vérification du code de réinitialisation:', error);
    return res.status(500).json({ valid: false, message: 'Erreur lors de la vérification du code de réinitialisation' });
  }
};

// Méthode pour la déconnexion
exports.logout = async (req, res) => {
  try {
    // Supprimer les cookies d'authentification
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    // Pour l'instant, nous retournons simplement un succès
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la déconnexion'
    });
  }
};

// Endpoint pour rafraîchir le token
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token manquant'
      });
    }
    
    // Vérifier et décoder le refresh token
    const decoded = jwtMiddleware.verifyRefreshToken(refreshToken);
    
    // Récupérer l'utilisateur
    const user = await User.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Récupérer les rôles de l'utilisateur
    const roles = await User.getUserRoles(user.id);
    
    // Générer un nouveau token JWT
    const newToken = jwtMiddleware.generateToken({
      id: user.id,
      email: user.email,
      roles
    });
    
    // Définir les options de sécurité pour les cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 jour
    };
    
    // Mettre à jour le cookie access_token
    res.cookie('access_token', newToken, cookieOptions);
    
    // Réponse avec le nouveau token (pour la compatibilité)
    res.json({
      success: true,
      token: newToken,
      message: 'Token rafraîchi avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token invalide ou expiré'
    });
  }
};