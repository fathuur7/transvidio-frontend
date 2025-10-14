import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key="auth-form" 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative"
        >
          <AuthForm />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isResetSent, setIsResetSent] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setIsResetSent(false);

    if (isSignUp && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Silakan masukkan email Anda untuk mereset password.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsResetSent(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="relative">
      {/* Hanging Lamp */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-48 flex flex-col items-center z-10">
        {/* Rope/Chain */}
        <motion.div 
          className="w-0.5 bg-neutral-600"
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Lamp Body - Clickable */}
        <motion.div
          onClick={() => setIsLampOn(!isLampOn)}
          className="cursor-pointer relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Lamp Bulb */}
          <motion.div
            className="w-16 h-20 relative"
            animate={{ 
              rotate: isLampOn ? [0, -2, 2, -2, 0] : 0 
            }}
            transition={{ 
              duration: 2,
              repeat: isLampOn ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Bulb Base */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-neutral-700 rounded-t-sm" />
            
            {/* Bulb Glass */}
            <motion.div
              className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-16 rounded-full"
              style={{
                background: isLampOn 
                  ? 'radial-gradient(circle at center, #FDE68A 0%, #FBBF24 50%, #F59E0B 100%)'
                  : 'radial-gradient(circle at center, #374151 0%, #1F2937 100%)',
                boxShadow: isLampOn 
                  ? '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)'
                  : 'none'
              }}
              animate={{
                boxShadow: isLampOn
                  ? [
                      '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)',
                      '0 0 40px rgba(251, 191, 36, 0.7), 0 0 80px rgba(251, 191, 36, 0.4)',
                      '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3)'
                    ]
                  : 'none'
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Filament effect when on */}
            {isLampOn && (
              <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-1 h-6 bg-yellow-200"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  boxShadow: '0 0 10px rgba(254, 243, 199, 0.8)'
                }}
              />
            )}
          </motion.div>
          
       
        <AnimatePresence>
        {isLampOn && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 origin-top pointer-events-none"
            style={{ width: 0, height: 0 }}
          >

            {/* Inner brighter cone */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '90px solid transparent',
                borderRight: '90px solid transparent',
                borderBottom: '90px solid rgba(251, 191, 36, 0.45)',
                filter: 'blur(8px)',
                mixBlendMode: 'screen'
              }}
            />
          </motion.div>
        )}
        </AnimatePresence>

        </motion.div>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-md bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-neutral-700 mt-16">
        <motion.div 
          className="p-8 relative transition-all duration-500"
          animate={{
            opacity: isLampOn ? 1 : 0,
          }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}
            </h1>
            <p className="text-neutral-400 text-sm">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                className="text-yellow-400 hover:text-yellow-300 font-semibold ml-2 focus:outline-none"
              >
                {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
              </button>
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAuthAction} 
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-neutral-500"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-neutral-500"
                />
                <button 
                  type="button" 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {isSignUp && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg focus:outline-none focus:border-yellow-400 transition-colors text-white placeholder-neutral-500"
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="text-right text-sm">
                  <button 
                    type="button" 
                    onClick={handlePasswordReset} 
                    className="text-yellow-400 hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>
              )}
              
              {error && (
                <motion.div 
                  initial={{opacity: 0, y: -10}} 
                  animate={{opacity: 1, y: 0}} 
                  className="flex items-center gap-2 text-red-400 bg-red-900/50 p-3 rounded-lg text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}

              {isResetSent && (
                <motion.div 
                  initial={{opacity: 0, y: -10}} 
                  animate={{opacity: 1, y: 0}} 
                  className="flex items-center gap-2 text-green-400 bg-green-900/50 p-3 rounded-lg text-sm"
                >
                  <Mail size={16} />
                  <span>Link reset password telah dikirim ke email Anda.</span>
                </motion.div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-600/50 text-black font-bold py-3 rounded-lg transition-colors shadow-lg shadow-yellow-500/10"
              >
                {isSubmitting ? <Loader className="animate-spin" size={24} /> : (isSignUp ? 'Daftar' : 'Masuk')}
              </button>
            </motion.form>
          </AnimatePresence>
          
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-neutral-700"></div>
            <span className="text-neutral-400 text-sm">atau</span>
            <div className="flex-1 h-px bg-neutral-700"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full bg-neutral-900 hover:bg-neutral-700 border-2 border-neutral-700 rounded-lg py-3 px-4 flex items-center justify-center gap-3 transition-colors shadow-lg text-white disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Lanjutkan dengan Google</span>
          </button>
        </motion.div>
      </div>
    </main>
  );
}