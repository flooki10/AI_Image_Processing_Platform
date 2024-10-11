import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Basededatos.css';

function PacientesTabla() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/');
        setPacientes(response.data);
      } catch (error) {
        console.error('Error al cargar los pacientes', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleModificar = (numeroExamen, nuevosDatos) => {
    axios.put(`http://127.0.0.1:5000/modificar_paciente/${numeroExamen}`, nuevosDatos)
        .then(response => {
            console.log('Paciente modificado:', response.data);
            // Actualizar la interfaz de usuario si es necesario
        })
        .catch(error => {
            console.error('Error al modificar paciente:', error);
        });
};

  const handleBorrar = (Ndehistoriaclinica) => {
    axios.delete(`http://127.0.0.1:5000/borrar_paciente/${Ndehistoriaclinica}`)
      .then(response => {
        console.log('Paciente borrado:', response.data);
        // Actualizar la interfaz de usuario si es necesario
      })
      .catch(error => {
        console.error('Error al borrar paciente:', error);
      });
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    paciente.Ndehistoriaclinica.toString().includes(busqueda)
  );

  return (
    <div className="primera">
    <h1 className="form-title">Bases de datos</h1>
    <input
        type="text"
        value={busqueda}
        onChange={handleBusquedaChange}
        placeholder="Buscar por nombre, apellidos o número de historia clínica"
      />
    <div className="patient-info-container">
      
      <div className="table-container">
        <table>
        <thead className="fixed-header">
            <tr>
              <th>Número de Examen</th>
              <th>Número de Historia Clínica</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Género</th>
              <th>Fecha de Nacimiento</th>
              <th>Tipo de Examen</th>
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map((paciente) => (
              <tr key={paciente.numeroExamen}>
                <td>{paciente.numeroExamen}</td>
                <td>{paciente.Ndehistoriaclinica}</td>
                <td>{paciente.nombre}</td>
                <td>{paciente.apellido}</td>
                <td>{paciente.genero}</td>
                <td>{paciente.Fechadenacimiento}</td>
                <td>{paciente.tipoExamen}</td>
                <td>{paciente.diagnostico}</td>
                <td>
                  <button className="green-button" onClick={() => handleModificar(paciente.numeroExamen)}>Modificar</button>
                  <button className="red-button" onClick={() => handleBorrar(paciente.numeroExamen)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default PacientesTabla;
