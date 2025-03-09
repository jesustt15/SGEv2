
import {Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js';
import './components.css';
import { Doughnut } from 'react-chartjs-2';




ChartJS.register(ArcElement, Tooltip, Legend);



export const WelcomeHeader = () => {

    const alumnosData = {
        labels: ['Alumnos', 'Restante'],
        datasets: [
          {
            data: [308, 1000 - 308], // Ejemplo: parte de 1000
            backgroundColor: ['#233255', '#F6AD2B'], // Color principal y fondo
            hoverBackgroundColor: ['#0284c7', '#cbd5e1'],
            borderWidth: 0,
          },
        ],
      };
    
      // Datos para la gráfica de "Personal"
      const personalData = {
        labels: ['Personal', 'Restante'],
        datasets: [
          {
            data: [100, 300 - 100], // Ejemplo: parte de 300
            backgroundColor: ['#233255', '#F6AD2B'],
            hoverBackgroundColor: ['#eab308', '#fde68a'],
            borderWidth: 0,
          },
        ],
      };
    
      // Configuración común para los gráficos
      const chartOptions = {
        cutout: '80%', // Define el tamaño del "hueco" en el centro de la dona
        plugins: {
          legend: {
            display: false, // Oculta la leyenda para centrarnos en el valor
          },
        },
      };


  return (
    <div className='welcome-header'>
        <h1>Bienvenido/a Msc Generico</h1>
        <section className="estadisticas">
            <div className="estadistica-container">
                <div className="chart-wrapper">
                    <Doughnut data={alumnosData} options={chartOptions} />
                    <div className="chart-overlay">
                        <i className="pi pi-book"></i>
                    </div>
                </div>
                    <div className="chart-label">
                        <span>AlUMNOS</span>
                        <span>308</span>
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
                    <span>100</span>
                </div> 
            </div>
        </section>
    </div>
  )
}
