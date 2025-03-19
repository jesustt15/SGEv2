const Estudiante = require('./Estudiante');
const Representante = require('./Representante');
const Autorizado = require('./Autorizado');
const Personal = require('./Personal');
const Seccion = require('./Seccion');

// Establecer asociaciones
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

Estudiante.belongsToMany(Seccion, {
  through: 'EstudianteSeccion',
  as: 'secciones',
  foreignKey: 'estudiante_id',
  otherKey: 'seccion_id',
});

Seccion.belongsToMany(Estudiante, {
  through: 'EstudianteSeccion',
  as: 'estudiantes',
  foreignKey: 'seccion_id',
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

Personal.hasOne(Seccion, {
  as: 'secciones',
  foreignKey: 'personal_id',
});

Seccion.belongsTo(Personal, {
  foreignKey: 'personal_id',
});

module.exports = {
  Estudiante,
  Representante,
  Autorizado,
  Personal,
  Seccion,
};
