import React from 'react';
import './Home.css'; 
import qr from '../qr/qr.jpg';

function HomePage() {
  return (
    <div className="home-container">
      <div className="menu">
        <div className="menu-header">
          <h2>Herramientas</h2>
        </div>
        <div className="menu-links">
          <ul>
            <li><a href="#">Análisis</a></li>
            <li><a href="#">Seguimiento</a></li>
            <li><a href="#">Segmentación</a></li>
            <li><a href="#">Calculadora</a></li>
          </ul>
        </div>
        <div className="menu-separator"></div>
        <div className="menu-footer">
          <ul>
          <li><a href="#">Donaciones</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Soporte</a></li>
          </ul>
        </div>
      </div>
      
    <div className="content">
      <div className="presentation">
        {/* Cuadro de presentación */}
        <div className="presentation-box">
          <h1>Bienvenido a mi TFG</h1>
          <p> Bienvenido a nuestra plataforma web diseñada específicamente para radiólogos y profesionales de la salud interesados en herramientas avanzadas para el análisis y gestión de imágenes médicas. Nuestra plataforma ofrece un conjunto integral de herramientas desarrolladas con la última tecnología, proporcionando soluciones eficaces y precisas para mejorar la práctica clínica y la atención al paciente.

Características Clave:

Predicción de Tumores con Inteligencia Artificial (IA): Nuestra plataforma emplea algoritmos de IA de vanguardia para analizar imágenes de resonancia magnética (IRM) del cerebro, permitiendo la detección temprana y la predicción precisa de tumores. Esta herramienta proporciona a los radiólogos una valiosa asistencia en la interpretación de imágenes, mejorando la precisión diagnóstica y la planificación del tratamiento.

Seguimiento de Tumores: Facilitamos un sistema de seguimiento integral para monitorizar la evolución de los tumores a lo largo del tiempo. Los radiólogos pueden registrar y comparar imágenes de manera eficiente, lo que les permite evaluar la eficacia de los tratamientos y ajustar las estrategias de atención según sea necesario.

Segmentación de Imágenes: Nuestra plataforma incluye herramientas avanzadas de segmentación de imágenes, permitiendo una delineación precisa de estructuras anatómicas y patológicas. Esto es fundamental para la planificación de tratamientos y procedimientos quirúrgicos, así como para la investigación clínica.

Calculadoras de Dosis de Rayos X: Ofrecemos calculadoras especializadas para estimar dosis precisas de radiación en diferentes procedimientos radiológicos. Esta función ayuda a optimizar la seguridad del paciente al garantizar la administración adecuada de radiación y minimizar los riesgos asociados.

Sección de Donaciones: Reconociendo la importancia de apoyar a asociaciones sin fines de lucro, hemos integrado una sección dedicada a donaciones. A través de esta función, los usuarios pueden contribuir a causas benéficas como la investigación del Parkinson y otras enfermedades neurológicas, fortaleciendo así la comunidad médica y promoviendo el bienestar de los pacientes.

Beneficios para los Usuarios:

Acceso a herramientas avanzadas para mejorar la precisión diagnóstica y la planificación del tratamiento.
Mayor eficiencia en la interpretación y análisis de imágenes médicas.
Mejora en la calidad de la atención al paciente mediante la optimización de dosis de radiación y seguimiento de tumores.
Oportunidad de contribuir a causas benéficas a través de donaciones dirigidas.</p>
        </div>
      </div>
    <div className="donations-qr">
      {/* Cuadro de donaciones */}
        <div className="donations-box">
          <h2>¿Quieres Donar?</h2>
          <p>Ofrecemos la oportunidad de realizar donaciones para apoyar la investigación del Parkinson. Únete a nosotros para mejorar la atención médica y hacer una diferencia positiva en la comunidad.</p>
        </div>
        {/* QR Code */}
        <div className="qr-code">
          <img src={qr} alt="QR Code" />
        </div>
    </div>
  </div>
  </div>
  );
}

export default HomePage;
