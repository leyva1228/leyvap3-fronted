import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth/AuthContext';
import api from './api';
import LoginPage from './components/LoginPage';
import EquipoForm from './components/EquipoForm';
import EquipoCard from './components/EquipoCard';
import TipoForm from './components/TipoForm';
import TipoCard from './components/TipoCard';
import ToastContainer from './components/Toast';
import { toast } from './toast';
import { CardSkeleton, TipoSkeleton } from './components/Spinner';

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [equipoAEditar, setEquipoAEditar] = useState(null);

  const [editandoTipoId, setEditandoTipoId] = useState(null);
  const [tipoAEditar, setTipoAEditar] = useState(null);
  const [showTipoSection, setShowTipoSection] = useState(false);

  const fetchDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [resEquipos, resTipos] = await Promise.all([
        api.get('equipos/'),
        api.get('tipos/'),
      ]);
      setEquipos(resEquipos.data.results || resEquipos.data);
      setTipos(resTipos.data.results || resTipos.data);
    } catch {
      toast.error('Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) fetchDatos(); }, [user, fetchDatos]);

  // ========== EQUIPO CRUD ==========

  const handleEquipoSubmit = async (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === 'imagen') {
        if (editandoId && value === null) return;
        if (value !== null) data.append(key, value);
      } else if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    try {
      if (editandoId) {
        await api.patch(`equipos/${editandoId}/`, data);
        toast.success('Equipo actualizado correctamente');
      } else {
        await api.post('equipos/', data);
        toast.success('Equipo creado correctamente');
      }
      cancelarEdicion();
      fetchDatos();
    } catch (error) {
      const msg = error.response?.data || error.message;
      toast.error(`Error al guardar equipo: ${JSON.stringify(msg)}`);
      console.error(error);
    }
  };

  const handleEditarClick = (equipo) => {
    setEquipoAEditar(equipo);
    setEditandoId(equipo.id);
    setShowTipoSection(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminarEquipo = async (id) => {
    if (!window.confirm('¿Eliminar este equipo permanentemente?')) return;
    try {
      await api.delete(`equipos/${id}/`);
      toast.success('Equipo eliminado');
      fetchDatos();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Error al eliminar equipo';
      toast.error(msg);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEquipoAEditar(null);
  };

  // ========== TIPO CRUD ==========

  const handleTipoSubmit = async (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === 'icono') {
        if (editandoTipoId && value === null) return;
        if (value !== null) data.append(key, value);
      } else if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    try {
      if (editandoTipoId) {
        await api.patch(`tipos/${editandoTipoId}/`, data);
        toast.success('Tipo actualizado correctamente');
      } else {
        await api.post('tipos/', data);
        toast.success('Tipo creado correctamente');
      }
      cancelarEdicionTipo();
      fetchDatos();
    } catch {
      toast.error('Error al guardar tipo');
    }
  };

  const handleEditarTipo = (tipo) => {
    setTipoAEditar(tipo);
    setEditandoTipoId(tipo.id);
  };

  const handleEliminarTipo = async (id) => {
    if (!window.confirm('¿Eliminar este tipo? Los equipos asociados quedarán sin tipo.')) return;
    try {
      await api.delete(`tipos/${id}/`);
      toast.success('Tipo eliminado');
      fetchDatos();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Error al eliminar tipo. Verifica que no tenga equipos asociados.';
      toast.error(msg);
    }
  };

  const cancelarEdicionTipo = () => {
    setEditandoTipoId(null);
    setTipoAEditar(null);
  };

  // ========== AUTH GUARD ==========

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 font-sans">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-navy-800 animate-fade-in-down duration-500 ease-out [animation-fill-mode:both]">
            Inventario de Laboratorio
          </h1>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 active:scale-[0.97]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

        {/* --- Toggle: Sección Tipos --- */}
        <div className="mb-6">
          <button onClick={() => { setShowTipoSection((v) => !v); cancelarEdicion(); }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-navy-700 hover:bg-navy-50 transition-all duration-200 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 active:scale-[0.97]">
            <svg className={`w-4 h-4 transition-transform duration-200 ${showTipoSection ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {showTipoSection ? 'Ocultar' : 'Gestionar'} Tipos de Equipo
          </button>
        </div>

        {showTipoSection && (
          <div className="mb-12 space-y-4 animate-fade-in duration-200 ease-out">
            <TipoForm
              initialData={tipoAEditar}
              onSubmit={handleTipoSubmit}
              onCancelEdit={cancelarEdicionTipo}
            />
            <h3 className="text-lg font-bold text-gray-700 mt-6 mb-3">Tipos Registrados</h3>
            {loading ? (
              <div className="space-y-3"><TipoSkeleton count={3} /></div>
            ) : tipos.length === 0 ? (
              <p className="text-gray-400 text-sm animate-fade-in duration-300">No hay tipos registrados.</p>
            ) : (
              <div className="space-y-2">
                {tipos.map((tipo, i) => (
                  <div key={tipo.id} className="animate-fade-in-up duration-300 ease-out [animation-fill-mode:both]" style={{ animationDelay: `${i * 40}ms` }}>
                    <TipoCard
                      tipo={tipo}
                      onEdit={handleEditarTipo}
                      onDelete={handleEliminarTipo}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Formulario Equipos --- */}
        <EquipoForm
          tipos={tipos}
          onSubmit={handleEquipoSubmit}
          initialData={equipoAEditar}
          onCancelEdit={cancelarEdicion}
        />

        {/* --- Lista de Equipos --- */}
        <h2 className="text-2xl font-bold mb-6 text-navy-800 border-b border-navy-200 pb-2 flex justify-between items-center">
          Equipos Existentes
          <span className="text-sm font-medium text-white bg-navy-600 px-3 py-1 rounded-full shadow-sm">
            Total: {equipos.length}
          </span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton count={6} />
          </div>
        ) : equipos.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow text-gray-500 animate-fade-in duration-300">
            No hay equipos registrados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipos.map((equipo, i) => (
              <div key={equipo.id} className="animate-fade-in-up duration-400 ease-out [animation-fill-mode:both]" style={{ animationDelay: `${i * 60}ms` }}>
                <EquipoCard
                  equipo={equipo}
                  onEdit={handleEditarClick}
                  onDelete={handleEliminarEquipo}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
