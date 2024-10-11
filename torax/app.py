from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS    


app = Flask(__name__)
CORS(app)



# Carga el modelo entrenado
model = load_model('C:/Users/walid/OneDrive/Desktop/modelo_torax.h5')

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
    labels = ['covid', 'neumonia', 'normal', 'opacidad']
    predicted_label = labels[predicted_class]
    
    return jsonify({'prediction': predicted_label})


from flask import Flask
from flask_mysqldb import MySQL
from flask import request, jsonify

#configuracion de la base de datos mysql
app.config['MYSQL_HOST']= 'localhost'
app.config['MYSQL_USER']= 'root'
app.config['MYSQL_PASSWORD']='' 
app.config['MYSQL_DB']='tfg'

mysql= MySQL(app)

@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM pacientes ")
    datos = cur.fetchall()
    cur.close()
    return str(datos)

from flask import jsonify

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


if __name__ == '__main__':
    app.run(debug=True)


