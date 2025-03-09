import { 
    Chart as ChartJS,
    Legend, 
    Tooltip, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement,   // Importa el elemento de línea
    ArcElement     // Requerido para gráficos de tipo Pie o Doughnut
  } from 'chart.js';
  import { Line, Pie } from 'react-chartjs-2';
  
  // Registra todos los elementos necesarios
  ChartJS.register(LineElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);
  
  export const WelcomeMid = () => {
    const lineData = {
      labels: ['0-18', '19-30', '31-45', '46-60', '60+'],
      datasets: [
        {
          label: 'Estadísticas por Edad',
          data: [12, 19, 3, 5, 2],
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  
    const pieData = {
      labels: ['Hombres', 'Mujeres'],
      datasets: [
        {
          label: 'Estadísticas por Género',
          data: [60, 40],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
  
    // Opciones para el gráfico de línea (el gráfico Pie no requiere configuración de escalas)
    const optionsLine = {
      scales: {
        x: {
          type: 'category', // Define explícitamente el tipo de escala para el eje x
        },
      },
    };
  
    return (
      <div className='welcome-mid'>
        <div className='chart-container'>
          <h3>Estadísticas por Edad</h3>
         <div className="graphic-wrapper">
            <Line key="line-chart" data={lineData} options={optionsLine} />
            </div>
            <div />
        </div>
       

        <div className='chart-container'>
          <h3>Estadísticas por Género</h3>
          <div className="graphic-wrapper">
            <Pie key="pie-chart" data={pieData} />
          </div>
        </div>
      </div>
    );
  };
  