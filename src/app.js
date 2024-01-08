require('dotenv').config();
const {listarRuc} = require('./consultas');

let listarRUC = async ()=> {
    try {
        let rows = await listarRuc();
        console.log(rows);
    } catch (error) {
        console.log("Error de Verificacion: ", error);
    }
}

listarRUC();