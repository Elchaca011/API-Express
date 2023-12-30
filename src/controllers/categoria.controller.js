//importo el modelo
const categoriaModel = require('../models/categoria.model');

async function getAll(req, res){
    const filter = req.query;
    console.log(filter);
    const field = Object.keys(filter);

    if(field.length === 0){ //si el query params viene vacio traigo todas las categorias
        const categorias = await categoriaModel.getAll(); //traigo todas las categorias
        res.send(categorias);
        return;
    }

    const categoriaColumns = await categoriaModel.getColumnsName();

    //validacion de campo existente
    let flag = false;
    for (const column of categoriaColumns) {
        //si el campo coincide con alguno de los campos del objeto categoriaColums flag = true
        if(field.includes(column)){
            flag = true;
        }
    }

    //si flag es true es proque el campo coincide con los campos de categorias de la db por ende se puede realizar el filtrado
    if(flag){
        res.send('aca va el listado filtrado'); //llamar al modelo y realizar la query!!!
        return;
    }
    
    res.status(400).send('ingrese un campo valido para realizar el filtrado!');

}

async function get(req, res){
    const id = req.params.id;
    const categoria = await categoriaModel.get(id);
    //validacion
    if (!categoria) {
        res.status(404).send(`La categoria con el id= ${id} no existe`);
        return;
    }
    res.send(categoria);
}

async function insert(req, res){
    //utilizo una excepcion para manejar posibles errores
    try {
        const categoriaNueva = req.body; //aca viene el objeto json mandado en el body por el cliente
        const insertID = await categoriaModel.insert(categoriaNueva);
        console.log(req.body);
        res.status(201).send(`Categoria agregada correctamanete con el id= ${insertID}`);
    } catch (error) {
        res.status(404).send(`La categoria no pudo ser insertada`);
    }
}

async function remove(req, res){
    const id = req.params.id;
    const result = await categoriaModel.remove(id); //esto me trae el resultado de filas afectadas
    //validacion
    if(result <= 0){
        res.status(404).send(`La categoria no pudo ser eliminada`);
        return;
    }
    res.send(`se elimino la categoria con el id ${id}.`);
}

async function update(req, res){
    const id = req.params.id;
    const categoriaMod = req.body; //aca viene el objeto json mandado en el body por el cliente
    const columnNames = await categoriaModel.getColumnsName();
    
    // Excluir el campo id_categoria de la validación
    const columnsToValidate = columnNames.filter(column => column !== 'id_categoria');  

    // Validar la estructura del objeto JSON
    const atributes = Object.keys(categoriaMod); //Object.keys(categoriaMod) devuelve un array con las claves/atributos del objeto categoriaMod
    
    for (const column of columnsToValidate) {
        //itero las columnas que se van a validar hasta que haya una incompatibilidad de atributos
        if (!atributes.includes(column)) {
            res.status(400).send('El cuerpo de la solicitud debe contener un objeto con las propiedades validas');
            return;
        }
    }

    const result = await categoriaModel.update(id, categoriaMod);

    //validacion
    if(result <= 0){
        res.status(404).send(`La categoria no pudo ser modificada`);
        return;
    }
    res.send(`se modifco la categoria con el id = ${id}.`);
}

//exporto las funciones
module.exports = {
    getAll,
    get,
    insert,
    remove,
    update,
}