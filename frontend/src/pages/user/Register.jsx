import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import openBookLogo from '../../assets/open-book.svg';
import { FormValidation } from '../../utils/validation';

// Composants pour les icônes d'œil
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Valider le champ après la saisie
    if (['username', 'email', 'password', 'terms'].includes(name)) {
      const validation = FormValidation.validateField(name, newValue);
      if (!validation.success) {
        setErrors(prev => ({ ...prev, [name]: validation.error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }

    // Vérifier si les mots de passe correspondent
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      const passwordToCheck = name === 'password' ? value : formData.password;
      const confirmToCheck = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (passwordToCheck && confirmToCheck && passwordToCheck !== confirmToCheck) {
        setErrors(prev => ({ ...prev, confirmPassword: "Les mots de passe ne correspondent pas" }));
      } else if (confirmToCheck) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valider le formulaire complet
    const validation = FormValidation.validateForm('register', formData);
    
    if (!validation.success) {
      setErrors(validation.errors);
      console.log('Erreurs de validation:', validation.errors);
      return;
    }
    
    // Si la validation réussit
    console.log('Form submitted with data:', formData);
    // Ici, ajouter la logique pour l'envoi des données au serveur
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

      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 md:py-24">
        {/* Logo and site name */}
        <div className="flex flex-col items-center mb-8 md:mb-12 animate-fade-in-down">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-white/20 rounded-2xl p-4 backdrop-blur-sm border border-white/20 shadow-[0_8px_16px_rgb(0_0_0/0.4)] hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
            <img src={openBookLogo} alt="Night Novels Logo" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center mt-4 md:mt-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white animate-gradient-x">Create Account</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2 md:mt-3 text-center max-w-sm animate-fade-in">
            Join our community of readers and writers
          </p>
        </div>

        {/* Register form */}
        <div className="w-full max-w-md px-4 animate-fade-in-up">
          <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/20 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-300 hover:shadow-purple-500/10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Removed error and success message display */}
              

              <div className="group">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5 transition-colors group-focus-within:text-purple-400">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white/10 border ${errors.username ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                    placeholder="Choose a username"
                    dir="ltr"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-400">{errors.username}</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5 transition-colors group-focus-within:text-purple-400">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                    placeholder="Enter your email"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5 transition-colors group-focus-within:text-purple-400">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                    placeholder="Create a password"
                    dir="ltr"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeIcon />
                      ) : (
                        <EyeSlashIcon />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character
                </p>
              </div>

              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5 transition-colors group-focus-within:text-purple-400">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-purple-500/50`}
                    placeholder="Confirm your password"
                    dir="ltr"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon />
                      ) : (
                        <EyeSlashIcon />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-start pt-2 group">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className={`h-4 w-4 mt-1 rounded border-gray-600 text-purple-500 focus:ring-purple-500 bg-white/10 transition-colors duration-200`}
                />
                <label htmlFor="terms" className={`ml-3 block text-sm ${errors.terms ? 'text-red-400' : 'text-gray-300'} group-hover:text-white transition-colors duration-200`}>
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-1 text-xs text-red-400">{errors.terms}</p>
              )}

              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white mt-6 py-2.5 px-4 rounded-xl flex justify-center items-center font-medium hover:from-purple-500 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <span className="relative z-10 flex items-center">
                  Create Account
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-all duration-200">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200">
              © {new Date().getFullYear()} Night Novels. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 