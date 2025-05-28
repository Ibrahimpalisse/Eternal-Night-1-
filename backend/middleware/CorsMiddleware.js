const cors = require('cors');

class CorsMiddleware {
  constructor() {
    // Liste des origines autorisées
    this.allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : []; // Sépare les origines par des virgules

    // Configuration CORS
    this.corsOptions = {
      origin: (origin, callback) => {
        if (this.allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Autoriser les cookies
    };
  }

  // Méthode pour obtenir le middleware CORS
  getCorsMiddleware() {
    return cors(this.corsOptions);
  }

  // Méthode pour ajouter une origine autorisée
  addAllowedOrigin(origin) {
    if (!this.allowedOrigins.includes(origin)) {
      this.allowedOrigins.push(origin);
    }
  }
}

module.exports = new CorsMiddleware();