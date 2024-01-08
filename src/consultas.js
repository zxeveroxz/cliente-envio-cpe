const pool = require('./db');

async function listarRuc() {
    const connection = await pool.getConnection();
    const query = ` SELECT 
                        ruc_, user_sunat,pass_sunat from tbl_user_sunat as s 
                    WHERE 
                        ruc_ in (   SELECT 
                                        DISTINCT ruc 
                                    FROM 
                                        tbl_user 
                                    WHERE 
                                        user_sunat is not null and ose_ruta is null
                                ) 
                    ORDER BY s.ruc_ ASC                        

                `;
    const [rows, fields] = await connection.query(query);

    connection.release();
    return rows;
}

async function obtenerCabecerasCDP(RUC) {
    try {
        const connection = await pool.getConnection();
        const query = ` SELECT 
                            CDP.idx,CDP.ruc_,CDP.tip_ope,CONCAT(CDP.DOCUMENTO,ALM.serie) as SERIE, 
                            CDP.NUMERO, 
                            CDP.tot_vta, 
                            DATE_FORMAT(fec_ope, '%d/%m/%Y') as fec_ope  
                         FROM (
                            SELECT 
                                A.idx, A.ruc_, A.tip_ope, A.ANEXO, A.DOCUMENTO, A.NUMERO, A.fec_ope , A.tot_vta  
                            FROM tbl2_CDP_cab A
                            LEFT JOIN tbl2_validez_sunat C ON A.idx = C.idx
                            WHERE 
                                C.idx IS NULL AND A.ruc_='${RUC}' AND A.tip_ope in ('01','03') AND A.usu_del is null AND YEAR(A.fecha)>=2023 
                        UNION
                            SELECT 
                                B.idx, B.ruc_, B.tip_ope, B.ANEXO, B.DOCUMENTO, B.NUMERO, B.fec_ope , B.tot_vta 
                            FROM tbl2_NCD_cab B
                            LEFT JOIN tbl2_validez_sunat C ON B.idx = C.idx
                            WHERE 
                                C.idx IS NULL AND B.ruc_='${RUC}' AND B.tip_ope in ('07','08') AND B.usu_del is null AND YEAR(B.fecha)>=2023 
                        ) AS CDP
                         INNER JOIN tbl2_almacen ALM ON CDP.ANEXO=ALM.idx
                         LIMIT 150

                         
                    `;
        const [rows, fields] = await connection.query(query);
        //console.log(rows);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        return false;
    }
}

module.exports = {listarRuc}