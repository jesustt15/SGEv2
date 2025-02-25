
const Estudiante = require('./Estudiante');
const Representante = require('./Representante');
const Autorizado = require('./Autorizado');

// Establecer asociaciones
Estudiante.belongsToMany(Representante, {
  through: {
    model: 'EstudianteRepresentante', 
  },
  as: 'representantes',
  foreignKey: 'estudiante_id',
  otherKey: 'representante_id',
});

Representante.belongsToMany(Estudiante, {
  through: {
    model: 'EstudianteRepresentante',
  },
  as: 'estudiantes',
  foreignKey: 'representante_id',
  otherKey: 'estudiante_id',
});

// Otras asociaciones
Estudiante.hasMany(Autorizado, {
  as: 'autorizados',
  foreignKey: 'estudiante_id',
});

Autorizado.belongsTo(Estudiante, {
  foreignKey: 'estudiante_id',
});

module.exports = {
  Estudiante,
  Representante,
  Autorizado,
};
