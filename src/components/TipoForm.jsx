import { useState, useEffect } from 'react';
import { LoadingSpinner } from './Spinner';

const DEPARTAMENTOS = ['GENERAL', 'SISTEMAS', 'CONTABILIDAD', 'LOGISTICA', 'OPERACIONES'];

const emptyForm = { nombre: '', descripcion: '', icono: null, departamento: 'GENERAL' };

const TipoForm = ({ initialData, onSubmit, onCancelEdit }) => {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData ? { ...initialData, icono: null } : { ...emptyForm });
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'icono' ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre || form.nombre.trim().length < 2) {
      errs.nombre = 'Mínimo 2 caracteres';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in duration-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {initialData ? 'Editar Tipo' : 'Nuevo Tipo'}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input type="text" name="nombre" placeholder="Ej: Microscopio"
            value={form.nombre} onChange={handleChange}
              className={`w-full p-2.5 border rounded-lg text-sm outline-none transition
                ${errors.nombre ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-navy-500'}`} />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" name="descripcion" placeholder="Descripción opcional"
            value={form.descripcion} onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition" />
        </div>

        <div className="w-full sm:w-44">
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <select name="departamento" value={form.departamento} onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition bg-white">
            {DEPARTAMENTOS.map((d) => (
              <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
          <input type="file" name="icono" onChange={handleChange} accept="image/*"
            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100" />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button type="submit" disabled={submitting}
            className="flex-1 sm:flex-none bg-orangered-500 hover:bg-orangered-600 disabled:bg-orangered-300 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-orangered-200">
            {submitting ? (
              <><LoadingSpinner size="sm" color="white" /> Guardando...</>
            ) : initialData ? 'Actualizar' : 'Crear'}
          </button>
          {initialData && (
            <button type="button" onClick={onCancelEdit}
              className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-200 active:scale-[0.97]">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TipoForm;
