/* eslint-disable react/prop-types */

import { parseImageUrl } from '../helpers';

export const EstudianteFoto = ({ estudiante }) => {

    return (
    <div>
      <div className="foto-edit">
        <img
          src={parseImageUrl(estudiante?.foto)}
          alt="Imagen del Estudiante"
        />
      </div>
    </div>
  );
};

