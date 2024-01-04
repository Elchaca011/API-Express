//importo el modelo
const categoriaModel = require('../models/categoria.model');

async function getAll(req, res){
    const field = req.query.field; //aca viene el campo
    const value = req.query.value  //aca viene el valor del campo


    if(!field  && !value ){ //si los query params vienen vacios traigo todas las categorias
        const categorias = await categoriaModel.getAll(); //traigo todas las categorias
        res.send(categorias);
        return;
    }

    const campos = await categoriaModel.getColumnsName(); //aca traigo todos los campos de la db para hacer la validacion
    
    if(!campos.includes(field)){ //si el campo que ingreso el usuario no es valido le mando el mesnaje
        res.status(400).send('ingrese un campo valido!');
        return;
    }

    const categoriasFiltradas = await categoriaModel.getAllFiltter(field, value); //aca traigo todas las categorias filtradas

    if(categoriasFiltradas.length === 0){
        res.status(400).send('ingrese un valor valido!');
        return;
    }

    res.send(categoriasFiltradas);
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