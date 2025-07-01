import React, { useState, useEffect } from 'react';
import type { RegisterInputProps } from '../../../types/index';

const RegisterInput: React.FC<RegisterInputProps> = ({
  register,
  errors = {},
  disabled = false,
  checkEmailExists
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [focused, setFocused] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckDebounce, setEmailCheckDebounce] = useState<NodeJS.Timeout | null>(null);

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check email existence with debounce
    if (name === 'email' && value && checkEmailExists) {
      if (emailCheckDebounce) clearTimeout(emailCheckDebounce);

      setIsCheckingEmail(true);
      const timer = setTimeout(async () => {
        try {
          const exists = await checkEmailExists(value);
          setEmailExists(exists);
        } catch (error) {
          console.error('Error checking email:', error);
        } finally {
          setIsCheckingEmail(false);
        }
      }, 500);

      setEmailCheckDebounce(timer);
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strengthScore = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars, isLongEnough]
      .filter(Boolean).length;

    if (strengthScore <= 2) setPasswordStrength('weak');
    else if (strengthScore <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert('Semua field harus diisi.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok.');
      return;
    }

    // Don't submit if email already exists
    if (emailExists) {
      alert('Email sudah digunakan. Silakan gunakan email lain.');
    }
    register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    alert('Registrasi berhasil!');
  };

  const handleFocus = (field: string) => setFocused(field);
  const handleBlur = () => setFocused(null);

  // Determine if passwords match
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMatchError = formData.confirmPassword && !passwordsMatch;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (emailCheckDebounce) {
        clearTimeout(emailCheckDebounce);
      }
    };
  }, [emailCheckDebounce]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
    case 'weak': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'strong': return 'bg-green-500';
    default: return 'bg-gray-200';
    }
  };

  const getStrengthText = () => {
    switch (passwordStrength) {
    case 'weak': return 'Lemah';
    case 'medium': return 'Sedang';
    case 'strong': return 'Kuat';
    default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div>
        <div className={`relative rounded-lg border-2 ${errors.name
          ? 'border-red-400'
          : focused === 'name'
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300'
        } transition-all duration-200`}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
            disabled={disabled}
            className="block w-full px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
          />
          <label
            htmlFor="name"
            className={`absolute left-4 transition-all duration-200 ${focused === 'name' || formData.name
              ? 'top-1 text-xs font-medium text-blue-600'
              : 'top-3.5 text-gray-500'
            }`}
          >
                        Nama Lengkap
          </label>
        </div>
        {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <div className={`relative rounded-lg border-2 ${errors.email || emailExists
          ? 'border-red-400'
          : focused === 'email'
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300'
        } transition-all duration-200`}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            disabled={disabled}
            className="block w-full px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
          />
          <label
            htmlFor="email"
            className={`absolute left-4 transition-all duration-200 ${focused === 'email' || formData.email
              ? 'top-1 text-xs font-medium text-blue-600'
              : 'top-3.5 text-gray-500'
            }`}
          >
                        Alamat Email
          </label>
          {isCheckingEmail && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email}</p>}
        {emailExists && <p className="mt-1 text-sm text-red-500 font-medium">Email sudah terdaftar. Silakan gunakan email lain atau login.</p>}
      </div>

      {/* Password Field */}
      <div>
        <div className={`relative rounded-lg border-2 ${errors.password
          ? 'border-red-400'
          : focused === 'password'
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-300'
        } transition-all duration-200`}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            onFocus={() => handleFocus('password')}
            onBlur={handleBlur}
            disabled={disabled}
            className="block w-full px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none bg-transparent pr-10"
          />
          <label
            htmlFor="password"
            className={`absolute left-4 transition-all duration-200 ${focused === 'password' || formData.password
              ? 'top-1 text-xs font-medium text-blue-600'
              : 'top-3.5 text-gray-500'
            }`}
          >
                        Password
          </label>
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label={passwordVisible ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {passwordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500 font-medium">{errors.password}</p>}

        {/* Password strength indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Kekuatan Password:
                <span className={`ml-1 ${passwordStrength === 'weak' ? 'text-red-500' :
                  passwordStrength === 'medium' ? 'text-yellow-500' :
                    passwordStrength === 'strong' ? 'text-green-500' : ''
                }`}>
                  {getStrengthText()}
                </span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{
                  width: passwordStrength === 'weak' ? '33%' :
                    passwordStrength === 'medium' ? '66%' :
                      passwordStrength === 'strong' ? '100%' : '0%'
                }}
              ></div>
            </div>
            <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-5 list-disc">
              <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>
                                Minimal 8 karakter
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>
                                Setidaknya 1 huruf kapital
              </li>
              <li className={/\d/.test(formData.password) ? 'text-green-500' : ''}>
                                Setidaknya 1 angka
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-500' : ''}>
                                Setidaknya 1 karakter khusus (!@#$%^&*)
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <div className={`relative rounded-lg border-2 ${showPasswordMatchError
          ? 'border-red-400'
          : focused === 'confirmPassword'
            ? 'border-blue-500 ring-1 ring-blue-500'
            : formData.confirmPassword && passwordsMatch
              ? 'border-green-500'
              : 'border-gray-300'
        } transition-all duration-200`}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="confirmPassword"
            id="confirmPassword"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => handleFocus('confirmPassword')}
            onBlur={handleBlur}
            disabled={disabled}
            className="block w-full px-4 pt-6 pb-2 text-gray-900 placeholder-transparent focus:outline-none bg-transparent"
          />
          <label
            htmlFor="confirmPassword"
            className={`absolute left-4 transition-all duration-200 ${focused === 'confirmPassword' || formData.confirmPassword
              ? 'top-1 text-xs font-medium text-blue-600'
              : 'top-3.5 text-gray-500'
            }`}
          >
                        Konfirmasi Password
          </label>

          {formData.confirmPassword && passwordsMatch && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        {showPasswordMatchError && (
          <p className="mt-1 text-sm text-red-500 font-medium">Password tidak cocok</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          disabled ||
                    !formData.name ||
                    !formData.email ||
                    !formData.password ||
                    !passwordsMatch ||
                    emailExists ||
                    isCheckingEmail
        }
        className={`w-full py-3.5 px-4 rounded-lg text-white font-semibold text-base
          ${disabled || !formData.name || !formData.email || !formData.password || !passwordsMatch || emailExists || isCheckingEmail
      ? 'bg-blue-300 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md'
    }
          transition-all duration-200`}
      >
        {disabled ? 'Memproses...' : 'Daftar'}
      </button>

      {/* Login link */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
                    Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Masuk di sini
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterInput;