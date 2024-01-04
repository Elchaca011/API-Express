const { query } = require('express');
const mysql = require('mysql2/promise');

//creo la conexion a la db
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_tpe'
});

async function getAll(pageSize, startIndex){
    const db = await conexion;
    const [rows, fields] = await db.query('SELECT * FROM productos LIMIT ? OFFSET ?' , [pageSize, startIndex]);
    return rows;
}

async function getAllFilter(field, value){
    const db = await conexion;
    const[productosFiltrados] = await db.query(`SELECT * FROM productos WHERE ${field} = ?`, [value]);
    return productosFiltrados;
}

async function get(id){
    const db = await conexion;
    const [[rows], fields] = await db.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    return rows;
}

async function getProductoByCategoria(id_categoria){
    const db = await conexion;
    const[rows, fields] = await db.query('SELECT nombre,precio FROM productos WHERE id_categoria = ?', [id_categoria]);
    return rows;
}

async function insert(productoNuevo){
    const db = await conexion;
    const {id_categoria, nombre, material, color, precio} = productoNuevo;
    const [rows] = await db.query('INSERT INTO productos (id_categoria, nombre, material, color, precio) VALUES (?,?,?,?,?)',
                                        [id_categoria, nombre, material, color, precio]);
    return rows.insertId;
}

async function remove(id){
    const db = await conexion;
    const[result] = await db.query('DELETE FROM productos WHERE id_producto = ?', [id]);
    return result.affectedRows;
}

async function update(id, productoMod){
    const db = await conexion;
    const {id_categoria, nombre, material, color, precio} = productoMod;
    const [rows] = await db.query('UPDATE productos SET id_categoria = ?, nombre = ?, material = ?, color = ?, precio = ? WHERE id_producto = ?',
                                [id_categoria, nombre, material, color, precio, id]);
    return rows.affectedRows;
}

async function getColumnsName(){
    const db = await conexion;
    const [rows] = await db.query('DESCRIBE productos');
    return rows.map(row => row.Field);
}

//exporto las funciones
module.exports = {
    getAll,
    getAllFilter,
    get,
    getProductoByCategoria,
    insert,
    remove,
    update,
    getColumnsName,
}