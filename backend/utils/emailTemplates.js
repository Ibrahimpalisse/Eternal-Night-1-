// Templates d'email pour l'application
const emailTemplates = {
    // Template pour l'email de vérification
    verificationEmail: (code) => {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #6b46c1;">Bienvenue sur Night Novels</h2>
          <p>Merci de vous être inscrit. Pour activer votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; text-align: center; font-size: 24px; letter-spacing: 2px; font-weight: bold; color: #4a5568;">
            ${code}
          </div>
          <p style="margin-top: 20px; font-weight: bold; color: #e53e3e;">Ce code est valable pendant 5 minutes seulement.</p>
          <p>Si vous n'avez pas demandé à créer un compte, vous pouvez ignorer cet email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #718096;">© ${new Date().getFullYear()} Night Novels. Tous droits réservés.</p>
        </div>
      `;
    },
    
    // Template pour l'email de réinitialisation de mot de passe
    resetPasswordEmail: (token) => {
      // Utiliser directement le token fourni au lieu de générer un nouveau code
      
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #6b46c1;">Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?code=${token}" style="background-color: #6b46c1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="font-weight: bold; color: #e53e3e;">Ce lien est valable pendant 5 minutes seulement.</p>
          <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #718096;">© ${new Date().getFullYear()} Night Novels. Tous droits réservés.</p>
        </div>
      `;
    }
  };
  
  module.exports = emailTemplates;