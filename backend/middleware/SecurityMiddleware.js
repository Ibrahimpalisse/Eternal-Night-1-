const corsMiddleware = require('./CorsMiddleware');
const jwtMiddleware = require('./JwtMiddleware');
const roleMiddleware = require('./RoleMiddleware');
const rateLimitMiddleware = require('./RateLimitMiddleware');

class SecurityMiddleware {
  constructor() {
    this.cors = corsMiddleware;
    this.jwt = jwtMiddleware;
    this.role = roleMiddleware;
    this.rateLimit = rateLimitMiddleware;
  }

  // Méthode pour configurer tous les middlewares dans une application Express
  configureApp(app) {
    // Appliquer CORS
    app.use(this.cors.getCorsMiddleware());
    
    // Appliquer le limiteur de requêtes global
    app.use(this.rateLimit.getDefaultLimiter());
    
    // Autres configurations générales peuvent être ajoutées ici
    
    return app;
  }
}

module.exports = new SecurityMiddleware();