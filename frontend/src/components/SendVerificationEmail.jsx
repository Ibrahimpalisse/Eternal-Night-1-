import React, { useState, useRef, useEffect } from 'react';
import { FormValidation } from '../utils/validation';
import User from '../services/User';
import { useToast } from '../contexts/ToastContext';

const SendVerificationEmail = ({ initialEmail = '', onEmailSent }) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const emailInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = FormValidation.validateField('email', email);
    if (!validation.success) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Appel à l'API pour envoyer le code de vérification
      const result = await User.resendVerification(email);
      
      setSuccessMessage('Un code de vérification a été envoyé à votre email.');
      toast.success('Un code de vérification a été envoyé à votre email.');
      setResendDisabled(true);
      setResendCountdown(60);
      
      // Si une fonction de callback est fournie, l'appeler
      if (onEmailSent) {
        onEmailSent(email);
      }
    } catch (error) {
      setError(error.message || "Échec de l'envoi du code de vérification");
      toast.error(error.message || "Échec de l'envoi du code de vérification");
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
    } else if (resendCountdown === 0) {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  return (
    <div className="w-full max-w-md px-4 animate-fade-in-up">
      <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Envoyer un code de vérification</h2>
        <p className="text-gray-300 mb-2">
          Veuillez entrer votre adresse e-mail pour recevoir un code de vérification
        </p>
        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-sm text-red-500 font-semibold">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="p-3 mb-4 rounded-lg bg-green-500/20 border border-green-500/30">
            <p className="text-sm text-green-400 font-semibold">{successMessage}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={handleChange}
              ref={emailInputRef}
              className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/[0.07] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || resendDisabled}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${isSubmitting || resendDisabled ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le code'}
            </button>
            {resendDisabled && (
              <p className="text-sm text-gray-400">Vous pouvez renvoyer le code dans {resendCountdown}s</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendVerificationEmail;