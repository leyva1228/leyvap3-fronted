import mediaUrl from '../mediaUrl';

const TipoCard = ({ tipo, onEdit, onDelete }) => {
  const iconoUrl = mediaUrl(tipo.icono);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 p-5 flex items-center gap-4 group">
      <div className="w-14 h-14 bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
        {iconoUrl ? (
          <img src={iconoUrl} alt={tipo.nombre} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <span className="text-2xl text-navy-400 font-bold">{tipo.nombre.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-navy-800 truncate">{tipo.nombre}</h4>
        <p className="text-sm text-gray-500 truncate">
          {tipo.descripcion || 'Sin descripción'}
        </p>
        {tipo.equipos_count !== undefined && (
          <p className="text-xs text-navy-500 mt-1">{tipo.equipos_count} equipo(s)</p>
        )}
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => onEdit(tipo)}
          className="p-2 text-navy-500 hover:bg-navy-50 rounded-lg transition-all duration-150 active:scale-[0.9]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => onDelete(tipo.id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-[0.9]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TipoCard;
