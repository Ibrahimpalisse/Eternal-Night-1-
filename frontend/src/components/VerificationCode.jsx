import React, { useState, useRef, useEffect } from 'react';
import { FormValidation } from '../utils/validation';

const VerificationCode = ({ 
  code = ['', '', '', '', '', ''], 
  onChange, 
  onComplete,
  className = ''
}) => {
  const [error, setError] = useState('');
  const [localCode, setLocalCode] = useState(code);
  const [codeCompleted, setCodeCompleted] = useState(false);
  const inputRefs = useRef([]);

  // Synchroniser le code local avec le code fourni par les props
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // Vérifier si le code est complet mais ne pas soumettre automatiquement
  useEffect(() => {
    const isComplete = localCode.every(digit => digit !== '') && localCode.length === 6;
    setCodeCompleted(isComplete);
    
    // Ne PAS soumettre automatiquement ici pour éviter la boucle infinie
    // L'utilisateur devra cliquer sur le bouton "Vérifier le code"
  }, [localCode]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...localCode];
    newCode[index] = value;

    // Validate the digit using FormValidation
    if (value !== '') {
      const validation = FormValidation.validateDigits(value);
      if (!validation.success) {
        setError(validation.error);
        return;
      } else {
        setError(''); // Clear error if validation is successful
      }
    }

    setLocalCode(newCode);

    // Notifier le parent du changement
    if (onChange) {
      onChange(newCode);
    }

    // Focus next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && localCode[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setLocalCode(newCode);
      
      // Notifier le parent du changement
      if (onChange) {
        onChange(newCode);
      }
      
      inputRefs.current[5].focus();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
        </div>
      )}
      <div className="grid grid-cols-6 gap-1 w-full">
        {localCode.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            ref={(el) => inputRefs.current[index] = el}
            className="w-full aspect-square text-center text-lg font-bold bg-white/[0.07] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white transition-all duration-200"
            aria-label={`Code digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationCode;