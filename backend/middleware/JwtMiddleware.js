const jwt = require('jsonwebtoken');

class JwtMiddleware {
  constructor() {
    this.secretKey = process.env.JWT_SECRET; // Utiliser la variable d'environnement si elle existe
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Utiliser la variable d'environnement si elle existe
  }

  // Méthode pour vérifier le token
  authenticateToken() {
    return (req, res, next) => {
      // Je vais aussi logguer ici pour le débogage
      console.log('Middleware JWT: Vérification du token...');
      const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token du header

      if (!token) {
        console.log('Middleware JWT: Aucun token trouvé.');
        return res.sendStatus(401); // Unauthorized
      }

      jwt.verify(token, this.secretKey, (err, user) => {
        if (err) {
          console.log('Middleware JWT: Token invalide.', err.message);
          return res.sendStatus(403); // Forbidden
        }
        console.log('Middleware JWT: Token valide. Utilisateur:', user);
        req.user = user; // Ajouter l'utilisateur à la requête
        next();
      });
    };
  }

  // Méthode pour générer un token
  generateToken(user) {
     console.log('Middleware JWT: Génération de token pour l\'utilisateur', user.id);
    return jwt.sign({ id: user.id, role: user.role }, this.secretKey, { expiresIn: this.expiresIn });
  }

  // Méthode pour changer la clé secrète
  setSecretKey(newSecretKey) {
    this.secretKey = newSecretKey;
  }

  // Méthode pour changer la durée de validité du token
  setExpiresIn(newExpiresIn) {
    this.expiresIn = newExpiresIn;
  }
  // Dans JwtMiddleware.js, ajoutez ou modifiez la méthode authenticateToken
authenticateToken() {
    return (req, res, next) => {
      console.log('Middleware JWT: Vérification du token...');
      const token = req.headers['authorization']?.split(' ')[1];
  
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
}

module.exports = new JwtMiddleware();