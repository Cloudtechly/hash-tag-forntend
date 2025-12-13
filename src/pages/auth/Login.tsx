import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../config/i18n';
import { auth, googleProvider, facebookProvider } from '../../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import fetchData from '../../Api/FetchApi'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'


function Login() {
  const { t, i18n } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  // Google OAuth2 login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        const token = await user.getIdToken();
        // Send token to backend
        const res = await fetchData<any>(
          'customer/auth/socialites/firebase',
          'POST',
          {
            token,
            name: user.displayName,
            email: user.email,
            phone_number: user.phoneNumber,
            device_name: 'web',

            provider: 'google',
          }
        );
       
        localStorage.setItem('token', res.token);
        navigate('/interests');

    
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };
  // Facebook OAuth2 login handler
  const handleFacebookLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      if (user) {
        const token = await user.getIdToken();
        // Send token to backend
        const res = await fetchData<any>(
          'customer/auth/socialites/firebase',
          'POST',
          {
            token,
            name: user.displayName,
            email: user.email,
            phone_number: user.phoneNumber,
            device_name: 'web',
            provider: 'facebook',
          }
        );
        localStorage.setItem('token', res.token);
        navigate('/interests');
      }
    } catch (err: any) {
      setError(err.message || 'Facebook login failed');
    } finally {
      setLoading(false);
    }
  };
  const handlePreLogin = async (e: React.FormEvent) => {
  // Google OAuth2 login handler
  
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetchData<any>(
        'customer/auth/pre-login',
        'POST',
        {
          phone_number: '+218'+phoneNumber,
          device_name: 'web',
        }
      );
      setSuccess('OTP sent successfully!');
      if (res.otp && res.otp.id) {
        navigate('/otp', {
          state: {
            phoneNumber: res.otp.phone_number,
            user_exists: res.user_exists,
            otp_id: res.otp.id,
          },
        });
      }
      
    } catch (err: any) {
      setError(err.message || 'Pre-login failed');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('login_title')}</h1>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handlePreLogin}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
            {t('email')}
          </label>
          <input
            type="text"
            placeholder="9123456789"
            className="w-full rounded-xl bg-gray-100 px-4 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
            disabled={loading}
          >
            {loading ? t('login_button') : t('login_button')}
          </button>
        </form>
        <div className="flex gap-2 justify-center mt-4">
          <button type="button" onClick={() => { i18n.changeLanguage('en'); localStorage.setItem('lang', 'en'); }} className="px-2 py-1 rounded bg-gray-100">EN</button>
          <button type="button" onClick={() => { i18n.changeLanguage('ar'); localStorage.setItem('lang', 'ar'); }} className="px-2 py-1 rounded bg-gray-100">AR</button>
          <button type="button" onClick={() => { i18n.changeLanguage('tr'); localStorage.setItem('lang', 'tr'); }} className="px-2 py-1 rounded bg-gray-100">TR</button>
          <button type="button" onClick={() => { i18n.changeLanguage('zh'); localStorage.setItem('lang', 'zh'); }} className="px-2 py-1 rounded bg-gray-100">ZH</button>
        </div>

        {/* Social Login */}
        <div className="mt-8 flex flex-col items-center">
          <p className="mb-6 text-sm text-gray-500">Or Login with social account</p>
          <div className="flex gap-4">
            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50"
              disabled={loading}
            >
              <FcGoogle size={24} />
            </button>
            <button 
              onClick={handleFacebookLogin}
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 text-[#1877F2]"
              disabled={loading}
            >
              <FaFacebookF size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}export default Login
