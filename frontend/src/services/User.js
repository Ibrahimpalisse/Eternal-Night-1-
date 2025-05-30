class User {
  constructor() {
    // URL de base de l'API, à configurer selon votre environnement
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    // Variable pour suivre l'état de l'affichage du toast de rate limit
    this.rateLimitToastDisplayed = false;
    this.rateLimitToastTimeout = null;
    // Token refresh timer
    this.refreshTokenInterval = null;
    // Dernière fois que le token a été rafraîchi
    this.lastTokenRefresh = null;
    // Intervalle de rafraîchissement (45 minutes)
    this.refreshInterval = 45 * 60 * 1000;
    // Référence aux données utilisateur en mémoire (non persistantes)
    this.userDataInMemory = null;
    
    // Démarrer le timer de rafraîchissement si un token existe
    this.setupRefreshTokenTimer();
  }

  // Configuration du timer de rafraîchissement du token
  setupRefreshTokenTimer() {
    // Nettoyer tout intervalle existant
    if (this.refreshTokenInterval) {
      clearInterval(this.refreshTokenInterval);
    }
    
    // Si l'utilisateur est connecté
    if (this.isLoggedIn()) {
      // Démarrer un intervalle pour rafraîchir le token
      this.refreshTokenInterval = setInterval(async () => {
        try {
          // Vérifier si le dernier rafraîchissement date de moins de 5 minutes
          if (this.lastTokenRefresh && Date.now() - this.lastTokenRefresh < 5 * 60 * 1000) {
            return; // Éviter les rafraîchissements trop fréquents
          }
          
          // Rafraîchir le token
          await this.refreshToken();
        } catch (error) {
          console.error('Erreur lors du rafraîchissement automatique du token:', error);
          // Si le rafraîchissement échoue, déconnecter l'utilisateur
          if (error.message.includes('invalide') || error.message.includes('expiré')) {
            this.logout();
          }
        }
      }, this.refreshInterval);
    }
  }

  // Méthode pour rafraîchir le token
  async refreshToken() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include', // Inclure les cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du rafraîchissement du token');
      }

      const data = await response.json();
      
      // Mise à jour de la dernière fois que le token a été rafraîchi
      this.lastTokenRefresh = Date.now();

      return data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  // Méthode pour gérer les erreurs de rate limit et autres erreurs HTTP
  handleResponseError(response, data, defaultErrorMessage) {
    // Si c'est une erreur 429 (Too Many Requests)
    if (response.status === 429) {
      // Si un toast de rate limit n'est pas déjà affiché
      if (!this.rateLimitToastDisplayed) {
        this.rateLimitToastDisplayed = true;
        
        // Réinitialiser l'état après 5 secondes pour permettre de nouveaux toasts
        clearTimeout(this.rateLimitToastTimeout);
        this.rateLimitToastTimeout = setTimeout(() => {
          this.rateLimitToastDisplayed = false;
        }, 5000);
        
        throw new Error("Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.");
      } else {
        // Si un toast est déjà affiché, lancer une erreur silencieuse (sans message)
        const error = new Error("Rate limit reached");
        error.silent = true; // Marquer l'erreur comme silencieuse
        throw error;
      }
    }
    
    // Pour les autres types d'erreurs
    throw new Error(data.message || defaultErrorMessage);
  }

  // Méthode pour gérer les requêtes API avec gestion appropriée des réponses non-JSON
  async fetchWithErrorHandling(url, options, defaultErrorMessage) {
    try {
      const response = await fetch(url, options);
      
      // Si c'est une erreur 429 (Too Many Requests), elle peut ne pas être au format JSON
      if (response.status === 429) {
        // Si un toast de rate limit n'est pas déjà affiché
        if (!this.rateLimitToastDisplayed) {
          this.rateLimitToastDisplayed = true;
          
          // Réinitialiser l'état après 5 secondes pour permettre de nouveaux toasts
          clearTimeout(this.rateLimitToastTimeout);
          this.rateLimitToastTimeout = setTimeout(() => {
            this.rateLimitToastDisplayed = false;
          }, 5000);
          
          throw new Error("Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.");
        } else {
          // Si un toast est déjà affiché, lancer une erreur silencieuse
          const error = new Error("Rate limit reached");
          error.silent = true;
          throw error;
        }
      }
      
      // Pour les autres types de réponses, essayer de parser en JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Si la réponse n'est pas du JSON valide, utiliser le texte brut si disponible
        const text = await response.text();
        data = { message: text || defaultErrorMessage };
      }
      
      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(data.message || defaultErrorMessage);
      }
      
      return data;
    } catch (error) {
      // Propager l'erreur
      throw error;
    }
  }

  // Méthode d'inscription
  async register(userData) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
          credentials: 'include'
        },
        'Erreur lors de l\'inscription'
      );
      
      // Ne pas stocker les données utilisateur retournées
      return data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode de connexion
  async login(credentials) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
          credentials: 'include'
        },
        'Erreur lors de la connexion'
      );
      
      // Vérifier si l'erreur est due à un compte non vérifié
      if (data.message && (
          data.message.includes("non vérifi") || 
          data.message.includes("email non vérifi") || 
          data.message.includes("verifi") ||
          data.message.includes("verification") ||
          data.message.toLowerCase().includes("email not verified") ||
          data.message.toLowerCase().includes("verify your email") ||
          data.message.includes("vérifier votre email")
      )) {
        // Retourner un objet avec requiresVerification à true et l'email
        return { 
          requiresVerification: true, 
          email: credentials.email,
          success: false,
          message: data.message || "Veuillez vérifier votre email avant de vous connecter"
        };
      }
      
      // Si la connexion réussit, configurer le timer pour rafraîchir le token
      if (data.success) {
        // Stocker les informations utilisateur en mémoire uniquement, pas dans localStorage
        if (data.user) {
          this.userDataInMemory = data.user;
        }
        
        // Configurer le timer pour rafraîchir le token
        this.setupRefreshTokenTimer();
        this.lastTokenRefresh = Date.now();
      }
      
      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode de déconnexion
  async logout() {
    try {
      // Nettoyer l'intervalle de rafraîchissement du token
      if (this.refreshTokenInterval) {
        clearInterval(this.refreshTokenInterval);
        this.refreshTokenInterval = null;
      }
      
      // Nettoyer les données utilisateur en mémoire
      this.userDataInMemory = null;
      
      // Appeler l'API pour invalider les cookies côté serveur
      await fetch(`${this.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      }).catch(err => {
        console.warn('Erreur lors de la déconnexion côté serveur:', err);
        // Continuer même en cas d'erreur
      });
      
      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Nettoyer les données en mémoire même en cas d'erreur
      this.userDataInMemory = null;
      return { success: true, message: 'Déconnexion locale réussie' };
    }
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn() {
    // On se fie uniquement à la présence des cookies qui sont automatiquement envoyés
    // avec les requêtes, donc on ne peut le vérifier qu'en faisant une requête API
    // On pourrait potentiellement utiliser document.cookie pour vérifier si le cookie existe
    // mais c'est peu fiable car les cookies HttpOnly ne sont pas visibles
    // On utilise donc cette méthode comme un complément à getMe() qui fait la vraie vérification
    return this.userDataInMemory !== null;
  }

  // Méthode pour obtenir l'utilisateur actuel depuis la mémoire
  getCurrentUser() {
    return this.userDataInMemory;
  }

  // Méthode pour vérifier l'email
  async verifyEmail(email, code) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/verify-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
          credentials: 'include'
        },
        'Erreur lors de la vérification de l\'email'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur de vérification d\'email:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour renvoyer le code de vérification
  async resendVerification(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors du renvoi du code de vérification'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur de renvoi de code:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour la demande de réinitialisation de mot de passe
  async forgotPassword(email) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          credentials: 'include'
        },
        'Erreur lors de la demande de réinitialisation'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur de demande de réinitialisation:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour réinitialiser le mot de passe
  async resetPassword(code, password) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, password }),
          credentials: 'include'
        },
        'Erreur lors de la réinitialisation du mot de passe'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur de réinitialisation de mot de passe:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  async getMe() {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/me`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        },
        'Erreur lors de la récupération des informations utilisateur'
      );
      
      // Mettre à jour les informations utilisateur uniquement en mémoire
      if (data.user) {
        this.userDataInMemory = data.user;
      } else {
        this.userDataInMemory = null;
      }
      
      return data;
    } catch (error) {
      console.error('Erreur de récupération des informations utilisateur:', error);
      if (error.status === 401) {
        // Si non authentifié, réinitialiser les données utilisateur
        this.userDataInMemory = null;
      }
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }

  // Méthode pour vérifier la validité d'un token de réinitialisation
  async checkResetToken(code) {
    try {
      const data = await this.fetchWithErrorHandling(
        `${this.apiUrl}/auth/check-reset-token?code=${code}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        },
        'Erreur lors de la vérification du token'
      );
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      if (error.silent) return { success: false, silent: true };
      throw error;
    }
  }
}

export default new User();
