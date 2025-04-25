const Estudiante = require('./Estudiante');
const Representante = require('./Representante');
const Autorizado = require('./Autorizado');
const Personal = require('./Personal');
const Seccion = require('./Seccion');

// Asociación entre Estudiante y Representante (muchos a muchos) con eliminación en cascada en la tabla intermedia
Estudiante.belongsToMany(Representante, {
  through: {
    model: 'EstudianteRepresentante',
    onDelete: 'CASCADE'
  },
  as: 'representantes',
  foreignKey: 'estudiante_id',
  otherKey: 'representante_id',
});
Representante.belongsToMany(Estudiante, {
  through: {
    model: 'EstudianteRepresentante',
    onDelete: 'CASCADE'
  },
  as: 'estudiantes',
  foreignKey: 'representante_id',
  otherKey: 'estudiante_id',
});

// Relación de uno a muchos entre Seccion y Estudiante
Estudiante.belongsTo(Seccion, { foreignKey: 'seccion_id' });
Seccion.hasMany(Estudiante, { foreignKey: 'seccion_id' });

// Relación de uno a muchos entre Estudiante y Autorizado con eliminación en cascada
Estudiante.hasMany(Autorizado, {
  as: 'autorizados',
  foreignKey: 'estudiante_id',
  onDelete: 'CASCADE',
});
Autorizado.belongsTo(Estudiante, {
  foreignKey: 'estudiante_id',
});

// Relación entre Personal y Seccion (para el docente)
Personal.hasOne(Seccion, { 
  as: 'seccion',
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
