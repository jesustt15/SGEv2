const Estudiante = require('./Estudiante');
const Representante = require('./Representante');
const Autorizado = require('./Autorizado');

// Relación Muchos a Muchos
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
  Autorizado

};