import React, { useState,useRef } from 'react';
import jsPDF from 'jspdf';
import './Main.css';
import axios from 'axios';

// Define the main functional component
function Main () {


  // State to manage form data
  const [formData, setFormData] = useState({
    numeroExamen: '',
    Ndehistoriaclinica: '',
    nombre: '',
    apellido: '',
    genero: '',
    Fechadenacimiento: '',
    tipoExamen: '',
    diagnostico: '',

  });


  const titulosVariables = {
    numeroExamen: 'Nº Examen',
    Ndehistoriaclinica: 'Nº Historia Clínica',
    nombre: 'Nombre',
    apellido: 'Apellido',
    genero: 'Género',
    Fechadenacimiento: 'Fecha de Nacimiento',
    tipoExamen: 'Tipo de Examen',
    diagnostico: 'Diagnóstico'
  };
  

  // State to store API results, loading status, and drug recommendations
  const [file, setFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(''); // Estado para almacenar el resultado de la predicción
  const fileInputRef = useRef(null); // Crea una referencia para el input de archivo
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes in the form
  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click(); // Dispara el clic en el input de archivo real
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Asume que se carga un solo archivo
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Respuesta de la API:", response.data); // Añade esto para verificar los datos
      setPredictionResult(response.data.prediction)

    } catch (error) {
      console.error('Hubo un error al hacer la predicción:', error);
      // Considera actualizar el estado con un mensaje de error específico aquí
    } 
  };
  
  
  // Validate the form to ensure all required fields are filled
  const validateForm = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };
  
  
  const handleDownloadPDF = () => {
    if (!validateForm()) {
      alert('Por favor completa todas las casillas que faltan');
      return;
    }
  
    setIsLoading(true);
  
    const pdf = new jsPDF();
    pdf.setTextColor(119, 119, 119); // Establece un color de texto general
  
    // Encabezado
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(63, 81, 181); // Un azul más intenso
    pdf.text('Informe Médico', 105, 20, null, null, 'center');
  
    // Línea debajo del encabezado
    pdf.setDrawColor(63, 81, 181); // Color azul
    pdf.line(20, 25, 190, 25);
  
    // Nombre del médico
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Dr(a). Nombre del Médico', 105, 32, null, null, 'center');
  
    // Sección de Información del Paciente
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.setTextColor(40); // Gris oscuro para el texto
    pdf.setFillColor(224, 224, 224); // Gris claro para el fondo
    pdf.rect(20, 38, 170, 8, 'F'); // Rectángulo de fondo para el título de la sección
    pdf.text('Información del Paciente', 25, 44);
  
    // Restablece el tamaño de la fuente para el contenido
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    let startY = 54;
    Object.entries(formData).forEach(([clave, valor], index) => {
      let titulo = titulosVariables[clave] || clave;
      pdf.text(`${titulo}: ${valor}`, 25, startY + index * 8);
    });
  
    // Sección de Resultado
    startY += Object.keys(formData).length * 8 + 10; // Ajusta el inicio de la nueva sección
    pdf.setFillColor(224, 224, 224); // Gris claro para el fondo
    pdf.rect(20, startY, 170, 8, 'F');
    pdf.setFontSize(14);
    pdf.setFont('times', 'bold');
    pdf.text('Resultado de la Predicción', 25, startY + 6);
  
    // Añade el resultado
    startY += 17; // Ajusta la posición para el texto del resultado
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    pdf.text(`Resultado de Predicción: ${predictionResult || 'No disponible'}`, 25, startY);
  
    // Guardar PDF
    const nombreCompleto = `${formData.nombre.trim()} ${formData.apellido.trim()}`.trim() || "Informe";
    const nombreArchivo = `${nombreCompleto.replace(/\s+/g, '_')}_informe.pdf`;
    pdf.save(nombreArchivo);
  
    setIsLoading(false);
  };

  const guardarPaciente = async () => {
    const url = 'http://localhost:5000/agregar_paciente'; 
    const datos = {
      numeroExamen: formData.numeroExamen,
      Ndehistoriaclinica: formData.Ndehistoriaclinica,
      nombre: formData.nombre,
      apellido: formData.apellido,
      genero: formData.genero,
      Fechadenacimiento: formData.Fechadenacimiento,
      tipoExamen: formData.tipoExamen,
      diagnostico: formData.diagnostico,
      prediccion: predictionResult
    };
  
    try {
      const respuesta = await axios.post(url,datos); 
      console.log(respuesta.data.mensaje);

    } catch (error) {
      console.error(error.response.data.error);
      // Manejar el error
    }
  };
  
  
  const manejarClick = () => {
    handleDownloadPDF();
    guardarPaciente();
  };


// Render the main component
  return (
    <div className="Todo">
      <div className="main-content">
        <div className="row">
          <div className="column">
            <div className="patient-info-form">
              <h2>Información del Paciente</h2>
              <form onSubmit={handleSubmit}>

              <div className="form-group">
                  <label htmlFor="numeroExamen">Nº Examen</label>
                  <input
                    type="number"
                    id="numeroExamen"
                    name="numeroExamen"
                    placeholder="Nº del examen"
                    value={formData.numeroExamen}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              <div className="form-group">
                  <label htmlFor="Ndehistoriaclinica">Nº Historia clínica</label>
                  <input
                    type="number"
                    id="Ndehistoriaclinica"
                    name="Ndehistoriaclinica"
                    placeholder="Nº de la historia clinica"
                    value={formData.Ndehistoriaclinica}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre del Paciente"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Apellido del Paciente"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genero">Género</label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="Fechadenacimiento">Fecha de nacimiento</label>
                  <input
                    type="date"
                    id="Fechadenacimiento"
                    name="Fechadenacimiento"
                    value={formData.Fechadenacimiento}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                <label htmlFor="tipoExamen">Tipo de Examen</label>
                <select
                    id="tipoExamen"
                    name="tipoExamen"
                    value={formData.tipoExamen}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Seleccionar Tipo de Examen</option>
                    <option value="IRM">IRM</option>
                    <option value="CT">CT</option>
                    <option value="Mamografía">Mamografía</option>
                    <option value="Radiografía">Radiografía</option>
                </select>
                </div>

                <div className="form-group">
                  <label htmlFor="diagnostico">Diagnóstico</label>
                  <input
                    type="text"
                    id="diagnostico"
                    name="diagnostico"
                    placeholder="diagnostico"
                    value={formData.diagnostico}
                    onChange={handleInputChange}
                    required
                  />
                </div>
            
              </form>
            </div>
          </div>

          {/* Button and Loading Section */}
          <div className="column column-center">
            <div className="buttons-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required
            />

             <button type="button" onClick={handleFileButtonClick}>
                Cargar Imagen
             </button>

              <button type="button" onClick={handleSubmit} disabled={isLoading}>
                Mostrar Resultados
              </button>

              <button type="button" onClick={manejarClick} disabled={isLoading}>
                Descargar PDF
              </button>

            </div>
            {isLoading && <p>Cargando...</p>}
          </div>

          {/* Results Section */}
          <div className="column">
    
            <div className="column resultado-column">
              <div className="patient-info-form">
                <h2>RESULTADO</h2>
              
              <div className="resultado-container">
                <div className="result-details">
                
                  <p className="result-section"><strong>Nº Examen:</strong> {formData.numeroExamen}</p>
                  <p className="result-section"><strong>Nº Historia clínica:</strong> {formData.Ndehistoriaclinica}</p>
                  <p className="result-section"><strong>Nombre:</strong> {formData.nombre}</p>
                  <p className="result-section"><strong>Apellido:</strong> {formData.apellido}</p>
                  <p className="result-section"><strong>Género:</strong> {formData.genero}</p>
                  <p className="result-section"><strong>Fecha de nacimiento:</strong> {formData.Fechadenacimiento}</p>
                  <p className="result-section"><strong>Tipo del examen:</strong> {formData.tipoExamen}</p>
                  <p className="result-section"><strong>Diagnóstico:</strong> {formData.diagnostico}</p>
                  <br></br>
            
                  <p className="predicted_label"><strong> Resultado de Predicción:</strong> {predictionResult || 'No disponible'}</p>
           
                  </div>
                </div>
              
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
