import React, { useState, useEffect } from 'react';

// Types de toasts
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Durée par défaut d'affichage du toast (5 secondes)
const DEFAULT_DURATION = 5000;

// Composant Toast individuel
const ToastItem = ({ id, type, message, onClose, duration = DEFAULT_DURATION }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);

  // Définir les classes CSS en fonction du type de toast
  const getToastClasses = () => {
    const baseClasses = "fixed flex items-center p-4 mb-3 rounded-lg shadow-lg backdrop-blur-md border animate-slide-in";
    
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return `${baseClasses} bg-green-500/10 border-green-500/20 text-green-400`;
      case TOAST_TYPES.ERROR:
        return `${baseClasses} bg-red-500/10 border-red-500/20 text-red-400`;
      case TOAST_TYPES.INFO:
        return `${baseClasses} bg-blue-500/10 border-blue-500/20 text-blue-400`;
      case TOAST_TYPES.WARNING:
        return `${baseClasses} bg-yellow-500/10 border-yellow-500/20 text-yellow-400`;
      default:
        return `${baseClasses} bg-white/10 border-white/20 text-gray-200`;
    }
  };

  // Définir l'icône en fonction du type de toast
  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case TOAST_TYPES.ERROR:
        return (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case TOAST_TYPES.INFO:
        return (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case TOAST_TYPES.WARNING:
        return (
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-500/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Effet pour gérer la fermeture automatique du toast après une durée définie
  useEffect(() => {
    // Calculer l'intervalle pour la progression
    const intervalStep = 100 / (duration / 100); // Progression par 100ms
    
    // Démarrer le timer pour la progression
    const timerId = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timerId);
          return 0;
        }
        return prev - intervalStep;
      });
    }, 100);
    
    setIntervalId(timerId);
    
    // Timer pour fermer le toast
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Attendre la fin de l'animation
    }, duration);
    
    // Nettoyage des timers lors du démontage
    return () => {
      clearTimeout(timer);
      clearInterval(timerId);
    };
  }, [duration, id, onClose]);

  // Gérer la fermeture manuelle du toast
  const handleClose = () => {
    setIsVisible(false);
    clearInterval(intervalId);
    setTimeout(() => onClose(id), 300); // Attendre la fin de l'animation
  };

  return (
    <div 
      className={`${getToastClasses()} ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-full'} transition-all duration-300 ease-in-out`}
      role="alert"
    >
      {getIcon()}
      <div className="ml-3 text-sm font-medium pr-8">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-white/10 transition-colors"
        aria-label="Close"
        onClick={handleClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
      
      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30" style={{ width: `${progress}%`, transition: 'width 100ms linear' }}></div>
    </div>
  );
};

// Container principal pour les toasts
const ToastContainer = ({ toasts, position = 'bottom-right', onRemoveToast }) => {
  // Définir les classes de position
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col gap-3 max-w-xs w-full ${getPositionClasses()}`}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
};

// Hook personnalisé pour gérer les toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Ajouter un nouveau toast
  const addToast = (message, type = TOAST_TYPES.INFO, duration = DEFAULT_DURATION) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  // Supprimer un toast spécifique par son ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Méthodes pour chaque type de toast
  const success = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration);
  const error = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration);
  const info = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration);
  const warning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration);

  // Supprimer tous les toasts
  const clearToasts = () => setToasts([]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearToasts,
  };
};

// Composant Toast principal qui utilise le ToastContainer
const Toast = ({ position = 'bottom-right' }) => {
  // Ce composant est censé être utilisé avec un contexte global
  // Mais pour simplifier, nous allons utiliser un état local ici
  const [toasts, setToasts] = useState([]);

  // Méthode pour supprimer un toast
  const handleRemoveToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return <ToastContainer toasts={toasts} position={position} onRemoveToast={handleRemoveToast} />;
};

export default Toast; 