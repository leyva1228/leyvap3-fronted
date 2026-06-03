import { useState, useEffect } from 'react';
import mediaUrl from '../mediaUrl';
import { LoadingSpinner } from './Spinner';

const emptyForm = {
  nombre: '', codigo: '', estado: 'disponible',
  tipo_equipo: '', fecha_adquisicion: '', imagen: null,
};

const EquipoForm = ({ tipos, onSubmit, initialData, onCancelEdit }) => {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialData ? { ...initialData, imagen: null } : { ...emptyForm });
    setPreview(initialData?.imagen ? mediaUrl(initialData.imagen) : null);
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagen') {
      const file = files[0];
      if (file && !file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, imagen: 'Solo se permiten imágenes' }));
        e.target.value = '';
        return;
      }
      setForm((prev) => ({ ...prev, imagen: file }));
      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.nombre || form.nombre.trim().length < 3) {
      errs.nombre = 'Mínimo 3 caracteres';
    }
    if (!form.codigo || form.codigo.trim().length < 2) {
      errs.codigo = 'Ingresa un código válido';
    }
    if (!form.tipo_equipo) {
      errs.tipo_equipo = 'Selecciona un tipo';
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
      if (!initialData) {
        setForm({ ...emptyForm });
        setPreview(null);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (name) =>
    `w-full p-3 border rounded-lg outline-none transition text-sm
    ${errors[name] ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-navy-500'}`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border-t-4 border-orangered-500 animate-fade-in duration-300 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-6 text-navy-800">
        {initialData ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input type="text" name="nombre" placeholder="Nombre del Equipo"
            value={form.nombre} onChange={handleChange}
            className={inputClass('nombre')} />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <input type="text" name="codigo" placeholder="Ej: LAB-001"
            value={form.codigo} onChange={handleChange}
            className={inputClass('codigo')} />
          {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition">
            <option value="disponible">Disponible</option>
            <option value="prestado">Prestado</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="daniado">Dañado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo *</label>
          <select name="tipo_equipo" value={form.tipo_equipo} onChange={handleChange}
            className={inputClass('tipo_equipo')}>
            <option value="">-- Seleccionar --</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
          {errors.tipo_equipo && <p className="text-red-500 text-xs mt-1">{errors.tipo_equipo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Adquisición</label>
          <input type="date" name="fecha_adquisicion"
            value={form.fecha_adquisicion} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-navy-500 transition" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <input type="file" name="imagen" onChange={handleChange} accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100 file:transition-colors file:duration-200" />
          <p className="text-xs text-gray-400 mt-1">
            {initialData ? 'Deja vacío para mantener la imagen actual' : 'Sube una imagen'}
          </p>
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg border transition-transform duration-300 hover:scale-105" />
          )}
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-orangered-500 hover:bg-orangered-600 disabled:bg-orangered-300 text-white font-bold py-3 rounded-lg shadow-md shadow-orangered-200 hover:shadow-lg hover:shadow-orangered-300 active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2">
            {submitting ? (
              <><LoadingSpinner size="sm" color="white" /> Guardando...</>
            ) : initialData ? 'Actualizar Equipo' : 'Guardar en Inventario'}
          </button>

          {initialData && (
            <button type="button" onClick={onCancelEdit}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97]">
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EquipoForm;
