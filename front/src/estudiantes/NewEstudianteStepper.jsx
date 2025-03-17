// NewEstudianteStepper.jsx
import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { NewEstudiante } from './NewEstudiante';
import { NewRepresentante } from './NewRepresentante';
import { NewAutorizado } from './NewAutorizado';

export const NewEstudianteStepper = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [estudianteId, setEstudianteId] = useState(null);

  const steps = [
    { label: 'Estudiante' },
    { label: 'Representante' },
    { label: 'Autorizado' },
  ];

  const onStudentCreated = (id) => {
    // Guarda el ID del estudiante y avanza al formulario de representante
    console.log("Estudiante creado con ID: ", id);
    setEstudianteId(id);
    setActiveIndex(1);
  };

  const onRepresentanteCreated = () => {
    // Avanza al siguiente paso (por ejemplo, para agregar al autorizado)
    setActiveIndex(2);
  };

  const onAutorizadoCreated = () => {
    console.log("Proceso completado, representante y autorizado vinculados.");
    // Aquí puedes limpiar el formulario o mostrar un mensaje final sin redirigir
  };

  return (
    <div>
      <Steps model={steps} activeIndex={activeIndex} />
      <div className="steps-content" style={{ marginTop: '2rem' }}>
        {activeIndex === 0 && <NewEstudiante onStudentCreated={onStudentCreated} />}
        {activeIndex === 1 && (
          <NewRepresentante 
            estudianteId={estudianteId}
            onRepresentanteCreated={onRepresentanteCreated} 
          />
        )}
        {activeIndex === 2 && (
          <NewAutorizado 
            estudianteId={estudianteId}
            onAutorizadoCreated={onAutorizadoCreated} 
          />
        )}
      </div>
    </div>
  );
};




