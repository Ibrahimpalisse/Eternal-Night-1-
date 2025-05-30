const cors = require('cors');

class CorsMiddleware {
  constructor() {
    // Liste des origines autorisées par défaut, y compris le frontend local
    this.allowedOrigins = process.env.CORS_ALLOWED_ORIGINS 
      ? process.env.CORS_ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:5173', 'http://localhost:3000'];

    // Configuration CORS
    this.corsOptions = {
      origin: (origin, callback) => {
        // Autoriser les requêtes sans origine (comme les requêtes mobile ou Postman)
        // et les requêtes provenant des origines autorisées
        if (this.allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          console.warn(`Origine CORS rejetée: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Autoriser les cookies
      optionsSuccessStatus: 204, // Pour certains navigateurs legacy comme IE11
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
      console.log(`Origine ajoutée à la liste blanche CORS: ${origin}`);
    }
  }
}

module.exports = new CorsMiddleware();