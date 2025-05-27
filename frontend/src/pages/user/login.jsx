import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import openBookLogo from '../../assets/open-book.svg';
import { FormValidation } from '../../utils/validation';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Utiliser react-hook-form avec validation Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isSubmitting }
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
  const onSubmit = (data) => {
    console.log('Form submitted with data:', data);
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
                </div>
              </div>
              
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
                  <Link to="/auth/forgot-password" className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline">
                    Forgot password?
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
    </div>
  );
};

export default Login;