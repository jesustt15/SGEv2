
  // helpers/parseImageUrl.js
export const parseImageUrl = (filePath) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
  
    console.log('parseImageUrl - filePath recibido:', filePath);
  
    // Si no hay filePath válido, retornamos la imagen por defecto.
    if (!filePath || filePath.trim() === "") {
      console.log('parseImageUrl - Valor no válido; se usará imagen por defecto.');
      return '/user-default.jpg';
    }
    
    // Reemplazamos los backslashes por forward slashes.
    const cleanPath = filePath.replace(/\\/g, '/');
    const fullUrl = `${BASE_URL}/${cleanPath}`;
    
    console.log('parseImageUrl - URL transformada:', fullUrl);
    return fullUrl;
  };
  