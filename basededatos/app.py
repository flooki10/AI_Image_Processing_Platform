from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS    
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)


# Carga el modelo entrenado
model = load_model('C:/Users/walid/OneDrive/Desktop/TFGs/MODELOS_CLASIFICACION_SALUD/cerebro/modelo_cerebro.h5')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    # Convertir la imagen a RGB para asegurar que solo tenga 3 canales
    image = Image.open(file.stream).convert('RGB')
    image = image.resize((150, 150))  # Ajusta al tamaño esperado por tu modelo
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)  # Añade una dimensión para el batch
    
    prediction = model.predict(image_array)
    predicted_class = np.argmax(prediction, axis=1)[0]
    # Asume que tienes un mapeo de las clases predichas a las etiquetas de respuesta
    labels = ['Glioma Tumor', 'No Tumor', 'Meningioma Tumor', 'Pituitary Tumor']
    predicted_label = labels[predicted_class]
    
    return jsonify({'prediction': predicted_label})




#configuracion de la base de datos mysql
app.config['MYSQL_HOST']= 'localhost'
app.config['MYSQL_USER']= 'root'
app.config['MYSQL_PASSWORD']='1234' 
app.config['MYSQL_DB']='tfg'

mysql= MySQL(app)


@app.route('/agregar_paciente', methods=['POST'])
def agregar_paciente():
    datos = request.json
    print(datos)
    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO pacientes(numeroExamen, Ndehistoriaclinica, nombre, apellido, genero, Fechadenacimiento, tipoExamen, diagnostico) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (datos['numeroExamen'], datos['Ndehistoriaclinica'], datos['nombre'], datos['apellido'], datos['genero'], datos['Fechadenacimiento'], datos['tipoExamen'], datos['diagnostico']))
        mysql.connection.commit()
        cur.close()
        return jsonify({"mensaje": "Paciente agregado exitosamente"}), 201
    except Exception as e:
        print(e)
        app.logger.error(f"Error al agregar paciente: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM pacientes ")
    datos = cur.fetchall()
    cur.close()
    pacientes_list = []
    for fila in datos:
        pacientes_list.append({
            "numeroExamen": fila[0],
            "Ndehistoriaclinica": fila[1],
            "nombre": fila[2],
            "apellido": fila[3],
            "genero": fila[4],
            "Fechadenacimiento": str(fila[5]),  # Convertir a string si es necesario
            "tipoExamen": fila[6],
            "diagnostico": fila[7]
        })
    return jsonify(pacientes_list)


@app.route('/modificar_paciente/<int:numero_examen>', methods=['PUT'])
def modificar_paciente(numero_examen):
    # Obtener los nuevos datos del paciente de la solicitud JSON
    nuevos_datos = request.json

    # Conectar con la base de datos
    cur = mysql.connection.cursor()

    try:
        # Actualizar los datos del paciente en la base de datos
        cur.execute("""
            UPDATE pacientes
            SET Ndehistoriaclinica = %s, nombre = %s, apellido = %s, genero = %s, Fechadenacimiento = %s, tipoExamen = %s, diagnostico = %s
            WHERE numeroExamen = %s
        """, (nuevos_datos['Ndehistoriaclinica'], nuevos_datos['nombre'], nuevos_datos['apellido'], nuevos_datos['genero'], nuevos_datos['Fechadenacimiento'], nuevos_datos['tipoExamen'], nuevos_datos['diagnostico'], numero_examen))
        
        # Confirmar los cambios en la base de datos
        mysql.connection.commit()
        
        # Cerrar el cursor
        cur.close()

        # Devolver una respuesta exitosa
        return jsonify({"mensaje": "Paciente modificado correctamente"}), 200
    except Exception as e:
        # En caso de error, imprimir el error y devolver un mensaje de error
        print(e)
        app.logger.error(f"Error al modificar paciente: {e}")
        return jsonify({"error": "Error al modificar paciente"}), 500


    
@app.route('/borrar_paciente/<int:Ndehistoriaclinica>', methods=['DELETE'])
def borrar_paciente(Ndehistoriaclinica):
    # Conectar con la base de datos
    cur = mysql.connection.cursor()

    try:
        # Borrar al paciente de la base de datos
        cur.execute("DELETE FROM pacientes WHERE numeroExamen = %s", (Ndehistoriaclinica,))
        
        # Confirmar los cambios en la base de datos
        mysql.connection.commit()
        
        # Cerrar el cursor
        cur.close()

        # Devolver una respuesta exitosa
        return jsonify({"mensaje": "Paciente borrado correctamente"}), 200
    except Exception as e:
        # En caso de error, imprimir el error y devolver un mensaje de error
        print(e)
        app.logger.error(f"Error al borrar paciente: {e}")
        return jsonify({"error": "Error al borrar paciente"}), 500




if __name__ == '__main__':
    app.run(debug=True)


