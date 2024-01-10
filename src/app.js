require('dotenv').config();
const {listarEmpresas,VERIFICAR} = require('./consultas');

let main = async ()=> {
    try {
        let rows = await listarEmpresas();

       
        if(rows.length > 0) {

            const guardarPromesas = rows.map(async (row, index) => {               
                let RESP = await VERIFICAR(row);             
            });       
          //  await Promise.all(guardarPromesas);

        }
        
    } catch (error) {
        console.log("Error de Verificacion: ", error);
    }
}

main();