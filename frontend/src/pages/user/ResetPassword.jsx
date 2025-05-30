import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidation } from '../../utils/validation';
import User from '../../services/User';
import { toast } from 'react-toastify';
import openBookLogo from '../../assets/open-book.svg';
import { io } from 'socket.io-client';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialisation de Socket.IO
  useEffect(() => {
    // Extraire le domaine de base de l'URL de l'API (sans le chemin /api)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    
    // Connexion à Socket.IO avec l'URL de base correcte
    const socket = io(baseUrl);
    
    // Gestion de l'événement d'expiration du token
    socket.on('passwordResetTokenExpired', (data) => {
      console.log('Token de réinitialisation expiré', data);
      setIsTokenExpired(true);
      toast.error('Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.');
    });
    
    // Nettoyage lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, []);
  
  // Obtenir le code de réinitialisation depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      setResetCode(code);
      
      // Vérifier si le token est valide via une requête API
      const checkTokenValidity = async () => {
        try {
          const result = await User.checkResetToken(code);
          
          if (!result.valid) {
            setIsTokenExpired(true);
            toast.error('Le lien de réinitialisation est invalide ou a expiré.');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          setIsTokenExpired(true);
          toast.error('Le lien de réinitialisation est invalide ou a expiré.');
        }
      };
      
      checkTokenValidity();
      
      // Définir un timer pour marquer le token comme expiré après 5 minutes
      const expirationTimer = setTimeout(() => {
        setIsTokenExpired(true);
        toast.error('Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.');
      }, 5 * 60 * 1000); // 5 minutes
      
      return () => {
        clearTimeout(expirationTimer);
      };
    } else {
      setIsTokenExpired(true);
      toast.error('Code de réinitialisation manquant.');
    }
  }, [location]);
  
  // Utiliser react-hook-form avec validation Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting },
    setError,
    watch
  } = useForm({
    resolver: zodResolver(FormValidation.resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  // Observer le mot de passe
  const password = watch('password');
  
  // Fonction appelée lorsque le formulaire est valide
  const onSubmit = async (data) => {
    if (!resetCode) {
      toast.error("Code de réinitialisation manquant");
      return;
    }
    
    try {
      const result = await User.resetPassword(resetCode, data.password);
      
      if (result.success) {
        setIsSuccess(true);
        toast.success("Votre mot de passe a été réinitialisé avec succès");
      } else {
        toast.error(result.message || "Échec de la réinitialisation du mot de passe");
      }
    } catch (error) {
      if (error.message && error.message.includes("différent de l'ancien")) {
        setError('password', { 
          type: 'manual',
          message: "Le nouveau mot de passe doit être différent de l'ancien"
        });
        toast.error("Le nouveau mot de passe doit être différent de l'ancien");
      } else {
        setError('root', { 
          type: 'manual',
          message: error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe"
        });
        toast.error(error.message || "Échec de la réinitialisation du mot de passe");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Réinitialisation du mot de passe</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Créez un nouveau mot de passe pour votre compte
          </p>
        </div>
        
        {/* Reset Password form or expired message */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            {isTokenExpired ? (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-500/10 p-3 animate-bounce-gentle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white">Lien expiré</h3>
                  <p className="text-lg text-red-300">
                    Le lien de réinitialisation de mot de passe a expiré ou est invalide.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Les liens de réinitialisation sont valables pendant 5 minutes. Veuillez demander un nouveau lien.
                  </p>
                  <div className="pt-4">
                    <Link 
                      to="/auth/forgot-password" 
                      className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center">
                        Demander un nouveau lien
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : !isSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {errors.root && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-500 font-medium">{errors.root.message}</p>
                  </div>
                )}
                
                {!resetCode && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-500 font-medium">Code de réinitialisation manquant. Veuillez utiliser le lien envoyé par email.</p>
                  </div>
                )}
                
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Entrez un nouveau mot de passe"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in-down">
                      <p className="text-sm text-red-500 font-semibold animate-bounce-gentle">{errors.password.message}</p>
                    </div>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Confirmez votre mot de passe"
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in-down">
                      <p className="text-sm text-red-500 font-semibold animate-bounce-gentle">{errors.confirmPassword.message}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-400">Votre mot de passe doit contenir:</p>
                    <ul className="space-y-1">
                      <li className={`text-xs flex items-center ${password && password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${password && password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={password && password.length >= 8 ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                        Au moins 8 caractères
                      </li>
                      <li className={`text-xs flex items-center ${password && /[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${password && /[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={password && /[A-Z]/.test(password) ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                        Une lettre majuscule
                      </li>
                      <li className={`text-xs flex items-center ${password && /[a-z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${password && /[a-z]/.test(password) ? 'text-green-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={password && /[a-z]/.test(password) ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                        Une lettre minuscule
                      </li>
                      <li className={`text-xs flex items-center ${password && /\d/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${password && /\d/.test(password) ? 'text-green-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={password && /\d/.test(password) ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                        Un chiffre
                      </li>
                      <li className={`text-xs flex items-center ${password && /[@$!%*?&]/.test(password) ? 'text-green-500' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${password && /[@$!%*?&]/.test(password) ? 'text-green-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={password && /[@$!%*?&]/.test(password) ? "M5 13l4 4L19 7" : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                        Un caractère spécial (@$!%*?&)
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || !resetCode}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Réinitialisation...
                      </>
                    ) : (
                      'Réinitialiser le mot de passe'
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
                  <h3 className="text-2xl font-bold text-white">Mot de passe réinitialisé!</h3>
                  <div className="space-y-2">
                    <p className="text-lg text-purple-300">
                      Votre mot de passe a été réinitialisé avec succès.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link 
                      to="/auth/login" 
                      className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium hover:bg-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center">
                        Se connecter
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 