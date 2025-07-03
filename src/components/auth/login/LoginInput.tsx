import { useState } from 'react';
import useInput from '../../../hooks/UseInput';
import { motion } from 'framer-motion';
import type { LoginPayload } from '../../../types/index';

export default function LoginInput({
  login,
  isLoading = false,
  error = null
}: {
    login: (payload: LoginPayload) => void,
    isLoading?: boolean,
    error?: string | null
}) {
  const { value: email, onChange: onEmailChange } = useInput('');
  const { value: password, onChange: onPasswordChange } = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);



  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setLocalError('Email tidak boleh kosong.');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password tidak boleh kosong.');
      return;
    }

    // Kosongkan error kalau valid
    setLocalError(null);

    login({ email, password, name: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const inputVariants = {
    focused: {
      scale: 1.01,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderColor: '#6366f1',
      transition: { duration: 0.3 }
    },
    blurred: {
      scale: 1,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderColor: '#e5e7eb',
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    idle: {
      scale: 1,
      backgroundColor: '#4f46e5'
    },
    hover: {
      scale: 1.02,
      backgroundColor: '#4338ca',
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.98,
      backgroundColor: '#3730a3',
      transition: { duration: 0.1 }
    },
    loading: {
      backgroundColor: '#6366f1',
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
        <p className="text-gray-500 text-sm">Silahkan masuk untuk melanjutkan</p>
      </motion.div>

      {error && (
        <motion.div
          className="p-3 mb-5 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
                            Alamat Email
            </label>
            {email && !email.includes('@') && email.length > 3 && (
              <span className="text-xs text-amber-600">Format email tidak valid</span>
            )}
          </div>
          <div className="relative">
            <motion.div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              animate={{ opacity: focusedField === 'email' ? 1 : 0.7 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onEmailChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="nama@contoh.com"
              required
              className="block w-full pl-10 pr-3 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none bg-gray-50"
              variants={inputVariants}
              animate={focusedField === 'email' ? 'focused' : 'blurred'}
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
                            Password
            </label>
          </div>
          <div className="relative">
            <motion.div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              animate={{ opacity: focusedField === 'password' ? 1 : 0.7 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            <motion.input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={onPasswordChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="Masukkan password"
              required
              className="block w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none bg-gray-50"
              variants={inputVariants}
              animate={focusedField === 'password' ? 'focused' : 'blurred'}
              autoComplete="current-password"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                        Ingat saya
          </label>
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 focus:outline-none"
            disabled={isLoading}
            variants={buttonVariants}
            initial="idle"
            whileHover={!isLoading ? 'hover' : 'loading'}
            whileTap={!isLoading ? 'tap' : 'loading'}
            aria-label="Login"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Masuk...</span>
              </div>
            ) : (
              <span>Masuk</span>
            )}
          </motion.button>
        </div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-sm text-gray-500">
                        Belum punya akun? <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Daftar Sekarang</a>
          </p>
        </motion.div>
        {localError && (
          <motion.div
            className="p-3 mb-5 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {localError}
          </motion.div>
        )}
      </form>


    </motion.div>
  );
}