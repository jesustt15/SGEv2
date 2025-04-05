

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
      observaciones: fetchedAutorizado.observaciones || "",
      // Para el teléfono separa el número del prefijo.
      telf: telfDefault,
      prefijosTelf: phonePrefixDefault,
    };
  }


  export function parseRepresentanteData(
    fetchedRepresentante,
    tiposCedula = [],
    prefijosTelf = [],
    prefijosTrabajo = [],
    tipoEdoCivil = []
  ) {
    const cedCompleta = fetchedRepresentante.ced || "";
    let tipoCedulaDefault = tiposCedula.length > 0 ? tiposCedula[0] : { name: "" };
    let cedDefault = "";
    
    tiposCedula.forEach(tipo => {
      if (cedCompleta.startsWith(tipo.name)) {
        tipoCedulaDefault = tipo;
        cedDefault = cedCompleta.substring(tipo.name.length);
      }
    });
  
    const telfCompleta = fetchedRepresentante.telf || "";
    let phonePrefixDefault = prefijosTelf.length > 0 ? prefijosTelf[0] : { name: "" };
    let telfDefault = "";
    
    prefijosTelf.forEach(prefix => {
      if (telfCompleta.startsWith(prefix.name)) {
        phonePrefixDefault = prefix;
        telfDefault = telfCompleta.substring(prefix.name.length);
      }
    });
  
    const telfCompletoTrabajo = fetchedRepresentante.telf_trabajo || "";
    let phonePrefixDefaultTrabajo = prefijosTrabajo.length > 0 ? prefijosTrabajo[0] : { name: "" };
    let telfTrabajoDefault = "";

    prefijosTrabajo.forEach(prefix => {
      if (telfCompletoTrabajo.startsWith(prefix.name)) {
        phonePrefixDefaultTrabajo = prefix;
        telfTrabajoDefault = telfCompletoTrabajo.substring(prefix.name.length);
      }
    });

  
    const trabajaOptionDefault = fetchedRepresentante.dire_trabajo ? "Si" : "No";
    const edo_civilDefault = tipoEdoCivil.find(option => option.name === fetchedRepresentante.edo_civil) || "";
    
    return {
      nombre: fetchedRepresentante.nombre || "",
      apellido: fetchedRepresentante.apellido || "",
      ced: cedDefault,
      tipoCedula: tipoCedulaDefault,
      direccion: fetchedRepresentante.direccion || "",
      telf: telfDefault,
      correoElectronico: fetchedRepresentante.correoElectronico || "",
      prefijosTelf: phonePrefixDefault,
      telf_trabajo: telfTrabajoDefault,
      prefijosTrabajo: phonePrefixDefaultTrabajo,
      trabajaOption: trabajaOptionDefault,
      dire_trabajo: fetchedRepresentante.dire_trabajo || "",
      edo_civil: edo_civilDefault,
      edad: fetchedRepresentante.edad || ""
    };
  }
  
  
  