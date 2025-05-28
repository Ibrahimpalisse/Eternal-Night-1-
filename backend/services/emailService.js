const nodemailer = require('nodemailer');
const emailTemplates = require('../utils/emailTemplates');
require('dotenv').config(); // Assurez-vous de charger les variables d'environnement

// Création du transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'localhost', // Utilisez une variable d'environnement
  port: process.env.EMAIL_PORT || 1025, // Utilisez une variable d'environnement
  secure: false, // true pour le port 465, false pour les autres ports
});

// Fonction pour envoyer un email de vérification
const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Night Novels" <noreply@nightnovels.com>',
    to: to,
    subject: 'Vérification de votre adresse email',
    html: emailTemplates.verificationEmail(code),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de vérification envoyé :', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification :', error);
    throw new Error('Impossible d\'envoyer l\'email de vérification');
  }
};

// Fonction pour envoyer un email de réinitialisation de mot de passe
const sendPasswordResetEmail = async (to, resetCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eternalnight.com',
      to,
      subject: 'Réinitialisation de mot de passe',
      html: emailTemplates.resetPasswordEmail(resetCode)
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email de réinitialisation envoyé à: ${to}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};