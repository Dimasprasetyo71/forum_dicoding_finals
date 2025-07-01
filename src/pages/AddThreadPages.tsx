import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncCreateThread, type RootState } from '../features/threads/action';
import ThreadInput, { type AddThreadProp } from '../components/threads/ThreadInput';
import type { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

export default function AddThreadPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onAddThread = useCallback(async ({ title, body, category }: AddThreadProp) => {
    try {
      setIsSubmitting(true);
      await dispatch(asyncCreateThread({ title, body, category }));

      // Add a small delay for better UX
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 300);
    } catch (error) {
      console.error('Failed to create thread:', error);
      setIsSubmitting(false);
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 px-54 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <div className="relative max-w-4xl mx-auto mb-40">
        <nav className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Beranda</span>
            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-gray-100">Buat Thread Baru</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-gray-900/20 overflow-hidden">
          {/* Header */}
          <div className="relative px-6 sm:px-8 py-6 sm:py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            {/* Header background pattern */}

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      Buat Thread Baru
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Bagikan ide, pertanyaan, atau diskusi menarik dengan komunitas
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            {/* Tips Section */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Tips untuk Thread yang Menarik
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
                      Gunakan judul yang jelas dan menarik perhatian
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
                      Pilih kategori yang sesuai dengan topik diskusi
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2" />
                      Berikan konteks yang cukup dalam deskripsi
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Thread Input Form */}
            <div className="relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <div className="flex items-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Membuat thread...
                    </span>
                  </div>
                </div>
              )}

              <ThreadInput
                addThread={onAddThread}
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Dengan membuat thread, Anda menyetujui{' '}
            <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Pedoman Komunitas
            </button>{' '}
            kami
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 dark:text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Aktif 24/7</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Respon Cepat</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Komunitas Supportif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}