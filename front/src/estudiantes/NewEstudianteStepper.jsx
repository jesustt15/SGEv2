// NewStudentProcess.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewEstudiante } from './NewEstudiante';
import { NewRepresentante } from './NewRepresentante';
import { NewAutorizado } from './NewAutorizado';

export const NewEstudianteStepper = () => {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  // Al crear el estudiante, guardamos el ID y avanzamos al formulario de representante.
  const handleStudentCreated = (id) => {
    setStudentId(id);
    setStep(2);
  };

  // Luego de agregar el representante y asociarlo al estudiante, avanzamos al siguiente paso.
  const handleRepresentanteCreated = () => {
    setStep(3);
  };

  // Finalmente, tras crear y asociar el autorizado, regresamos a la lista de estudiantes.
  const handleAutorizadoCreated = () => {
    // Redirigir o actualizar la vista a la tabla de estudiantes
    navigate('/estudiantes');
  };

  return (
    <div>
      {step === 1 && <NewEstudiante onStudentCreated={handleStudentCreated} />}
      {step === 2 && <NewRepresentante studentId={studentId} onRepresentanteCreated={handleRepresentanteCreated} />}
      {step === 3 && <NewAutorizado studentId={studentId} onAutorizadoCreated={handleAutorizadoCreated} />}
    </div>
  );
};





