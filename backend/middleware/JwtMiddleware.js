const jwt = require('jsonwebtoken');

class JwtMiddleware {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'votre_clé_secrète_jwt'; // Utiliser la variable d'environnement si elle existe
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'votre_clé_secrète_refresh'; // Clé pour les refresh tokens
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Utiliser la variable d'environnement si elle existe
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Durée de vie des refresh tokens
  }

  // Méthode pour vérifier le token
  authenticateToken() {
    return (req, res, next) => {
      console.log('Middleware JWT: Vérification du token...');
      
      // Récupérer le token du cookie ou du header
      const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
      
      if (!token) {
        console.log('Middleware JWT: Aucun token trouvé.');
        return res.status(401).json({ message: 'Accès non autorisé. Token requis.' });
      }

      jwt.verify(token, this.secretKey, async (err, user) => {
        if (err) {
          console.log('Middleware JWT: Token invalide.', err.message);
          return res.status(403).json({ message: 'Token invalide ou expiré.' });
        }
        
        // Vérifier si l'utilisateur a au moins un rôle
        try {
          const User = require('../models/User'); // Importer ici pour éviter les dépendances circulaires
          const roles = await User.getUserRoles(user.id);
          
          if (!roles || roles.length === 0) {
            return res.status(403).json({ message: 'Utilisateur sans rôle. Accès refusé.' });
          }
          
          // Ajouter les rôles à l'objet user dans la requête
          user.roles = roles;
          req.user = user;
          next();
        } catch (error) {
          console.error('Erreur lors de la vérification des rôles:', error);
          return res.status(500).json({ message: 'Erreur lors de la vérification des droits d\'accès.' });
        }
      });
    };
  }

  // Méthode pour générer un token d'accès
  generateToken(user) {
    console.log('Middleware JWT: Génération de token pour l\'utilisateur', user.id);
    return jwt.sign(user, this.secretKey, { expiresIn: this.expiresIn });
  }

  // Méthode pour générer un refresh token
  generateRefreshToken(user) {
    console.log('Middleware JWT: Génération de refresh token pour l\'utilisateur', user.id);
    return jwt.sign(user, this.refreshSecretKey, { expiresIn: this.refreshExpiresIn });
  }

  // Méthode pour vérifier un refresh token
  verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshSecretKey);
  }

  // Méthode pour changer la clé secrète
  setSecretKey(newSecretKey) {
    this.secretKey = newSecretKey;
  }

  // Méthode pour changer la durée de validité du token
  setExpiresIn(newExpiresIn) {
    this.expiresIn = newExpiresIn;
  }
}

module.exports = new JwtMiddleware();