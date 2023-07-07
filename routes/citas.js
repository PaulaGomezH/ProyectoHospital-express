var express = require('express');
var router = express.Router();
const { conexion } = require('../database/conexion')

/* GET home page. */
router.get("/", function (req, res, next) {
    conexion.query("SELECT C.id, C.fecha, Med.nombres, pa.nombre, Med.consultorio FROM cita_medica C, medicos Med, pacientes pa WHERE id_medico=cedula AND cedula_paciente=id_paciente;", (error, citas) => {
      if (error) { 
        console.log(error)
        console.log('entramos aqui')
        res.status(500).send("Ocurrio un error en la consulta");
      } else {
        res.status(200).render("citas", { citas });
      }
    });
});

router.get('/agregar', (req, res) => {
  res.status(200).sendFile('registro-citas.html', {root: 'public'})
})

router.post('/guardar-cita', (req, res) => {
  console.log('hola')
  const cedula_paciente = req.body.cedula;
  const fecha = req.body.fecha;
  const especialidad = req.body.especialidad;
  conexion.query(`SELECT * FROM medicos WHERE especialidad='${especialidad}'`, (error, medicos) => {
    if (error) {
      console.log('entramos');
      res.status(500).send('Error en la consulta ' + error)
    } else {
      const cedulaMedico = medicos[0].cedula;
      conexion.query(`INSERT INTO cita_medica (id_paciente, id_medico, fecha) VALUES (${cedula_paciente}, ${cedulaMedico}, '${fecha}')`, (error, resultado) => {
        if (error) {
          console.log('error!')
          res.status(500).send('Error en la consulta ' + error)
        } else {
          res.redirect('/citas')
        }
      })
    }
  })
})
router.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  conexion.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, resultado) => {
    if (error) {
      res.status(500).send('Ocurrio un error en la consulta ' + error)
    } else{
      res.status(200).redirect('/citas')
    }
  })
})


module.exports = router;
