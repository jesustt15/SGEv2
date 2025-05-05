import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS,
  Legend, 
  Tooltip, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,  
  ArcElement  
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useEstudiante } from '../context';
import './components.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Registra todos los elementos necesarios
ChartJS.register(LineElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement);

export const WelcomeMid = () => {
  const { estudiante, getEstudiantes } = useEstudiante();

  // Estado para el gráfico de edad y para el de género
  const [ageData, setAgeData] = useState(null);
  const [genderData, setGenderData] = useState(null);

  // Invoca la consulta para traer los estudiantes cuando se carga el componente
  useEffect(() => {
    getEstudiantes();
  }, []);

  // Cuando 'estudiante' cambia, calcula la distribución de edades y la de género
  useEffect(() => {
    if (estudiante && estudiante.length > 0) {
      // Definimos grupos de edad; puedes ajustar estos rangos según tu necesidad
      const ageLabels = ['<2', '3', '4', '5', '5+'];
      const ageCounts = [0, 0, 0, 0, 0];

      estudiante.forEach((stu) => {
        const edad = parseInt(stu.edad, 10);
        if (!isNaN(edad)) {
          // Asigna la edad al grupo correspondiente
          if (edad <= 2) {
            ageCounts[0]++;
          } else if (edad == 3) {
            ageCounts[1]++;
          } else if (edad == 4) {
            ageCounts[2]++;
          } else if (edad == 5) {
            ageCounts[3]++;
          } else {
            ageCounts[4]++;
          }
        }
      });

      setAgeData({
        labels: ageLabels,
        datasets: [
          {
            label: 'Estadísticas por Edad',
            data: ageCounts,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      });

      // Calcula el total de estudiantes masculinos y femeninos
      const countHombres = estudiante.filter((st) => {
        const sexo = st.sexo ? st.sexo.toLowerCase() : '';
        return sexo === 'masculino' || sexo === 'm';
      }).length;

      const countMujeres = estudiante.filter((st) => {
        const sexo = st.sexo ? st.sexo.toLowerCase() : '';
        return sexo === 'femenino' || sexo === 'f';
      }).length;

      setGenderData({
        labels: ['Hombres', 'Mujeres'],
        datasets: [
          {
            label: 'Estadísticas por Género',
            data: [countHombres, countMujeres],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      });
    }
  }, [estudiante]);

  // Opciones para el gráfico de línea (por edades)
  const optionsLine = {
    scales: {
      x: {
        type: 'category',
      },
    },
  };

  return (
    <>
      <div className='welcome-mid'>
        <div className='chart-container'>
          <h3>Estadísticas por Edad</h3>
          <div className="graphic-wrapper">
            {ageData ? (
              <Line key="line-chart" data={ageData} options={optionsLine} />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
          </div>
        <div className='chart-container'>
          <h3>Estadísticas por Género</h3>
          <div className="graphic-wrapper">
            {genderData ? (
              <Pie key="pie-chart" data={genderData} />
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>
      </div>
      <div className="estudiantes-table">
        <h3>Agregados Recientemente</h3>
                <DataTable
                    value={Array.isArray(estudiante) ? estudiante : []}
                    paginator
                    rows={10}
                    emptyMessage="No se encontraron Estudiantes."
                    selectionMode="single"
                  >
        
                  <Column field="cedulaEscolar" header="CED" sortable />
                  <Column field="nombres" header="NOMBRES" sortable />
                  <Column field="apellidos" header="APELLIDOS" sortable />
                  <Column field="fechaNacimiento" header="FECHA DE NACIMIENTO" sortable />
                  <Column field="edad" header="EDAD" sortable />
                  <Column field="sexo" header="SEXO" sortable />
                </DataTable>
      </div>
    </>
    
  );
};

  