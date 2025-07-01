import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import RegisterInput from '../components/auth/register/RegisterInput';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch } from '../store';
import type { RegisterParams, ErrorState } from '../types/index';
import Metadata from '../components/metadata';
import { asyncRegisterUser } from '../features/user/action';

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [strength, setStrength] = useState(0);
  const [passwordHint, setPasswordHint] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowBackground(true), 50);

    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const onRegister = async ({ name, email, password }: RegisterParams) => {
    setLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await dispatch(asyncRegisterUser({ name, email, password }));
      setSuccess(true);

      createConfettiEffect();

      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('email') &&
                (err.message?.toLowerCase().includes('exists') ||
                    err.message?.toLowerCase().includes('taken') ||
                    err.message?.toLowerCase().includes('already in use'))) {
        setErrors({ email: 'Email sudah digunakan. Silakan gunakan email lain.' });
      } else if (err.message?.toLowerCase().includes('password')) {
        setErrors({ password: err.message || 'Password tidak memenuhi persyaratan keamanan' });
      } else if (err.message?.toLowerCase().includes('name')) {
        setErrors({ name: err.message || 'Nama tidak valid' });
      } else {
        setErrors({ general: err.message || 'Terjadi kesalahan. Silakan coba lagi.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const createConfettiEffect = () => {
    const confettiCount = 150;
    const container = document.querySelector('.confetti-container');

    if (!container) return;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.backgroundColor = ['#ff6b6b', '#48dbfb', '#feca57', '#1dd1a1', '#5f27cd'][Math.floor(Math.random() * 5)];

      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 6000);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (!password) {
      setStrength(0);
      setPasswordHint('');
      return;
    }

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const normalizedScore = Math.min(Math.floor((score / 6) * 100), 100);
    setStrength(normalizedScore);

    if (normalizedScore < 30) {
      feedback = 'Sangat lemah';
    } else if (normalizedScore < 50) {
      feedback = 'Lemah';
    } else if (normalizedScore < 70) {
      feedback = 'Sedang';
    } else if (normalizedScore < 90) {
      feedback = 'Kuat';
    } else {
      feedback = 'Sangat kuat';
    }

    setPasswordHint(feedback);
  };



  const getStrengthColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden relative">
      <Metadata
        title="Forum | Register"
        description="Register untuk bergabung dengan komunitas kami"
      />

      {/* Confetti container for success animation */}
      <div className="confetti-container fixed inset-0 z-20 pointer-events-none overflow-hidden"></div>

      {/* Enhanced animated background */}
      <div
        className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
          showBackground ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-15"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0icGF0dGVybiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmQ1ZTEiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIiAvPgo8L3N2Zz4=')]"></div>

        {/* Enhanced animated blobs with better positioning and animations */}
        <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/5 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000"></div>
      </div>

      {/* Card container with improved animation */}
      <AnimatePresence>
        <motion.div
          className="w-full max-w-md p-1.5 backdrop-blur-sm rounded-2xl z-10"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Glass card with enhanced design */}
          <div className="w-full bg-white/85 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/30">
            {/* Enhanced card header with interactive design */}
            <div className="relative h-28 bg-gradient-to-r from-blue-700 to-indigo-700 flex items-center justify-center overflow-hidden">
              {/* Improved decorative elements */}
              <div className="absolute -top-16 -left-12 w-48 h-48 bg-indigo-600/40 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-20 -right-12 w-48 h-48 bg-blue-600/40 rounded-full filter blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-300/30 rounded-full filter blur-md animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-indigo-300/30 rounded-full filter blur-md animate-pulse animation-delay-1000"></div>

              {/* Enhanced branding element */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
              <div className="z-10 flex flex-col items-center">
                <motion.div
                  className="flex items-center mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="ml-2.5 text-xl font-bold text-white tracking-tight">
                    ForumApp
                  </h2>
                </motion.div>
                <motion.div
                  className="w-20 h-1 bg-white/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                ></motion.div>
              </div>
            </div>

            <div className="p-8">
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  Buat Akun Baru
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Lengkapi data Anda untuk mulai menggunakan layanan forum kami
                </p>
              </motion.div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 mb-6 text-sm font-medium text-green-700 bg-green-50 rounded-lg border border-green-100 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span className="font-semibold">
                        Registrasi berhasil!
                      </span>
                      <div className="text-xs mt-0.5 text-green-600">
                        Mengalihkan ke halaman login dalam beberapa saat...
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 mb-6 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      <span>{errors.general}</span>
                      <div className="text-xs mt-0.5 text-red-500">
                        Silakan periksa koneksi internet Anda dan coba lagi.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {passwordHint && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      Kekuatan Password
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          strength < 50
                            ? '#ef4444'
                            : strength < 70
                              ? '#f59e0b'
                              : strength < 90
                                ? '#3b82f6'
                                : '#10b981',
                      }}
                    >
                      {passwordHint}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`}
                      style={{ width: `${strength}%` }}
                    ></div>
                  </div>
                </motion.div>
              )}

              <RegisterInput
                register={onRegister}
                errors={errors}
                disabled={loading || success}
                onPasswordChange={(password) => checkPasswordStrength(password)}
                name={''}
                email={''}
                password={''}
              />

              <AnimatePresence>
                {loading && (
                  <motion.div
                    className="flex justify-center my-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link
                  to="/login"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  <span>
                    Sudah punya akun?{' '}
                    <span className="underline decoration-2 decoration-blue-400 underline-offset-2 group-hover:decoration-blue-600 transition-all">
                      Masuk di sini
                    </span>
                  </span>
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 pt-6 border-t border-gray-100 text-center text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p>
                  © {new Date().getFullYear()} ForumApp. Semua hak dilindungi.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <style>
        {`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          animation: confetti-fall 4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}
      </style>
    </div>
  );

}