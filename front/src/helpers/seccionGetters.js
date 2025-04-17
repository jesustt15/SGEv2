// src/utils/seccionHelpers.js

/**
 * Obtiene el nombre completo del docente en función del ID.
 * @param {string} docenteId - El ID del docente.
 * @param {Array} personals - Arreglo de docentes (con propiedades personal_id, nombres, apellidos, etc.).
 * @returns {string} El nombre completo del docente o un mensaje de "no asignado".
 */
export const getDocenteName = (docenteId, personals) => {
    if (!docenteId || !Array.isArray(personals)) return 'Docente no asignado';
    const teacher = personals.find((p) => p.personal_id === docenteId);
    return teacher ? `${teacher.nombres} ${teacher.apellidos}` : 'Docente no asignado';
  };
  
  /**
/**
 * Obtiene la cantidad de alumnos asignados a una sección.
 * @param {string} seccionId - El ID de la sección.
 * @param {Array} estudiantes - Arreglo de estudiantes, cada uno con la propiedad seccion_id.
 * @returns {number} La cantidad de alumnos que pertenecen a la sección.
 */
export const getCantidadAlumnos = (seccionId, estudiantes) => {
  if (!seccionId || !Array.isArray(estudiantes)) return 0;
  const cuenta = estudiantes.filter(est => est.seccion_id === seccionId).length;
  return cuenta;
};
