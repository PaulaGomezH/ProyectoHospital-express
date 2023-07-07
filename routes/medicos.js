var express = require('express');
var router = express.Router();
var {conexion} = require('../database/conexion')

/* GET home page. */
router.get('/', function(req, res, next) {

conexion.query('SELECT * FROM medicos', (error, medicos)=>{
    if(error){
        res.status(500).send('Ocurrio un error en la consulta')
    }else{
      res.status(200).render('medicos.hbs', {medicos , opcion: 'disabled' , activo: true})
    }
})
});
router.get('/agregar', (req, res) => {
    res.status(200).sendFile('registro-medicos.html', {root: 'public'})
  })
router.post('/guardar-medico', (req, res)=>{
    const cedula = req.body.cedula
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const correo = req.body.correo
    const consultorio = req.body.consultorio
    const especialidad = req.body.especialidad
    conexion.query(`INSERT INTO medicos (cedula, nombres, apellidos, correo, consultorio, especialidad) VALUES (${cedula}, '${nombre}', '${apellido}', '${correo}', '${consultorio}', '${especialidad}')`, (error, resultado) => {
      if (error) {
        res.status(500).send('Ocurrio un error en la consulta'+ error)
      } else {
        res.status(200).redirect('/medicos')
      }
    })  
})

router.get('/eliminar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    conexion.query(`DELETE FROM cita_medica WHERE id_medico=${cedula}`, (error, result) => {
      if (error) {
        console.log("Ocurrio un error en la ejecución", error)
        res.status(500).send("Error en la consulta");
      } else {
        conexion.query(`DELETE FROM medicos WHERE cedula=${cedula}`, (error, result) => {
          if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
          } else {
            res.redirect('/medicos');
          }
        });
      }
    });
  })
  router.get('/activar', function(req, res, next) {
    conexion.query('SELECT * FROM medicos', (error, medicos) => {
      if(error){
        res.status(500).send('Ocurrio un error' + error)
      } else {
        res.status(200).render('medicos.hbs', {medicos, opcion: ''})
      }
    })
  });
  router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const especialidad = req.body.especialidad;
    const consultorio = req.body.consultorio;
    const correo = req.body.correo;
    conexion.query(`UPDATE medicos SET nombres='${nombres}', apellidos='${apellidos}', especialidad='${especialidad}', consultorio='${consultorio}', correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
    if (error) {
    console.log("Ocurrio un error en la ejecución", error)
    res.status(500).send("Error en la consulta");
    } else {
    res.redirect('/medicos');
    }
    });
    })
module.exports = router;