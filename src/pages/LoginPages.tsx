import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AppDispatch } from '../store';
import { asyncSetAuthUser } from '../features/auth/action';
import type { LoginPayload } from '../types';
import LoginInput from '../components/auth/login/LoginInput';

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onLogin = async ({ email, password }: LoginPayload) => {
    setError(null);

    try {
      await dispatch(asyncSetAuthUser({ email, password }));
      // Kalau sukses, redirect
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            Forum App
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 w-20 bg-indigo-600 mx-auto mt-2 rounded-full"
          ></motion.div>
        </div>

        {/* Tampilkan error */}
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <LoginInput login={onLogin} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Forum App. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
