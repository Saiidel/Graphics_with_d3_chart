const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para obtener los datos
app.get('/api/ventas', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'ventas.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de datos.' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint para simular la actualización dinámica
app.post('/api/actualizar', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'ventas.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudo leer el archivo.' });
        }
        //Asignacíon de la informacion de ventas a datos
        let datos = JSON.parse(data);
        // Simulamos variación aleatoria en ventas e ingresos para reflejar tiempo real en las gráficas generadas
        datos = datos.map(item => {
            const variacionVentas = Math.floor(Math.random() * 30) - 10;
            const nuevasVentas = Math.max(10, item.ventas + variacionVentas);
            return {
                ...item,
                ventas: nuevasVentas,
                ingresos: nuevasVentas * item.precio
            };
        });

        fs.writeFile(filePath, JSON.stringify(datos, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el archivo.' });
            }
            res.json({ mensaje: 'Datos actualizados con éxito', datos });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});