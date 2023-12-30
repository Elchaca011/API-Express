const mysql = require('mysql2/promise');

//creo la conexion a la db
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_tpe'
});

async function getAll(){
    const db = await conexion;
    const [rows, fields] = await db.query('SELECT * FROM categorias');
    return rows;
}

async function getAllWithFiltter(){
    const db = await conexion;
}


async function get(id){
    const db = await conexion;
    const [[row], fields] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    return row;
}

async function insert(categoriaNueva){
    /**
    * Esta funcion inserta una categoria nueva en la db, en la variable categoriaNueva
    * viene el request body con el objeto json de la nueva categoria a insertar,
    * luego la desarmo en sus propiedades ({ categoria, fragil }) para luego pasarlos 
    * como parametros en la query ([categoria, fragil]). Finalemnte retornamos el ultimo id
    * que eventualemte va a ser el de la categoria agregada.
    */
    const db = await conexion;
    const { categoria, fragil } = categoriaNueva; 
    const [rows] = await db.query('INSERT INTO categorias (categoria, fragil) VALUES (?,?)', [categoria, fragil]);
    return rows.insertId;
}

async function remove(id){
    const db = await conexion;
    const[result] = await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    return result.affectedRows; //devuelve la cantidad de filas afectadas
}

async function update(id, categoriaMod){
    const db = await conexion;
    const {categoria, fragil} = categoriaMod;
    const [rows] = await db.query('UPDATE categorias SET categoria = ?, fragil = ? WHERE id_categoria = ?' ,
                                        [categoria, fragil, id]);
    return rows.affectedRows;
}

async function getColumnsName(){
    const db = await conexion;
    const [rows] = await db.query('DESCRIBE categorias');
    return rows.map(row => row.Field);
}


//exporto las funciones
module.exports = {
    getAll,
    getAllWithFiltter,
    get,
    insert,
    remove,
    update,
    getColumnsName,
};