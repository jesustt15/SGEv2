import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Smiley from '../assets/smiley.png';
import './components.css';
import { useAuth, useEstudiante, usePersonal } from '../context';

ChartJS.register(ArcElement, Tooltip, Legend);

export const WelcomeHeader = () => {
  const { name, role } = useAuth();
  const { estudiante, getEstudiantes } = useEstudiante();
  const { personal, getPersonals } = usePersonal();

  const [alumnosData, setAlumnosData] = useState(null);
  const [personalData, setPersonalData] = useState(null);

  // Opciones comunes para ambas gráficas de dona
  const chartOptions = {
    cutout: '90%', // Define el tamaño del "hueco" en el centro
    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
    },
  };

  useEffect(() => {
    getEstudiantes();
    getPersonals();
  }, [getEstudiantes, getPersonals]);

  // Actualiza la data de alumnos cuando cambie la lista de estudiantes
  useEffect(() => {
    if (estudiante && estudiante.length > 0) {
      const countMasculino = estudiante.filter((st) => {
        const sexo = st.sexo.toLowerCase();
        return sexo === 'masculino' || sexo === 'm';
      }).length;

      const countFemenino = estudiante.filter((st) => {
        const sexo = st.sexo.toLowerCase();
        return sexo === 'femenino' || sexo === 'f';
      }).length;

      setAlumnosData({
        labels: ['Masculino', 'Femenino'],
        datasets: [
          {
            data: [countMasculino, countFemenino],
            backgroundColor: ['#233255', '#F6AD2B'],
            hoverBackgroundColor: ['#0284c7', '#cbd5e1'],
            borderWidth: 0,
          },
        ],
      });
    }
  }, [estudiante]);

  // Actualiza la data del gráfico de personal diferenciando entre docentes y otros
  useEffect(() => {
    if (personal && personal.length > 0) {
      const countDocentes = personal.filter((p) => p.cargo === 'Docente').length;
      const countOtros = personal.filter((p) => p.cargo !== 'Docente').length;

      setPersonalData({
        labels: ['Docentes', 'Otros'],
        datasets: [
          {
            data: [countDocentes, countOtros],
            backgroundColor: ['#233255', '#F6AD2B'],
            hoverBackgroundColor: ['#0284c7', '#cbd5e1'],
            borderWidth: 0,
          },
        ],
      });
    }
  }, [personal]);

  // Total de estudiantes (siempre que estudiante esté definido)
  const totalEstudiantes = estudiante ? estudiante.length : 0;
  // Total de personal
  const totalPersonal = personal ? personal.length : 0;


  return (
    <div className="welcome-header">
      <h1>Bienvenido/a 
        <img className='smiley' src={Smiley} alt="smiley" />
        {name}</h1>
      <section className="estadisticas">
        <div className="estadistica-container">
          <div className="chart-wrapper">
            {alumnosData && <Doughnut data={alumnosData} options={chartOptions} />}
            <div className="chart-overlay">
              <i className="pi pi-book"></i>
            </div>
          </div>
          <div className="chart-label">
            <span>ALUMNOS</span>
            <span>{totalEstudiantes}</span>
          </div>
        </div>
        <div className="estadistica-container">
          <div className="chart-wrapper">
            {/* Se muestra el gráfico de personal solamente cuando tenemos la data */}
            {personalData && <Doughnut data={personalData} options={chartOptions} />}
            <div className="chart-overlay">
              <i className="pi pi-users"></i>
            </div>
          </div>
          <div className="chart-label">
            <span>PERSONAL</span>
            <span>{totalPersonal}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
