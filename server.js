var express = require("express");
var app = express();
var bodyparser = require('body-parser');
var oracledb = require('oracledb');
const cors = require('cors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const formidable = require('formidable');
const sgMail = require('@sendgrid/mail')



const API_KEY=''

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
console.log(process.env.SENDGRID_API_KEY)
sgMail.setApiKey(API_KEY)


app.use(cors({
  origin: 'http://localhost:8100'
}));


app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
  extended: true
}));
/*CONEXIÓN DE LA BASE DE DATOS*/
var connAttrs = {
  "user": "PORTAFOLIO",
  "password": "PORTAFOLIO",
  "connectString": "(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = localhost)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))",
  events: true
}

app.get('/', (req, res) => {
  res.send([{ message: 'wena los cabros' }]);
});

/*---------FUNCION PARA OBTENER LOS GENEROS-------*/
app.get('/genero', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM GENERO", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LAS MATRIULAS SEGUN EL RUT-------*/
app.get('/obtenerMatriculaRut/:rut', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }

    connection.execute("SELECT * FROM MATRICULA WHERE RUT_ALUMNO = :RUT", { RUT: req.params.rut }, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the MATRICULA data",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));
      }

      // Release the connection
      connection.release(function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connection released");
        }
      });
    });
  });
});

/*---------FUNCION PARA OBTENER LOS NIVELES-------*/
app.get('/nivel', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM NIVEL", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA ACTUALIZAR LOS CUPOS-------*/

// Función para ejecutar la actualización
async function actualizarCupos(id_curso) {
  let connection;

  try {
    // Obtener una conexión a la base de datos
    connection = await oracledb.getConnection(connAttrs);
    console.log('hola cupos')
    // Query de actualización
    const sql = `UPDATE cupos SET cantidad = cantidad - 1 WHERE id_curso = :ID_CURSO`;

    // Valores a actualizar
    const bindParams = {
      ID_CURSO: id_curso
    };

    // Ejecutar la actualización
    const result = await connection.execute(sql, bindParams, { autoCommit: true });

    console.log(`Se actualizó el cupo del curso con ID ${id_curso}.`);
  } catch (err) {
    console.error('Error al actualizar los cupos:', err);
  } finally {
    // Liberar la conexión
    if (connection) {
      try {
        await connection.close();
        console.log('Conexión liberada.');
      } catch (err) {
        console.error('Error al liberar la conexión:', err);
      }
    }
  }
}


/*---------------PARTE 2 ACTUALIZAR CUPOS--------------*/
app.post('/actualizarCupos/:id_curso', async (req, res) => {
  const id_curso = req.params.id_curso;

  // Llamar a la función para ejecutar la actualización
  await actualizarCupos(id_curso);

  console.log('hola cupos credeencial')
  // Enviar una respuesta al cliente
  res.send('Cupos actualizados exitosamente.');
});



/*---------FUNCION PARA OBTENER EL CURSO SEGUN EL RUT DE LA PERSONA-------*/
app.get('/obtenerCursoCupos/:id_colegio', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    var id_colegio = req.params['id_colegio'];
    console.log('hola curso persona') // Obtener el valor del parámetro rut desde la URL
    console.log(id_colegio)
    connection.execute("SELECT * FROM CURSO c JOIN CUPOS cu ON c.id_curso=cu.id_curso WHERE c.id_colegio=:ID_COLEGIO;", { ID_COLEGIO: id_colegio }, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the courses",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));
      }
      // Release the connection
      connection.release(function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connection released");
        }
      });
    });
  });
});


/*---------FUNCION PARA OBTENER EL CURSO SEGUN EL RUT DE LA PERSONA-------*/
app.get('/obtenerCursoPersona/:rut', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    var rut = req.params['rut'];
    console.log('hola curso persona') // Obtener el valor del parámetro rut desde la URL
    console.log(rut)
    connection.execute("SELECT * FROM CURSO c LEFT JOIN MATRICULA p ON c.ID_CURSO = p.ID_CURSO WHERE RUT_ALUMNO = :RUT", { RUT: rut }, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the courses",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));
      }
      // Release the connection
      connection.release(function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connection released");
        }
      });
    });
  });
});



/*---------FUNCION PARA ELIMINAR LAS MATRICULAS-------*/
app.delete('/eliminarMatriculaRutAlumno/:rut', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    var rut = req.params.rut; // Obtener el valor del parámetro rut
    connection.execute("DELETE FROM MATRICULA WHERE RUT_ALUMNO = :RUT", { RUT: rut }, {
      autoCommit: true

    
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error deleting matricula",
          detailed_message: err.message
        }));
      } else {
        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify({
          status: 200,
          message: "Matricula deleted successfully"
        }));
      }
      // Release the connection
      connection.release(function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Connection released");
        }
      });
    });
  });
});




/*---------FUNCION PARA OBTENER LOS CURSOS COMPLETOS-------*/
app.get('/cursoCompleto', function (req, res) {
  "use strict";
try {
  
  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("select c.ID_CURSO as ID_CURSO,c.descripcion || ' ' || n.LETRA_NIVEL as curso_completo from curso c, nivel n where c.id_nivel = n.id_nivel;", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
} catch (error) {
  console.log(error)
}
});

/*---------FUNCION PARA OBTENER LAS COMUNAS-------*/
app.get('/comuna', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM COMUNA", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LOS TIPOS DE PERSONAS-------*/
app.get('/tipoPersona', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM TIPO_PERSONA", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LAS PATOLOGIAS-------*/
app.get('/patologia', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM PATOLOGIA", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LOS CARGOS-------*/
app.get('/cargo', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM CARGO", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LAS PROFESIONES-------*/
app.get('/profesion', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM PROFESION", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA OBTENER LOS PERFILES-------*/
app.get('/perfil', function (req, res) {
  "use strict";

  oracledb.getConnection(connAttrs, function (err, connection) {
    if (err) {
      // Error connecting to DB
      res.set('Content-Type', 'application/json');
      res.status(500).send(JSON.stringify({
        status: 500,
        message: "Error connecting to DB",
        detailed_message: err.message
      }));
      return;
    }
    connection.execute("SELECT * FROM PERFIL", {}, {
      outFormat: oracledb.OBJECT // Return the result as Object
    }, function (err, result) {
      if (err) {
        res.set('Content-Type', 'application/json');
        res.status(500).send(JSON.stringify({
          status: 500,
          message: "Error getting the dba_tablespaces",
          detailed_message: err.message
        }));
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.contentType('application/json').status(200);
        res.send(JSON.stringify(result.rows));

      }
      // Release the connection
      connection.release(
        function (err) {
          if (err) {
            console.error(err.message);
          } else {
            //console.log("GET /sendTablespace : Connection released");
          }
        });
    });
  });
});

/*---------FUNCION PARA AGREGAR LAS CREDENCIALES-------*/
async function addCredencial(credencial) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    const result = await connection.execute(
      `BEGIN 
        CREDENCIALCRUDPKG.AGREGAR_CREDENCIAL(
             :RUT,
             :NOM_USUARIO,
             :CONTRASENIA
           );
         END;`,
      {
        RUT: credencial.RUT,
        NOM_USUARIO: credencial.NOM_USUARIO,
        CONTRASENIA: credencial.CONTRASENIA
        
      },
      { autoCommit: true }
    );
    console.log(result);
    return result.outBinds;
  } catch (err) {
    //console.log('no funciono credencial')
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA AGREGAR LAS CREDENCIALES PARTE 2-------*/
app.post('/credencialesAdd', async (req, res) => {
  //console.log('agregando credencial')
  const credencial = req.body;
  //console.log(credencial);

  const result = await addCredencial(credencial);
  //console.log(result);

  res.status(201).json(result);
});
/*---------FUNCION PARA AGREGAR Los Cursos-------*/
async function addCurso(curso) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    const result = await connection.execute(
      `BEGIN 
        CURSOCRUDPKG.AGREGAR_CURSO(
             :ID_COLEGIO,
             :ID_NIVEL,
             :CUPO,
             :DESCRIPCION
           );
         END;`,         
      {        
        ID_COLEGIO:  curso.ID_COLEGIO,
        ID_NIVEL: curso.ID_NIVEL,
        CUPO: curso.CUPO,
        DESCRIPCION: curso.DESCRIPCION
      },
      { autoCommit: true }
    );

    console.log('resultado: ',result)

    return result.outBinds;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA AGREGAR LOS CURSOS PARTE 2-------*/
app.post('/cursosAdd', async (req, res) => {  
  const curso = req.body;
  const result = await addCurso(curso);  
  res.status(201).json(result);
});

/*---------FUNCION PARA AGREGAR LOS COLEGIOS-------*/
async function addColegio(colegio) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    const result = await connection.execute(
      `BEGIN 
        COLEGIOCRUDPKG.AGREGAR_COLEGIO(
          :NOM_COLEGIO, 
          :TELEFONO, 
          :DIRECCION, 
          :CORREO, 
          :ID_COMUNA 
           );
         END;`,
      {
        NOM_COLEGIO: colegio.NOM_COLEGIO, 
        TELEFONO: colegio.TELEFONO, 
        DIRECCION: colegio.DIRECCION, 
        CORREO: colegio.CORREO, 
        ID_COMUNA: colegio.ID_COMUNA
      },
      { autoCommit: true }
    );

    //console.log(result);
    //console.log('funciono');

    return result.outBinds;
  } catch (err) {
    //console.log('no funciono')
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA AGREGAR LOS COLEGIOS PARTE 2-------*/
app.post('/colegiosAdd', async (req, res) => {
  //console.log('agregando persona')
  const colegio = req.body;
  //console.log(persona);

  const result = await addColegio(colegio);
  //console.log(result);

  res.status(201).json(result);
});
/*---------FUNCION PARA AGREGAR LAS PERSONAS-------*/
async function addPersona(persona) {
  let connection;

  const fecha = moment(persona.FECHA_NAC, 'DD/MM/YYYY').format('DD/MM/YYYY');

  try {
    connection = await oracledb.getConnection(connAttrs);
    console.log(persona)
    
    //const fileContent = fs.readFileSync(path.join(__dirname, archivo.path));

    const result = await connection.execute(
      `BEGIN 
           PERSONACRUDPKG.AGREGAR_PERSONA(
             :RUT,
             :P_NOMBRE,
             :S_NOMBRE,
             :AP_PATERNO,
             :AP_MATERNO,
             TO_DATE(:FECHA_NAC, 'DD/MM/YYYY'),
             :TELEFONO,
             :DIRECCION,
             :CORREO,
             :SUELDO,
             :ID_PERFIL,
             :ID_GENERO,
             :ID_COMUNA,
             :ID_TIPO_PERSONA,
             :ID_PATOLOGIA,
             :ID_PROFESION,
             :ID_CARGO,
             :RUT_APO,
             
             :COLEGIO_ACTUAL
           );
         END;`,
      {
        RUT: persona.RUT,
        P_NOMBRE: persona.P_NOMBRE,
        S_NOMBRE: persona.S_NOMBRE,
        AP_PATERNO: persona.AP_PATERNO,
        AP_MATERNO: persona.AP_MATERNO,
        FECHA_NAC: fecha,
        TELEFONO: persona.TELEFONO,
        DIRECCION: persona.DIRECCION,
        CORREO: persona.CORREO,
        SUELDO: persona.SUELDO,
        ID_PERFIL: persona.ID_PERFIL,
        ID_GENERO: persona.ID_GENERO,
        ID_COMUNA: persona.ID_COMUNA,
        ID_TIPO_PERSONA: persona.ID_TIPO_PERSONA,
        ID_PATOLOGIA: persona.ID_PATOLOGIA,
        ID_PROFESION: persona.ID_PROFESION,
        ID_CARGO: persona.ID_CARGO,
        RUT_APO: persona.RUT_APO,
        
        COLEGIO_ACTUAL: persona.COLEGIO_ACTUAL
      },
      { autoCommit: true }
    );

    //console.log(result);
    //console.log('funciono');

    return result.outBinds;
  } catch (err) {
    //console.log('no funciono')
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA AGREGAR LAS PERSONAS PARTE 2-------*/
app.post('/personasAdd', /*upload.single('archivo'),*/ async (req, res) => {
  try {
    const persona = req.body;
    console.log('hola1')
    console.log(persona);
    console.log('hola2')
    //const archivo = req.file;

    const result = await addPersona(persona);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar persona' });
  }
});


/*---------FUNCION PARA AGREGAR LAS MATRICULAS-------*/
async function addMatricula(matricula) {
  let connection;
  console.log("copo1")

  try {
    const connection = await oracledb.getConnection(connAttrs);
    console.log('cupo2')
    console.log(matricula)
    
    //const fileContent = fs.readFileSync(path.join(__dirname, archivo.path));

    const result = await connection.execute(
      `BEGIN 
        MATRICULACRUDPKG.AGREGAR_MATRICULA(
          :RUT_APODERADO,
          :RUT_ALUMNO,
          :ID_COLEGIO, 
          :ID_CURSO, 
          :CONTACTO_EMERGENCIA
           );
         END;`,
      {
        RUT_APODERADO: matricula.RUT_APODERADO,
        RUT_ALUMNO: matricula.RUT_ALUMNO,
        ID_COLEGIO: matricula.ID_COLEGIO, 
        ID_CURSO: matricula.ID_CURSO, 
        CONTACTO_EMERGENCIA: matricula.CONTACTO_EMERGENCIA
      },
      { autoCommit: true }
    );
    console.log("cupo3");
    console.log( matricula.ID_CURSO);
    console.log(result);
    connection.close();
    const connection2 = await oracledb.getConnection(connAttrs);
  
    const ID_CURSO = parseInt(matricula.ID_CURSO);

    const updateQuery = `
    UPDATE cupos
    SET cantidad = CANTIDAD + 1
    WHERE id_curso= :ID_CURSO
    `;
    console.log("cupo4");
  const resultAddCupo  = await connection2.execute(updateQuery, {ID_CURSO }, { autoCommit: true });

    connection2.close();
    console.log('resultadocupo')
    console.log(resultAddCupo)
    //console.log(result);
    //console.log('funciono');

    return result.outBinds;
  } catch (err) {
    //console.log('no funciono')
    console.error(err);
  } finally {
    console.log("la existencia es rara");
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA AGREGAR LAS MATRICULAS PARTE 2-------*/
app.post('/matriculasAdd', /*upload.single('archivo'),*/ async (req, res) => {
  try {
    const matricula = req.body;
    console.log('hola1')
    console.log(matricula);
    console.log('hola2')
    //const archivo = req.file;

    const result = await addMatricula(matricula);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar persona' });
  }
});


const port = process.env.PORT || 4201;
app.listen(port, () => console.log(`Server running on port ${port}`));

/*---------LISTAR COLEGIO-------*/
async function listarColegio() {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
        COLEGIOCRUDPKG.LISTAR_COLEGIO(
             :RC1
           );
         END;`,
      { RC1: RCT1 }
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RC1;
    const resultados = [];

    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }

    // Liberar el cursor
    await resultSet.close();

    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------PARTE 2 DEL LISTAR COLEGIO SI FUNCIONA-------*/
app.get('/colegiosList', async (req, res) => {
  try {
    //console.log('funciona listar')
    const resultados = await listarColegio();
    //console.log(resultados)
    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al recuperar la lista de colegios');
  }
});


/*---------LISTAR MATRICULA-------*/
async function listarMatricula() {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
      MATRICULACRUDPKG.LISTAR_MATRICULA(
             :RC1
           );
         END;`,
      { RC1: RCT1 }
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RC1;
    const resultados = [];

    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }

    // Liberar el cursor
    await resultSet.close();

    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------PARTE 2 DEL LISTAR MATRICULA SI FUNCIONA-------*/
app.get('/matriculasList', async (req, res) => {
  try {
    //console.log('funciona listar')
    const resultados = await listarMatricula();
    //console.log(resultados)
    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al recuperar la lista de colegios');
  }
});

/*---------LISTAR COLEGIO-------*/
async function listarCursoCompleto() {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
        CURSOCRUDPKG.OBTENER_CURSOCOMPLETO(
             :RC1
           );
         END;`,
      { RC1: RCT1 }
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RC1;
    const resultados = [];

    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }

    // Liberar el cursor
    await resultSet.close();

    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------PARTE 2 DEL LISTAR COLEGIO SI FUNCIONA-------*/
app.get('/cursoCompletoList', async (req, res) => {
  try {
    //console.log('funciona listar')
    const resultados = await listarCursoCompleto();
    //console.log(resultados)
    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al recuperar la lista de colegios');
  }
});


async function listarPersonas() {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);

    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
           PERSONACRUDPKG.LISTAR_PERSONA(
             :RC1
           );
         END;`,
      { RC1: RCT1 }
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RC1;
    const resultados = [];

    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }

    // Liberar el cursor
    await resultSet.close();

    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------PARTE 2 DEL LISTAR PERSONA SI FUNCIONA-------*/
app.get('/personasList', async (req, res) => {
  try {
    //console.log('funciona listar')
    const resultados = await listarPersonas();
    //console.log(resultados)
    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al recuperar la lista de personas');
  }
});

/*---------LISTAR CREDENCIAL-------*/
async function listarCredenciales() {
  let connection;
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };
    
    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
      CREDENCIALCRUDPKG.LISTAR_CREDENCIAL(
        :RC1
        );
        END;`,
        { RC1: RCT1 }
        );
        
        // Leer los resultados del cursor y agregarlos a una matriz
        const resultSet = result.outBinds.RC1;
        const resultados = [];
        
        let row;
        while ((row = await resultSet.getRow())) {
          resultados.push(row);
        }
        
        // Liberar el cursor
        await resultSet.close();
        
        return resultados;
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          await connection.close();
        }
      }
    }
/*---------PARTE 2 DEL LISTAR CREDENCIAL SI FUNCIONA-------*/
    app.get('/credencialList', async (req, res) => {
      try {
        //console.log('funciona listar cred')
        const resultados = await listarCredenciales();
        //console.log(resultados)
        res.status(200).json(resultados);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al recuperar la lista de credenciales');
      }
    });

/*---------LISTAR CURSO-------*/
async function listarCursos() {
  let connection;
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };
    
    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
      CURSOCRUDPKG.LISTAR_CURSO(
        :RC1
        );
        END;`,
        { RC1: RCT1 }
        );
        
        // Leer los resultados del cursor y agregarlos a una matriz
        const resultSet = result.outBinds.RC1;
        const resultados = [];
        
        let row;
        while ((row = await resultSet.getRow())) {
          resultados.push(row);
        }
        
        // Liberar el cursor
        await resultSet.close();
        
        return resultados;
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          await connection.close();
        }
      }
    }
/*---------PARTE 2 DEL LISTAR CURSO  SI FUNCIONA-------*/
    app.get('/cursoList', async (req, res) => {
      try {
        //console.log('funciona listar cred')
        const resultados = await listarCursos();
        //console.log(resultados)
        res.status(200).json(resultados);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al recuperar la lista de los cursos');
      }
    });


    
    /*---------FUNCION PARA ELIMINAR PERSONAS-------*/
async function eliminarPersona(RUT) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    const result = await connection.execute(
      `BEGIN PERSONACRUDPKG.ELIMINAR_PERSONA(:RUT); END;`,
      { RUT: RUT },
      { autoCommit: true }
    );
    //console.log(result)
    //console.log(RUT);
    return result.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

    /*---------ELIMINAR PERSONA PARTE 2-------*/
app.delete('/personasEliminar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    console.log(`Eliminando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await eliminarPersona(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros eliminados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar a la persona');
  }
});
    /*---------FUNCION PARA ELIMINAR PERSONAS-MATRICULA-------*/
async function eliminarPersonaMatricula(RUT) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    console.log(RUT)
    const otraConsultaTres = `SELECT * FROM MATRICULA WHERE RUT_ALUMNO=:RUT`;
    console.log(otraConsultaTres)
    const otraConsultaTresResult = await connection.execute(otraConsultaTres, { RUT: RUT },{outFormat: oracledb.OBJECT } )
    console.log(otraConsultaTresResult.rows);
    if (otraConsultaTresResult.rows.length > 0) {
      
      const otraConsultaCuatro = `UPDATE cupos
                                  SET cantidad = CANTIDAD - 1
                                  WHERE id_curso= :ID_CURSO`;
      console.log(otraConsultaCuatro)
      const otraConsultaCuatroResult = await connection.execute(otraConsultaCuatro, { ID_CURSO: otraConsultaTresResult.rows[0].ID_CURSO },{autoCommit: true ,outFormat: oracledb.OBJECT } )
    }
    
    

    const otraConsultaDos = `DELETE MATRICULA WHERE RUT_ALUMNO= :RUT`;
    const otraConsultaDosResult = await connection.execute(otraConsultaDos, { RUT: RUT },
      { autoCommit: true });
  

    const result = await connection.execute(
      `BEGIN PERSONACRUDPKG.ELIMINAR_PERSONA(:RUT); END;`,
      { RUT: RUT },
      { autoCommit: true }
    );
    //console.log(result)
    //console.log(RUT);
    return otraConsultaTresResult.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

    /*---------ELIMINAR PERSONA PARTE 2-------*/
app.delete('/personasMatriculasEliminar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    console.log(`Eliminando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await eliminarPersonaMatricula(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros eliminados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar a la persona');
  }
});

    
    /*---------FUNCION PARA ELIMINAR PERSONAS-------*/
async function eliminarMatricula(ID_MATRICULA) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    
    const resultMatricula = await connection.execute(
      `SELECT * FROM MATRICULA WHERE ID_MATRICULA= :ID_MATRICULA`,
      { ID_MATRICULA: ID_MATRICULA },
      {outFormat: oracledb.OBJECT }
    );

    console.log(resultMatricula)
    

    const ID_CURSO = parseInt(resultMatricula.rows[0].ID_CURSO);

    
    const result = await connection.execute(
      `BEGIN MATRICULACRUDPKG.ELIMINAR_MATRICULA(:ID_MATRICULA); END;`,
      { ID_MATRICULA: ID_MATRICULA },
      { autoCommit: true }
    );



    const connection2 = await oracledb.getConnection(connAttrs);
  
    const updateQuery = `
    UPDATE cupos
    SET cantidad = CANTIDAD - 1
    WHERE id_curso= :ID_CURSO
    `;
    console.log("cupo4");
  const resultAddCupo  = await connection2.execute(updateQuery, {ID_CURSO }, { autoCommit: true });

    connection2.close();
    //console.log(result)
    //console.log(RUT);
    return result.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

    /*---------ELIMINAR PERSONA PARTE 2-------*/
app.delete('/matriculasEliminar/:ID_MATRICULA', async (req, res) => {
  try {
    const ID_MATRICULA = req.params.ID_MATRICULA;
    //console.log(`Eliminando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await eliminarMatricula(ID_MATRICULA);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros eliminados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar a la mátricula');
  }
});

/*---------FUNCION PARA ELIMINAR CREDENCIALES-------*/

async function eliminarCred(RUT) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    const result = await connection.execute(
      `BEGIN CREDENCIALCRUDPKG.ELIMINAR_CREDENCIAL(:RUT); END;`,
      { RUT: RUT },
      { autoCommit: true }
    );
    //console.log(result)
    //console.log(RUT);
    return result.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*-----------------Eliminar credencial parte 2-----------------------*/
app.delete('/credencialesEliminar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    //console.log(`Eliminando credencial con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await eliminarCred(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros eliminados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar a la persona');
  }
});
/*---------FUNCION PARA ELIMINAR CREDENCIALES-------*/

async function eliminarCol(ID_COLEGIO) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    const otraConsultaDos = `DELETE MATRICULA WHERE ID_COLEGIO= :ID_COLEGIO`;
    const otraConsultaDosResult = await connection.execute(otraConsultaDos, { ID_COLEGIO: ID_COLEGIO });
    const otraConsulta = `DELETE CURSO WHERE ID_COLEGIO= :ID_COLEGIO`;
    const otraConsultaResult = await connection.execute(otraConsulta, { ID_COLEGIO: ID_COLEGIO });

    const result = await connection.execute(
      `BEGIN COLEGIOCRUDPKG.ELIMINAR_COLEGIO(:ID_COLEGIO); END;`,
      { ID_COLEGIO: ID_COLEGIO },
      { autoCommit: true }
    );


    console.log(otraConsultaResult);
    //console.log(result)
    //console.log(RUT);
    return result.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
/*---------FUNCION PARA ELIMINAR CREDENCIALES-------*/

async function eliminarCol2(ID_COLEGIO) {
  let connection;
  connection = await oracledb.getConnection(connAttrs);
  console.log('ID_COLEGIO: '+ ID_COLEGIO)

  const consulta_select=`SELECT * FROM CURSO WHERE ID_COLEGIO=:ID_COLEGIO`;
  const consulta_delete_cupos=`DELETE CUPOS WHERE ID_CURSO=:ID_CURSO`
  const consulta_delete_matricula=`DELETE MATRICULA WHERE ID_COLEGIO=:ID_COLEGIO`
  const consulta_delete_curso=`DELETE CURSO WHERE ID_COLEGIO=:ID_COLEGIO`
  const consulta_persona=`SELECT * FROM PERSONA WHERE COLEGIO_ACTUAL=:ID_COLEGIO`;
  const consulta_delete_credencial=`DELETE CREDENCIAL WHERE RUT=:RUT`
  const consulta_delete_persona=`DELETE PERSONA WHERE COLEGIO_ACTUAL=:ID_COLEGIO`
  const consulta_delete_colegio=`DELETE COLEGIO WHERE ID_COLEGIO=:ID_COLEGIO`

  let result = await connection.execute(consulta_select, { ID_COLEGIO: ID_COLEGIO },{outFormat: oracledb.OBJEC})
  for (i=0;i<result.rows.length; i++){
    let result_cupos = await connection.execute(consulta_delete_cupos, { ID_CURSO: result.rows[i][0] },{autoCommit:true,outFormat: oracledb.OBJEC});
  }
  let result_matriculas = await connection.execute(consulta_delete_matricula, { ID_COLEGIO: ID_COLEGIO },{autoCommit:true,outFormat: oracledb.OBJEC});
  let result_cursos = await connection.execute(consulta_delete_curso, { ID_COLEGIO: ID_COLEGIO },{autoCommit:true,outFormat: oracledb.OBJEC});
  let result_persona_dos= await connection.execute(consulta_persona, { ID_COLEGIO: ID_COLEGIO },{outFormat: oracledb.OBJEC})
  for (i=0;i<result_persona_dos.rows.length; i++){
    let result_cupos = await connection.execute(consulta_delete_credencial, { RUT: result_persona_dos.rows[i][0] },{autoCommit:true,outFormat: oracledb.OBJEC});
  }
  let result_persona = await connection.execute(consulta_delete_persona, { ID_COLEGIO: ID_COLEGIO },{autoCommit:true,outFormat: oracledb.OBJEC});
  let result_colegio = await connection.execute(consulta_delete_colegio, { ID_COLEGIO: ID_COLEGIO },{autoCommit:true,outFormat: oracledb.OBJEC});

  console.log(result_colegio);

  console.log('hola eliminarcolegios')
}

/*-----------------Eliminar credencial parte 2-----------------------*/
app.delete('/colegiosEliminar/:ID_COLEGIO', async (req, res) => {
  try {
    console.log('Hola colegios eliminar')
    const ID_COLEGIO = req.params.ID_COLEGIO;
    //console.log(`Eliminando credencial con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await eliminarCol2(ID_COLEGIO);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros eliminados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar a la persona');
  }
});


/*---------FUNCION PARA ELIMINAR CURSO-------*/
async function eliminarCur(ID_CURSO) {
  let connection;

  try {
    connection = await oracledb.getConnection(connAttrs);
    console.log(ID_CURSO,'eliminar curso se empezo a ejecutar');
    const resultCursoCupos = await connection.execute(
      `
      DELETE CUPOS WHERE ID_CURSO= :ID_CURSO
    `,         
      {        
        ID_CURSO: ID_CURSO
      },
      { autoCommit: true }
    );
    const resultCursoMatricula = await connection.execute(
      `
      DELETE MATRICULA WHERE ID_CURSO= :ID_CURSO
    `,         
      {        
        ID_CURSO: ID_CURSO
      },
      { autoCommit: true }
    );
    
    console.log(ID_CURSO,'eliminar curso se sigue ejecutando');
    const result = await connection.execute(
      `BEGIN CURSOCRUDPKG.ELIMINAR_CURSO(:ID_CURSO); END;`,
      { ID_CURSO: ID_CURSO },
      { autoCommit: true }
    );

    console.log(ID_CURSO,'eliminar curso se ejecuto');
    return result.rowsAffected;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*-----------------Eliminar curso parte 2-----------------------*/
app.delete('/cursosEliminar/:id_curso', async (req, res) => {
  try {
    const id_curso = req.params.id_curso;
    const rowsAffected = await eliminarCur(id_curso);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar al curso');
  }
});

/*---------FUNCION PARA BUSCAR PERSONAS-------*/
async function BuscarPersonas2(rut) {
  let connection;
  //console.log(rut)
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      RUT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: rut },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };
    //console.log('hola', params)
     // Definir el cursor
     const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
           PERSONACRUDPKG.BUSCAR_PERSONA(
             :RUT,
             :RCT1
           );
         END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }
    
    

    // Liberar el cursor
    await resultSet.close();
    console.log(resultados)
    return resultados;
  } catch (err) {
    console.log(err)
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR PERSONAS PARTE 2 SI FUNCIONA-------*/
app.get('/personasBuscar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    //console.log(`buscando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await BuscarPersonas2(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros encontrados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar a la persona');
  }
});

/*---------FUNCION PARA BUSCAR PERSONAS-------*/
async function BuscarRutAlumno(rut) {
  let connection;
  //console.log(rut)
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      RUT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: rut },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };
    //console.log('hola', params)
     // Definir el cursor
     const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
        MATRICULACRUDPKG.BUSCAR_RUT_ALUMNO( 
            :RUT,
             :RCT1
           );
         END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }
    
    

    // Liberar el cursor
    await resultSet.close();
    console.log(resultados)
    return resultados;
  } catch (err) {
    console.log(err)
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR PERSONAS PARTE 2 SI FUNCIONA-------*/
app.get('/rutAlumnoBuscar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    //console.log(`buscando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await BuscarRutAlumno(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros encontrados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar a la persona');
  }
});

/*---------FUNCION PARA BUSCAR CREDENCIALES-------*/
async function BuscarCredenciales(rut) {
  let connection;
  //console.log(rut)
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      RUT: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: rut },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };
    //console.log('hola', params)
     // Definir el cursor
     const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
           CREDENCIALCRUDPKG.BUSCAR_CREDENCIAL(
             :RUT,
             :RCT1
           );
         END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }
    
    

    // Liberar el cursor
    await resultSet.close();

    console.log(resultados);
    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR CREDENCIALES PARTE 2 SI FUNCIONA-------*/
app.get('/credencialesBuscar/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    //console.log(`buscando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await BuscarCredenciales(rut);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros encontrados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar a la persona');
  }
});

/*---------FUNCION PARA BUSCAR MATRICULAS-------*/
async function BuscarMatricula(ID_MATRICULA) {
  let connection;
  //console.log(rut)
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      ID_MATRICULA: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: ID_MATRICULA },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };
    //console.log('hola', params)
     // Definir el cursor
     const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
          MATRICULACRUDPKG.BUSCAR_MATRICULA(
             :ID_MATRICULA,
             :RCT1
           );
         END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }
    
    

    // Liberar el cursor
    await resultSet.close();

    console.log(resultados);
    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR MATRICULAS PARTE 2 SI FUNCIONA-------*/
app.get('/matriculasBuscar/:ID_MATRICULA', async (req, res) => {
  try {
    const ID_MATRICULA = req.params.ID_MATRICULA;
    //console.log(`buscando persona con RUT ${rut}`);
    //console.log('hola1')
    const rowsAffected = await BuscarMatricula(ID_MATRICULA);
    //console.log('hola2')
    //console.log(`${rowsAffected} registros encontrados`);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar a la persona');
  }
});

/*---------FUNCION PARA BUSCAR CURSOS-------*/
async function BuscarCursos(id_curso) {
  let connection;
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      id_curso: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: id_curso },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };
     const RCT1 = {
      dir: oracledb.BIND_INOUT,
      type: oracledb.CURSOR
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
      CURSOCRUDPKG.BUSCAR_CURSO(
             :ID_CURSO,
             :RCT1
           );
         END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }   

    // Liberar el cursor
    await resultSet.close();

    console.log(resultados);
    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR CURSOS PARTE 2 SI FUNCIONA-------*/
app.get('/cursosBuscar/:id_curso', async (req, res) => {
  try {
    const id_curso = req.params.id_curso;
    const rowsAffected = await BuscarCursos(id_curso);
    res.status(200).json(rowsAffected);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar el curso');
  }
});

/*---------FUNCION PARA BUSCAR COLEGIOS-------*/
async function BuscarColegios(id_colegio, nom_colegio) {
  let connection;
  console.log(id_colegio, nom_colegio)
  
  try {
    connection = await oracledb.getConnection(connAttrs);
    
    // Definir el cursor
    let params = {
      ID_COLEGIO: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: id_colegio },
      NOM_COLEGIO: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: nom_colegio.toUpperCase() },
      RCT1: { dir: oracledb.BIND_INOUT, type: oracledb.CURSOR }
    };

    // Llamar al procedimiento del paquete
    const result = await connection.execute(
      `BEGIN 
         COLEGIOCRUDPKG.BUSCAR_COLEGIO(:ID_COLEGIO, :NOM_COLEGIO, :RCT1);
       END;`,
      params
    );

    // Leer los resultados del cursor y agregarlos a una matriz
    const resultSet = result.outBinds.RCT1;
    const resultados = [];
    
    let row;
    while ((row = await resultSet.getRow())) {
      resultados.push(row);
    }   

    // Liberar el cursor
    await resultSet.close();

    console.log(resultados);
    return resultados;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

/*---------BUSCAR COLEGIOS PARTE 2 SI FUNCIONA-------*/
app.get('/colegiosBuscar/:id_colegio/:nom_colegio', async (req, res) => {
  try {
    const id_colegio = req.params.id_colegio;
    const nom_colegio = req.params.nom_colegio;
    const resultados = await BuscarColegios(id_colegio, nom_colegio);
    res.status(200).json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar el colegio');
  }
});



/*---------FUNCION PARA ACTUALIZAR DATOS DE LA PERSONA-------*/
async function updatePersona(persona) {
  let connection;
  //console.log('PERSONAS');
  //console.log(persona);
  const fecha = moment(persona.FECHA_NAC, 'DD/MM/YYYY').format('DD/MM/YYYY');
  console.log(      {
    RUT: persona.RUT,
    P_NOMBRE: persona.P_NOMBRE,
    S_NOMBRE: persona.S_NOMBRE,
    AP_PATERNO: persona.AP_PATERNO,
    AP_MATERNO: persona.AP_MATERNO,
    FECHA_NAC: fecha,
    TELEFONO: persona.TELEFONO,
    DIRECCION: persona.DIRECCION,
    CORREO: persona.CORREO,
    SUELDO: persona.SUELDO == null ? 0 : parseInt(persona.SUELDO),
    ID_PERFIL: persona.ID_PERFIL == null ? null : parseInt(persona.ID_PERFIL),
    ID_GENERO: persona.ID_GENERO == null ? null :parseInt(persona.ID_GENERO),
    ID_COMUNA: persona.ID_COMUNA == null ? null :parseInt(persona.ID_COMUNA),
    ID_TIPO_PERSONA: persona.ID_TIPO_PERSONA == null ? null :parseInt(persona.ID_TIPO_PERSONA),
    ID_PATOLOGIA: persona.ID_PATOLOGIA == null ? null :parseInt(persona.ID_PATOLOGIA),
    ID_PROFESION: persona.ID_PROFESION == null ? null :parseInt(persona.ID_PROFESION),
    ID_CARGO: persona.ID_CARGO == null ? null :parseInt(persona.ID_CARGO),
    RUT_APO: persona.RUT_APO,

    COLEGIO_ACTUAL: persona.COLEGIO_ACTUAL == null ? null :parseInt(persona.COLEGIO_ACTUAL)
  });
  try {
    connection = await oracledb.getConnection(connAttrs); 
    //console.log('otigen');   
    const result = await connection.execute(
      `BEGIN 
           PERSONACRUDPKG.ACTUALIZAR_PERSONA(
             :RUT,
             :P_NOMBRE,
             :S_NOMBRE,
             :AP_PATERNO,
             :AP_MATERNO,
             TO_DATE(:FECHA_NAC, 'DD/MM/YYYY'),
             :TELEFONO,
             :DIRECCION,
             :CORREO,
             :SUELDO,
             :ID_PERFIL,
             :ID_GENERO,
             :ID_COMUNA,
             :ID_TIPO_PERSONA,
             :ID_PATOLOGIA,
             :ID_PROFESION,
             :ID_CARGO,
             :RUT_APO,
             :COLEGIO_ACTUAL
           );
         END;`,
      {
        RUT: persona.RUT,
        P_NOMBRE: persona.P_NOMBRE,
        S_NOMBRE: persona.S_NOMBRE,
        AP_PATERNO: persona.AP_PATERNO,
        AP_MATERNO: persona.AP_MATERNO,
        FECHA_NAC: fecha,
        TELEFONO: persona.TELEFONO,
        DIRECCION: persona.DIRECCION,
        CORREO: persona.CORREO,
        SUELDO: persona.SUELDO == null ? 0 : parseInt(persona.SUELDO),
        ID_PERFIL: persona.ID_PERFIL == null ? null : parseInt(persona.ID_PERFIL),
        ID_GENERO: persona.ID_GENERO == null ? null :parseInt(persona.ID_GENERO),
        ID_COMUNA: persona.ID_COMUNA == null ? null :parseInt(persona.ID_COMUNA),
        ID_TIPO_PERSONA: persona.ID_TIPO_PERSONA == null ? null :parseInt(persona.ID_TIPO_PERSONA),
        ID_PATOLOGIA: persona.ID_PATOLOGIA == null ? null :parseInt(persona.ID_PATOLOGIA),
        ID_PROFESION: persona.ID_PROFESION == null ? null :parseInt(persona.ID_PROFESION),
        ID_CARGO: persona.ID_CARGO == null ? null :parseInt(persona.ID_CARGO),
        RUT_APO: persona.RUT_APO,
        COLEGIO_ACTUAL: persona.COLEGIO_ACTUAL == null ? null :parseInt(persona.COLEGIO_ACTUAL)
        //RUT_APO: persona.RUT_APO
      },
      { autoCommit: true }
    );
    
    //console.log('hola1')
    //console.log('hola2')
    //console.log(result);
    //console.log('funciono');
    return result.outBinds;
  } catch (err) {    
    //console.log('no funciono')
    console.error(err);
  } finally {
    //console.log(678);
    if (connection) {
      try {
        //console.log(78889);
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR PERSONA PARTE 2-------*/
app.post('/actualizarPersona', async (req, res) => {
  try {
    const persona = req.body; // asumiendo que los datos de la persona se encuentran en el cuerpo de la solicitud POST
    const resultado = await updatePersona(persona);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos de la persona');
  }
});


/*---------FUNCION PARA ACTUALIZAR DATOS DE LA MATRICULA-------*/
async function updateMatricula(matricula) {
  let connection;
  //console.log('PERSONAS');
  //console.log(persona);
  try {
    connection = await oracledb.getConnection(connAttrs); 
    console.log('oRigen');   
    const result = await connection.execute(
      `BEGIN 
          MATRICULACRUDPKG.ACTUALIZAR_MATRICULA(
            :ID_MATRICULA,
            :CONTACTO_EMERGENCIA
            );
         END;`,
      {
        ID_MATRICULA: matricula.ID_MATRICULA,
        CONTACTO_EMERGENCIA: matricula.CONTACTO_EMERGENCIA
      },
      { autoCommit: true }
    );
    
    //console.log('hola1')
    //console.log('hola2')
    //console.log(result);
    //console.log('funciono');
    return result.outBinds;
  } catch (err) {    
    //console.log('no funciono')
    console.error(err);
  } finally {
    //console.log(678);
    if (connection) {
      try {
        //console.log(78889);
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR MATRICULA PARTE 2-------*/
app.post('/actualizarMatricula', async (req, res) => {
  try {
    const matricula = req.body; // asumiendo que los datos de la persona se encuentran en el cuerpo de la solicitud POST
    const resultado = await updateMatricula(matricula);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos del colegio');
  }
});

/*---------FUNCION PARA ACTUALIZAR DATOS DEL COLEGIO-------*/
async function updateColegio(colegio) {
  let connection;
  //console.log('PERSONAS');
  //console.log(persona);
  console.log(      {
    ID_COLEGIO: colegio.ID_COLEGIO,
    NOM_COLEGIO: colegio.NOM_COLEGIO,
    TELEFONO: colegio.TELEFONO,
    DIRECCION: colegio.DIRECCION,
    CORREO: colegio.CORREO,
    ID_COMUNA: colegio.ID_COMUNA

  });
  try {
    connection = await oracledb.getConnection(connAttrs); 
    //console.log('otigen');   
    const result = await connection.execute(
      `BEGIN 
          COLEGIOCRUDPKG.ACTUALIZAR_COLEGIO(
            :ID_COLEGIO,
            :NOM_COLEGIO,
            :TELEFONO,
            :DIRECCION,
            :CORREO,
            :ID_COMUNA
            );
         END;`,
      {
        ID_COLEGIO: colegio.ID_COLEGIO,
        NOM_COLEGIO: colegio.NOM_COLEGIO,
        TELEFONO: colegio.TELEFONO,
        DIRECCION: colegio.DIRECCION,
        CORREO: colegio.CORREO,
        ID_COMUNA: colegio.ID_COMUNA
      },
      { autoCommit: true }
    );
    
    //console.log('hola1')
    //console.log('hola2')
    //console.log(result);
    //console.log('funciono');
    return result.outBinds;
  } catch (err) {    
    //console.log('no funciono')
    console.error(err);
  } finally {
    //console.log(678);
    if (connection) {
      try {
        //console.log(78889);
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR COLEGIO PARTE 2-------*/
app.post('/actualizarColegio', async (req, res) => {
  try {
    const colegio = req.body; // asumiendo que los datos de la persona se encuentran en el cuerpo de la solicitud POST
    const resultado = await updateColegio(colegio);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos del colegio');
  }
});

/*---------FUNCION PARA ACTUALIZAR DATOS DE LA CREDENCIAL-------*/
async function updateCredencial(credencial) {
  let connection;
  
  console.log(      {
    RUT: credencial.RUT,
    NOM_USUARIO: credencial.NOM_USUARIO,
    CONTRASENIA: credencial.CONTRASENIA
    
  });
  try {
    console.log(credencial);
    connection = await oracledb.getConnection(connAttrs); 
    //console.log('otigen');   
    const result = await connection.execute(
      `BEGIN 
           CREDENCIALCRUDPKG.ACTUALIZAR_CREDENCIAL(
             :RUT,
             :NOM_USUARIO,
             :CONTRASENIA
           );
         END;`,
      {
        RUT: credencial.RUT,
        NOM_USUARIO: credencial.NOM_USUARIO,
        CONTRASENIA: credencial.CONTRASENIA
      },
      { autoCommit: true }
    );

    console.log('funciono');
    return result.outBinds;
  } catch (err) {    
    //console.log('no funciono')
    console.error(err);
  } finally {
    //console.log(678);
    if (connection) {
      try {
        //console.log(78889);
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR CREDENCIAL PARTE 2-------*/
app.post('/actualizarCredencial', async (req, res) => {
  try {
    const credencial = req.body; // asumiendo que los datos de la persona se encuentran en el cuerpo de la solicitud POST
    const resultado = await updateCredencial(credencial);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos de la credencial');
  }
});
/*---------FUNCION PARA ACTUALIZAR DATOS DEl CURSO-------*/
async function updateCurso(curso) {
  let connection;
  
  console.log(      {
    ID_CURSO: curso.ID_CURSO,
    ID_COLEGIO:  curso.ID_COLEGIO,
    ID_NIVEL: curso.ID_NIVEL,
    DESCRIPCION: curso.DESCRIPCION,
    CUPO: curso.CUPO
  });
  try {
    console.log(curso);
    connection = await oracledb.getConnection(connAttrs); 
    const result = await connection.execute(
      `BEGIN 
        CURSOCRUDPKG.ACTUALIZAR_CURSO(
             :ID_CURSO,
             :ID_COLEGIO,
             :ID_NIVEL,
             :CUPO,
             :DESCRIPCION
           );
         END;`,
      {        
        ID_CURSO: curso.ID_CURSO== null || isNaN(curso.ID_CURSO) ? null : parseInt(curso.ID_CURSO),
        ID_COLEGIO: curso.ID_COLEGIO == null || isNaN(curso.ID_COLEGIO) ? null : parseInt(curso.ID_COLEGIO),
        ID_NIVEL: curso.ID_NIVEL == null || isNaN(curso.ID_NIVEL) ? null : parseInt(curso.ID_NIVEL),
        CUPO: curso.CUPO,
        DESCRIPCION: curso.DESCRIPCION
      },
      { autoCommit: true }
    );
    console.log('funciono');
    return result.outBinds;
  } catch (err) {    
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR CURSO PARTE 2-------*/
app.post('/actualizarCurso', async (req, res) => {
  try {
    const curso = req.body; 
    const resultado = await updateCurso(curso);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos del curso');
  }
});

async function updateCupo(cupo) {
  let connection;
  
  try {
    console.log('cupo')
    console.log(cupo);
    /*connection = await oracledb.getConnection(connAttrs); 
    const result = await connection.execute(
      `UPDATE CUPOS SET CUPO = :CUPO, DESCRIPCION = :DESCRIPCION WHERE ID_CURSO = :ID_CURSO AND ID_COLEGIO = :ID_COLEGIO AND ID_NIVEL`,
      { autoCommit: true }
    );
    return result.outBinds;*/
  } catch (err) {    
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

/*---------ACTUALIZAR CURSO PARTE 2-------*/
app.post('/actualizarCupo', async (req, res) => {
  try {
    const cupo = req.body; 
    const resultado = await updateCupo(cupo);
    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar los datos del cupo');
  }
});




/*---------FUNCION METODO BLOB-------*/
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('archivo'), async (req, res) => {
  console.log("hola2");
  console.log(req.file); // contiene información del archivo subido
  //console.log(req); // contiene información del archivo subido
  //res.status(200).send('Archivo recibido correctamente');
  const rut = req.body.rut;
  console.log(rut)
  let blobData;
  try {
    blobData = req.file.buffer;
  
    
  } catch (error) {
    
  }

  try {
    connection = await oracledb.getConnection(connAttrs); 
    const updateQuery = `
      UPDATE PERSONA
      SET CERTIFICADO = :blobData
      WHERE RUT = :rut
    `;

    const result = await connection.execute(updateQuery, { blobData, rut }, { autoCommit: true });

    console.log('BLOB updated in the database.');

  await connection.close();
    //await updateBlobInDatabase('valor_del_rut', blobData);
    res.status(200).send('Archivo recibido correctamente y actualizado en la base de datos.');
  } catch (error) {
    console.error('Error al actualizar el BLOB en la base de datos:', error);
    res.status(500).send('Ocurrió un error al actualizar el archivo en la base de datos.');
  }
});

/*---------FUNCION METODO PARA ENVIAR CORREOS-------*/
app.use(express.json())
async function enviarCorreo(destinatario, asunto, contenido) {
  const mensaje = {
    to: destinatario,
    from: 'lsgmatricula@gmail.com',
    subject: asunto,
    text:'Envio de credenciales',
    html: contenido
  };

  try {
    await sgMail.send(mensaje);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error.toString());
  }
}

app.post('/enviar-correo', async (req, res) => {
  console.log(req.body)
  const { destinatario, asunto, contenido } = req.body;

  try {
    await enviarCorreo(destinatario, asunto, contenido);
    res.status(200).json({ mensaje: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error.toString());
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});


/*FUNCION METODO PARA INSERTAR CUPOS*/


/*---------ESCUCHA DEL SERVIDOR-------*/
app.listen(4201, 'localhost', function () {
  console.log("escuchame servidor 4201 plz!!!!");
});


  // Función para verificar las credenciales
  app.post('/login', (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;
  
    // Función para verificar las credenciales y obtener el rut
    const checkCredentials = async () => {
      let connection;
      try {
        connection = await oracledb.getConnection(connAttrs);
  
        const result = await connection.execute(
          'SELECT * FROM CREDENCIAL WHERE nom_usuario = :username AND contrasenia = :password',
          [username, password]
        );
  
        if (result.rows.length === 1) {
          const rut = result.rows[0][0]; // Obtener el rut de la primera fila del resultado
          
          res.json({ success: true, rut }); // Devolver el rut junto con la respuesta de éxito
        } else {
          res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
      } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (error) {
            console.error('Error al cerrar la conexión:', error);
          }
        }
      }
    };
  
    checkCredentials();
  });

  
  
  
  
  
  
  

