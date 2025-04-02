
  // helpers/parseImageUrl.js
export const parseImageUrl = (filePath) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
  
  
    // Si no hay filePath válido, retornamos la imagen por defecto.
    if (!filePath || filePath.trim() === "") {
      return '/user-default.jpg';
    }
    
    // Reemplazamos los backslashes por forward slashes.
    const cleanPath = filePath.replace(/\\/g, '/');
    const fullUrl = `${BASE_URL}/${cleanPath}`;
    
    return fullUrl;
  };
  