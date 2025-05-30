import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import openBookLogo from '../../assets/open-book.svg';
import { FormValidation } from '../../utils/validation';
import User from '../../services/User';
import { useToast } from '../../contexts/ToastContext';
import EmailVerification from '../../components/EmailVerification';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVerifyEmailAlert, setShowVerifyEmailAlert] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  
  // Utiliser react-hook-form avec validation Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting },
    setError,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(FormValidation.loginSchema),
    mode: 'onChange',
    defaultValues: {
    email: '',
    password: '',
    rememberMe: false
    }
  });
  
  // Fonction appelée lorsque le formulaire est valide
  const onSubmit = async (data) => {
    try {
      const result = await User.login(data);
      
      // Vérifier si l'email nécessite une vérification
      if (result && result.requiresVerification) {
        // Stocker l'email pour la vérification
        setVerificationEmail(data.email);
        // Afficher directement l'alerte de vérification pour simplifier le flux
        setShowVerifyEmailAlert(true);
        toast.warning("Veuillez vérifier votre email avant de vous connecter");
        return;
      }
      
      // Connexion réussie
      toast.success("Connexion réussie");
      navigate('/user/home'); // Redirection vers la page d'accueil
      
    } catch (error) {
      // Vérifier si le message d'erreur concerne la vérification de l'email
      const isEmailVerificationError = error.message && (
        error.message.includes("vérifier votre email") ||
        error.message.includes("email non vérifi") || 
        error.message.includes("non vérifi") || 
        error.message.includes("verifi") ||
        error.message.includes("verification") ||
        error.message.toLowerCase().includes("email not verified") ||
        error.message.toLowerCase().includes("verify your email")
      );
      
      if (isEmailVerificationError) {
        // L'erreur concerne la vérification de l'email
        
        // Récupérer l'email du formulaire
        const userEmail = data.email;
        setVerificationEmail(userEmail);
        
        // Afficher la modal de vérification d'email
        setShowVerifyEmailAlert(true);
        
        // Notification à l'utilisateur
        toast.warning("Veuillez vérifier votre email avant de vous connecter");
      } else {
        // Autre type d'erreur
        setError('root', { 
          type: 'manual',
          message: error.message || "Une erreur est survenue lors de la connexion"
        });
        toast.error(error.message || "Échec de la connexion");
      }
    }
  };
  
  // Gérer la vérification réussie de l'email
  const handleVerificationSuccess = async (email) => {
    toast.success("Email vérifié avec succès");
    setShowVerificationModal(false);
    setShowVerifyEmailAlert(false);
    
    // Connecter l'utilisateur automatiquement
    try {
      const credentials = getValues();
      const result = await User.login(credentials);
      toast.success("Connexion réussie");
      navigate('/user/home');
    } catch (error) {
      toast.error("Votre email a été vérifié, veuillez vous connecter à nouveau");
      // Rafraîchir le formulaire
      reset();
    }
  };

  // Quand l'utilisateur clique sur "Vérifier maintenant" dans l'alerte
  const handleVerifyNow = () => {
    setShowVerifyEmailAlert(false);
    setShowVerificationModal(true);
    // Envoyer directement un nouveau code de vérification
    handleResendVerification();
  };
  
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate('/auth/forgot-password');
  };

  // Gérer la fermeture de la modal de vérification
  const handleVerificationCancel = () => {
    setShowVerificationModal(false);
    setShowVerifyEmailAlert(false);
    // L'utilisateur a fermé la modal sans vérifier son email
    toast.info("Vous devez vérifier votre email pour vous connecter");
  };

  // Renvoyer le code de vérification
  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    try {
      await User.resendVerification(verificationEmail);
      toast.success("Un nouveau code de vérification a été envoyé à votre email");
    } catch (error) {
      toast.error(error.message || "Échec de l'envoi du code de vérification");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Back button - Mobile only */}
      <div className="md:hidden w-full px-4 py-2 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <Link to="/optionLogin" className="flex items-center text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to options</span>
        </Link>
      </div>
      
      {/* Back button - Desktop only */}
      <div className="absolute top-20 left-4 hidden">
        <Link to="/optionLogin" className="text-white/80 hover:text-white transition-colors">
          <span className="text-sm">Back</span>
        </Link>
      </div>
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Welcome Back</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Sign in to continue your reading journey
          </p>
        </div>
        
        {/* Login form */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Email address
                </label>
                <div className="relative">
                <input
                  id="email"
                  type="email"
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                  placeholder="Enter your email"
                    {...register('email')}
                />
                  {errors.email && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-500 font-medium">{errors.email.message}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-purple-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50 pr-10`}
                    placeholder="Enter your password"
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
                  {errors.password && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-500 font-medium">{errors.password.message}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {errors.root && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-500 font-medium">{errors.root.message}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-white/10 transition-colors duration-200"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link 
                    to="/auth/forgot-password" 
                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 px-4 rounded-xl flex justify-center items-center font-medium transition-all duration-300 shadow-lg shadow-purple-500/20 ${!isValid ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </span>
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                  Sign up
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
      
      {/* Alerte de vérification d'email */}
      {showVerifyEmailAlert && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300">
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setShowVerifyEmailAlert(false)}
                  className="text-white/80 hover:text-white transition-all duration-200 bg-white/10 hover:bg-white/20 rounded-full p-1"
                  aria-label="Fermer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Veuillez vérifier votre email avant de vous connecter</h3>
                <p className="text-gray-300 mb-6">
                  Votre adresse email <span className="font-medium text-yellow-300">{verificationEmail}</span> n'a pas encore été vérifiée. Veuillez vérifier votre email pour activer votre compte.
                </p>
                
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleVerifyNow}
                    className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Vérifier maintenant
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVerifyEmailAlert(false)}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de vérification d'email */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="relative w-full max-w-md">
            
            <EmailVerification
              email={verificationEmail}
              onVerificationSuccess={handleVerificationSuccess}
              onCancel={handleVerificationCancel}
              onResendCode={handleResendVerification}
              showSendEmailForm={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;