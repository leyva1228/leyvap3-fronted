const BASE = import.meta.env.VITE_API_URL || '';

const mediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('//')) return path;
  return `${BASE}/media/${path}`;
};

export default mediaUrl;
