import React, { useState, useRef, useEffect } from 'react';
import { FormValidation } from '../utils/validation'; // Assurez-vous d'importer la classe

const VerificationCode = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;

    // Validate the digit using FormValidation
    const validation = FormValidation.validateDigits(value);
    if (!validation.success) {
      setError(validation.error);
      return;
    } else {
      setError(''); // Clear error if validation is successful
    }

    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5].focus();
    }
  };

  // Resend verification code (mock function)
  const handleResendCode = () => {
    setSuccessMessage('Un nouveau code a été envoyé à votre email.');
    setResendDisabled(true);
    setResendCountdown(60);
    setCode(['', '', '', '', '', '']);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Code de vérification</h2>
        <p className="text-gray-300 mb-2">
          Veuillez entrer le code à 6 chiffres envoyé à votre email
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
        <form className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => inputRefs.current[index] = el}
                className="w-12 h-12 text-center text-lg font-bold bg-white/[0.07] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200"
              />
            ))}
          </div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${resendDisabled ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' : 'bg-white/[0.07] text-white hover:bg-white/[0.1] active:bg-white/[0.15]'}`}
            >
              {resendDisabled ? `Renvoyer le code (${resendCountdown}s)` : 'Renvoyer le code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationCode;