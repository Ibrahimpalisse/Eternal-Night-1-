const rateLimit = require('express-rate-limit');

class RateLimitMiddleware {
  constructor() {
    this.defaultLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limite chaque IP à 100 requêtes par fenêtre
      message: 'Trop de requêtes de votre IP, veuillez réessayer plus tard.'
    });
  }

  // Méthode pour obtenir le limiteur par défaut
  getDefaultLimiter() {
    return this.defaultLimiter;
  }

  // Méthode pour créer un limiteur personnalisé
  createLimiter(options) {
    return rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000,
      max: options.max || 100,
      message: options.message || 'Trop de requêtes de votre IP, veuillez réessayer plus tard.'
    });
  }
}

module.exports = new RateLimitMiddleware();