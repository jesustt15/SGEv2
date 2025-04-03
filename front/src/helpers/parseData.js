
export function parseEstudianteData(fetchedEstudiante, tiposCedula = [], sexos = []) {
    // Extraer la cédula completa y separar el tipo y el número.
    const cedulaCompleta = fetchedEstudiante.cedulaEscolar || "";
    let tipoCedulaDefault = tiposCedula.length > 0 ? tiposCedula[0] : { name: "" };
    let cedulaEscolarDefault = "";
  
    // Recorremos los tipos para encontrar el que coincide con el inicio de la cédula.
    tiposCedula.forEach(tipo => {
      if (cedulaCompleta.startsWith(tipo.name)) {
        tipoCedulaDefault = tipo;
        cedulaEscolarDefault = cedulaCompleta.substring(tipo.name.length);
      }
    });
  
    // Manejo de la condición especial: se supone que si existe un valor, la opción es "Si".
    const condicionOptionDefault = fetchedEstudiante.condicion ? "Si" : "No";
  
    // Buscar el objeto de sexo que coincide con el valor del estudiante.
    const sexoDefault = sexos.find(option => option.name === fetchedEstudiante.sexo) || "";
  
    return {
      nombres: fetchedEstudiante.nombres || "",
      apellidos: fetchedEstudiante.apellidos || "",
      fechaNacimiento: fetchedEstudiante.fechaNacimiento
        ? new Date(fetchedEstudiante.fechaNacimiento)
        : null,
      edad: fetchedEstudiante.edad || "",
      sexo: sexoDefault,
      lugarNacimiento: fetchedEstudiante.lugarNacimiento || "",
      // Para la cédula, se separa en el tipo (prefijo) y el número.
      cedulaEscolar: cedulaEscolarDefault,
      tipoCedula: tipoCedulaDefault,
      // Campos de condición especial.
      condicion: fetchedEstudiante.condicion || "",
      condicionOption: condicionOptionDefault,
    };
  }
  