

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


  export function parseAutorizadoData(fetchedAutorizado, tiposCedula = [], prefijosTelf = []) {

    const cedCompleta = fetchedAutorizado.ced || "";
    let tipoCedulaDefault = tiposCedula.length > 0 ? tiposCedula[0] : { name: "" };
    let cedDefault = "";
    
    tiposCedula.forEach(tipo => {
      if (cedCompleta.startsWith(tipo.name)) {
        tipoCedulaDefault = tipo;
        cedDefault = cedCompleta.substring(tipo.name.length);
      }
    });
    
    // PARSEO DE TELÉFONO:
    // Obtenemos el teléfono completo y separamos en prefijo y número.
    const telfCompleta = fetchedAutorizado.telf || "";
    let phonePrefixDefault = prefijosTelf.length > 0 ? prefijosTelf[0] : { name: "" };
    let telfDefault = "";
    
    prefijosTelf.forEach(prefix => {
      if (telfCompleta.startsWith(prefix.name)) {
        phonePrefixDefault = prefix;
        telfDefault = telfCompleta.substring(prefix.name.length);
      }
    });
    
    return {
      nombre: fetchedAutorizado.nombre || "",
      apellido: fetchedAutorizado.apellido || "",
      parentesco: fetchedAutorizado.parentesco || "",
      // Para la cédula separamos el número del prefijo.
      ced: cedDefault,
      tipoCedula: tipoCedulaDefault,
      direccion: fetchedAutorizado.direccion || "",
      observacion: fetchedAutorizado.observacion || "",
      // Para el teléfono separa el número del prefijo.
      telf: telfDefault,
      prefijosTelf: phonePrefixDefault,
    };
  }
  
  