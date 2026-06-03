import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { LoadingSpinner } from './Spinner';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(username.trim(), password);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError(err.response?.data?.detail || 'Error de conexión con el servidor');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-8 animate-fade-in-up duration-500 ease-out [animation-fill-mode:both]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-navy-800">Inventario de Laboratorio</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 animate-shake-in duration-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <input type="text" value={username} autoFocus
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-orangered-500 hover:bg-orangered-600 disabled:bg-orangered-300 text-white font-bold py-3 rounded-lg shadow-md shadow-orangered-200 hover:shadow-lg hover:shadow-orangered-300 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2">
            {submitting ? (
              <><LoadingSpinner size="sm" color="white" /> Ingresando...</>
            ) : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acceso autorizado solo para personal del laboratorio
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
