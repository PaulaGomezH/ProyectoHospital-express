var express = require('express');
var router = express.Router();
const { conexion } = require('../database/conexion.js')


router.get('/', function(req, res, next) {
  conexion.query('SELECT * FROM pacientes', (error, pacientes) => {
    if(error){
      res.status(500).send('Ocurrio un error' + error)
    } else {
      res.status(200).render('pacientes.hbs', {pacientes , opcion: 'disabled' , activo: true})
    }
  })
});

router.get('/agregar', (req, res) => {
  res.status(200).sendFile('registro-pacientes.html', {root: 'public'})
})

router.post('/guardar-pacientes', (req, res) => {
  const cedula_paciente = req.body.cedula
  const nombre = req.body.nombre
  const apellido = req.body.apellido
  const edad = req.body.edad
  const telefono = req.body.telefono
  conexion.query(`INSERT INTO pacientes (cedula_paciente, nombre, apellido, edad, telefono) VALUES (${cedula_paciente}, '${nombre}', '${apellido}', ${edad}, '${telefono}')`, (error, resultado) => {
    if (error) {
      res.status(500).send('Ocurrio un error en la consulta'+ error)
    } else {
      res.status(200).redirect('/pacientes')
    }
  })
})
router.get('/eliminar/:cedula_paciente', (req, res) => {
  const cedula = req.params.cedula_paciente;
  conexion.query(`DELETE FROM cita_medica WHERE id_paciente=${cedula}`, (error, result) => {
    if (error) {
      console.log("Ocurrio un error en la ejecución", error)
      res.status(500).send("Error en la consulta");
    } else {
      conexion.query(`DELETE FROM pacientes WHERE cedula_paciente=${cedula}`, (error, result) => {
        if (error) {
          console.log("Ocurrio un error en la ejecución", error)
          res.status(500).send("Error en la consulta");
        } else {
          res.redirect('/pacientes');
        }
      });
    }
  });
})
router.get('/activar', function(req, res, next) {
  conexion.query('SELECT * FROM pacientes', (error, pacientes) => {
    if(error){
      res.status(500).send('Ocurrio un error' + error)
    } else {
      res.status(200).render('pacientes.hbs', {pacientes, opcion: ''})
    }
  })
});
router.post('/actualizar/:cedula', (req, res) => {
  const cedula_paciente = req.params.cedula
  const nombre = req.body.nombre
  const apellido = req.body.apellido
  const edad = req.body.edad
  const telefono = req.body.telefono
  conexion.query(`UPDATE pacientes SET nombre='${nombre}', apellido='${apellido}', edad=${edad}, telefono=${telefono} WHERE cedula_paciente=${cedula_paciente}`, (error, resultado) => {
    if (error) {
      res.status(500).send('Ocurrio un error en la ejecución ' + error)
    } else {
      res.status(200).redirect('/pacientes')
    }
  })
})
module.exports = router;