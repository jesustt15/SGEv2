const Estudiante = require('./Estudiante');
const Representante = require('./Representante');
const Autorizado = require('./Autorizado');
const Personal = require('./Personal');
const Seccion = require('./Seccion');

// Asociación entre Estudiante y Representante (muchos a muchos)
Estudiante.belongsToMany(Representante, {
  through: 'EstudianteRepresentante',
  as: 'representantes',
  foreignKey: 'estudiante_id',
  otherKey: 'representante_id',
});
Representante.belongsToMany(Estudiante, {
  through: 'EstudianteRepresentante',
  as: 'estudiantes',
  foreignKey: 'representante_id',
  otherKey: 'estudiante_id',
});

// Relación de uno a muchos entre Seccion y Estudiante
// Cada estudiante tiene un campo seccion_id, y una sección tiene muchos estudiantes.
Estudiante.belongsTo(Seccion, { foreignKey: 'seccion_id' });
Seccion.hasMany(Estudiante, { foreignKey: 'seccion_id' });

// Relaciones para Autorizado (se mantienen si ya están correctas)
Estudiante.hasMany(Autorizado, {
  as: 'autorizados',
  foreignKey: 'estudiante_id',
});
Autorizado.belongsTo(Estudiante, {
  foreignKey: 'estudiante_id',
});

// Relación entre Personal y Seccion (para el docente)  
// Se utiliza la columna docente_id en el modelo Seccion.
Personal.hasOne(Seccion, { 
  as: 'seccion',  // se puede nombrar "seccion" (o "secciones" si tiene muchas) según la lógica del negocio
  foreignKey: 'docente_id' 
});
Seccion.belongsTo(Personal, { 
  foreignKey: 'docente_id' 
});

module.exports = {
  Estudiante,
  Representante,
  Autorizado,
  Personal,
  Seccion,
};
