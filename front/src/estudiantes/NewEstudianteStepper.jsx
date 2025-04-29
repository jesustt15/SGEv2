import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewEstudiante } from './NewEstudiante';
import { NewRepresentante } from './NewRepresentante';
import { NewAutorizado } from './NewAutorizado';
import { Steps } from 'primereact/steps';

export const NewEstudianteStepper = () => {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  const stepsModel = [
    { label: 'Alumno' },
    { label: 'Padres' },
    { label: 'Autorizado' },
  ];

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
    navigate('/estudiantes');
  };

  return (
    <div className='stepper'>
      <Steps model={stepsModel} activeIndex={step - 1} style={{ marginBottom: '1rem' }} />
      {step === 1 && <NewEstudiante onStudentCreated={handleStudentCreated} />}
      {step === 2 && <NewRepresentante studentId={studentId} onRepresentanteCreated={handleRepresentanteCreated} />}
      {step === 3 && <NewAutorizado studentId={studentId} onAutorizadoCreated={handleAutorizadoCreated} />}
    </div>
  );
};





