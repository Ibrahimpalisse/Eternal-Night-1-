import React, { useState, useRef, useEffect } from 'react';
import { FormValidation } from '../../utils/validation';
import { Link } from 'react-router-dom';
import User from '../../services/User';
import openBookLogo from '../../assets/open-book.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const emailInputRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider l'email avec le schéma de FormValidation
    const validation = FormValidation.validateField('email', email);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Appeler le service User pour demander la réinitialisation du mot de passe
      const result = await User.forgotPassword(email);
      
      if (result.success) {
        setSuccessMessage('Un email de réinitialisation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception et suivre les instructions.');
        setResendDisabled(true);
        setResendCountdown(60);
        setIsSuccess(true);
        
        if (emailInputRef.current) {
          emailInputRef.current.value = ''; // Clear input
        }
      } else {
        setError(result.message || 'Une erreur est survenue lors de la demande de réinitialisation');
      }
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la demande de réinitialisation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Mot de passe oublié</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>
        
        {/* Reset Password form */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    ref={emailInputRef}
                    value={email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                    placeholder="votre@email.com"
                    disabled={isSubmitting || resendDisabled}
                  />
                  {error && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in-down">
                      <p className="text-sm text-red-500 font-semibold animate-bounce-gentle">{error}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || resendDisabled}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-500 hover:to-purple-400 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : resendDisabled ? (
                      `Renvoyer dans ${resendCountdown}s`
                    ) : (
                      'Envoyer un email de réinitialisation'
                    )}
                  </span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-500/10 p-3 animate-success-pop">
                    <svg className="w-12 h-12 text-green-500 animate-success-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div className="space-y-3 animate-success-content">
                  <h3 className="text-2xl font-bold text-white">Email Envoyé!</h3>
                  <div className="space-y-2">
                    <p className="text-lg text-purple-300">
                      Nous avons envoyé un lien de réinitialisation à:
                      <br />
                      <span className="text-white font-medium">{email}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.
                    </p>
                  </div>
                  <div className="pt-6">
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                    >
                      <span className="mr-2">Retour à la connexion</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Vous vous souvenez de votre mot de passe?{' '}
                <Link to="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                  Retour à la connexion
                </Link>
              </p>
            </div>
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

export default ForgotPassword; 