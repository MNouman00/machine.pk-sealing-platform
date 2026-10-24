import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; // <-- Add this

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(form.username, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/');
      } catch (err) {
      // Show the exact error Django returned
      if (err.response && err.response.data) {
        const data = err.response.data;
        const messages = Object.entries(data)
          .map(([field, msgs]) => {
            const msg = Array.isArray(msgs) ? msgs.join(', ') : msgs;
            return field === 'non_field_errors' ? msg : `${field}: ${msg}`;
          })
          .join(' | ');
        setError(messages);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Authentication failed. Check your credentials.');
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input required type="text" className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" onChange={(e) => setForm({...form, username: e.target.value})} />
          </div>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500" onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>
          )}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
  <div className="relative">
    <input 
      required 
      type={showPassword ? 'text' : 'password'} // <-- Dynamic type
      className="w-full border rounded-lg p-2.5 outline-none focus:border-blue-500 pr-10" 
      onChange={(e) => setForm({...form, password: e.target.value})} 
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>
          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition">
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}