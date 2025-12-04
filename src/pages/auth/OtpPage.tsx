import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import fetchData from '../../Api/FetchApi';

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { phoneNumber, user_exists, otp_id } = location.state || {};

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    // Focus next input
    if (element.value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const endpoint = user_exists ? 'customer/auth/login' : 'customer/auth/login';
      const payload = {
        otp_id: '' + otp_id,
        phone_number: phoneNumber,
        code: otp.join(''),
        ...(user_exists ? {} : { name: 'New User' })
      };
      const res = await fetchData<any>(endpoint, 'POST', payload);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setSuccess('Verification successful!');
        navigate('/interests');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetchData<any>('customer/auth/pre-login', 'POST', {
        phone_number: phoneNumber,
        device_name: 'web',
      });
      setSuccess('OTP resent successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-2xl text-gray-800">
            <IoIosArrowBack />
          </button>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">OTP Verification</h1>
        </div>
        <p className="mb-8 text-gray-600 leading-relaxed text-center">
          Please enter the 6-digit code we sent to {phoneNumber}
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-200 rounded-lg bg-pink-50 focus:border-orange-400 focus:ring-0"
              disabled={loading}
            />
          ))}
        </div>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        {success && <div className="text-green-500 text-center mb-2">{success}</div>}
        <button
          className="w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
          onClick={handleVerify}
          disabled={loading || otp.some((digit) => !digit)}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button
          className="mt-4 w-full rounded-2xl bg-[#FADCD3] py-4 text-lg font-semibold text-[#E46A4B] transition-transform active:scale-95"
          onClick={handleResend}
          disabled={loading}
        >
          Resend
        </button>
      </div>
    </div>
  );
}
