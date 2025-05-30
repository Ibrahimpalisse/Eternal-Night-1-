import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import openBookLogo from '../../assets/open-book.svg';
import EmailVerification from '../../components/EmailVerification';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  // Récupérer l'email depuis les paramètres d'URL si disponible
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  // Gérer la vérification réussie de l'email
  const handleVerificationSuccess = (verifiedEmail) => {
    toast.success("Email vérifié avec succès! Vous pouvez maintenant vous connecter.");
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Back button - Mobile only */}
      <div className="md:hidden w-full px-4 py-2 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <Link to="/auth/login" className="flex items-center text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Retour à la connexion</span>
        </Link>
      </div>
      
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Vérification d'Email</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Vérifiez votre adresse email pour activer votre compte
          </p>
        </div>
        
        {/* Email Verification component */}
        <div className="animate-fade-in-up">
          <EmailVerification 
            email={email}
            onVerificationSuccess={handleVerificationSuccess}
            showSendEmailForm={true}
          />
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Déjà vérifié votre email?{' '}
              <Link to="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                Se connecter
              </Link>
            </p>
          </div>
          
          <div className="text-center mt-12 mb-8">
            <p className="text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200">
              © {new Date().getFullYear()} Night Novels. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage; 