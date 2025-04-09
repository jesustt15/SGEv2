import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './components.css';
import { useAuth, useEstudiante } from '../context';

ChartJS.register(ArcElement, Tooltip, Legend);

export const WelcomeHeader = () => {
  const { name } = useAuth();
  const { estudiante, getEstudiantes } = useEstudiante();

  // Estado para los datos del gráfico de alumnos
  const [alumnosData, setAlumnosData] = useState(null);

  // Se asume que el total de personal puede venir de algún hook similar;
  // en este ejemplo se usa un valor fijo.
  const personalCount = 100;
  const personalData = {
    labels: ['Personal', 'Restante'],
    datasets: [
      {
        data: [personalCount, 300 - personalCount],
        backgroundColor: ['#233255', '#F6AD2B'],
        hoverBackgroundColor: ['#eab308', '#fde68a'],
        borderWidth: 0,
      },
    ],
  };

  // Opciones comunes para ambas gráficas de dona
  const chartOptions = {
    cutout: '80%', // Define el tamaño del "hueco" en el centro
    plugins: {
      legend: {
        display: false, // Oculta la leyenda en la gráfica
      },
    },
  };

  // Llamamos a la función para obtener estudiantes al montar el componente
  useEffect(() => {
    getEstudiantes();
  }, [getEstudiantes]);

  // Cuando estudiante cambia, calculamos la cantidad por sexo y actualizamos alumnosData
  useEffect(() => {
    if (estudiante && estudiante.length > 0) {
      // Se filtran hombres y mujeres. Asumimos valores "M", "m", "masculino" para masculino,
      // y "F", "f", "femenino" para femenino (se puede ajustar según convenga)
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

  // Total de estudiantes (siempre que estudiante esté definido)
  const totalEstudiantes = estudiante ? estudiante.length : 0;

  return (
    <div className="welcome-header">
      <h1>Bienvenido/a Msc {name}</h1>
      <section className="estadisticas">
        <div className="estadistica-container">
          <div className="chart-wrapper">
            {/* Se muestra el gráfico solo cuando tenemos data */}
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
            <Doughnut data={personalData} options={chartOptions} />
            <div className="chart-overlay">
              <i className="pi pi-users"></i>
            </div>
          </div>
          <div className="chart-label">
            <span>PERSONAL</span>
            <span>{personalCount}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
