const socketService = {
  io: null,
  
  // Initialiser le service avec l'instance de Socket.IO
  init(io) {
    this.io = io;
    console.log('Socket.IO service initialized');
  },
  
  // Émettre un événement pour l'expiration d'un token de réinitialisation de mot de passe
  emitPasswordResetTokenExpired(userId) {
    if (!this.io) {
      console.error('Socket.IO not initialized');
      return;
    }
    
    // Émettre l'événement à tous les clients (on peut cibler spécifiquement si on garde une trace des connexions des utilisateurs)
    this.io.emit('passwordResetTokenExpired', { userId });
    console.log(`Emitted passwordResetTokenExpired event for user ${userId}`);
  }
};

module.exports = socketService; 