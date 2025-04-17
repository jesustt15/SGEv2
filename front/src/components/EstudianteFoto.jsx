/* eslint-disable react/prop-types */

import { parseImageUrl } from '../helpers';
import Icon from '../icono-user.jpg';

export const EstudianteFoto = ({ estudiante }) => {
  // Si existe estudiante y tiene foto, la procesamos; de lo contrario, usamos Icon.
  const fotoSrc = estudiante && estudiante.foto 
    ? parseImageUrl(estudiante.foto)
    : Icon;

  return (
    <div>
      <div className="foto-edit">
        <img
          src={fotoSrc}
          alt="Imagen del Estudiante"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

