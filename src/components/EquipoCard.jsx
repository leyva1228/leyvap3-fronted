import mediaUrl from '../mediaUrl';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const EquipoCard = ({ equipo, onEdit, onDelete }) => {
  const estadoColors = {
    disponible: 'bg-emerald-500',
    prestado: 'bg-navy-500',
    mantenimiento: 'bg-orangered-500',
    daniado: 'bg-red-500',
  };

  const imagenUrl = mediaUrl(equipo.imagen);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col h-full group">
      <div className="h-56 bg-gray-200 relative overflow-hidden">
        {imagenUrl ? (
          <img src={imagenUrl} alt={equipo.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${estadoColors[equipo.estado] || 'bg-gray-500'}`}>
          {equipo.estado.toUpperCase()}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-navy-800 mb-1">{equipo.nombre}</h3>
        <p className="text-gray-500 text-sm mb-1">Código: {equipo.codigo}</p>

        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          {(equipo.tipo_equipo_nombre ?? equipo.tipo_nombre) && (
            <span className="bg-navy-50 text-navy-700 text-xs font-semibold px-3 py-1 rounded-full">
              {equipo.tipo_equipo_nombre ?? equipo.tipo_nombre}
            </span>
          )}
          {equipo.fecha_adquisicion && (
            <span className="bg-cyan-50 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
              {formatDate(equipo.fecha_adquisicion)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
          <button onClick={() => onEdit(equipo)}
            className="flex-1 bg-navy-50 hover:bg-navy-100 text-navy-600 font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-[0.95]">
            Editar
          </button>
          <button onClick={() => onDelete(equipo.id)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-sm active:scale-[0.95]">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipoCard;
