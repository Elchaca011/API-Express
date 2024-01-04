//importo el modelo
const productoModel = require('../models/producto.model');

async function getAll(req, res){
    const field = req.query.field;
    const value = req.query.value;

    const page = parseInt(req.query.page) || 1; //representa el numero de paginas de que deseamos obtener 
    const pageSize = parseInt(req.query.pageSize) || 5; //representa el numero de resultados por pagina

    // Calcular el índice de inicio en base a la página y el tamaño de página
    const startIndex = (page -1) * pageSize;

    if(!field && !value){
        const productos = await productoModel.getAll(pageSize, startIndex); //traigo todos los productos con paginacion
        const response = {
            data: productos,
            pagination: {
                page: page,
                pageSize: pageSize,
                totalItems: productos.length
            },
            message: productos.length > 0 ? 'Productos encontrados' : 'No hay mas productos.',
        };
        res.send(response);
        return;
    }

    const campos = await productoModel.getColumnsName(); //obtengo los campos
    console.log(campos);

    if(!campos.includes(field)){
        res.status(400).send('ingrese un campo valido');
        return;
    }

    const productosFiltrados = await productoModel.getAllFilter(field, value);

    if(productosFiltrados.length === 0){
        res.status(400).send('ingrese un valor valido!');
        return;
    }

    res.send(productosFiltrados);
    
}

async function get(req, res){
    const id = req.params.id;
    const producto = await productoModel.get(id); //traigo un determinado producto
    //validacion
    if (!producto) {
        res.status(404).send(`El producto con el id= ${id} no existe`);
        return;
    }
    res.send(producto);
}

async function getProductoByCategoria(req, res){
    const categoria = req.params.id_categoria;
    const productosByCategoria = await productoModel.getProductoByCategoria(categoria); //busco los productos que coincidan con el id_categoria mandado por el cliente
    if(productosByCategoria.length === 0){
        res.status(404).send(`No se econtraron productos relacionados con la id_categoria = ${categoria}`);
        return;
    }
    res.send(productosByCategoria);
}

async function insert(req, res){
    //utilizo una excepcion para manejar posibles errores
    try {
        const productoNuevo = req.body; //aca viene el objeto json mandado en el body por el cliente
        const insertID = await productoModel.insert(productoNuevo);
        console.log(req.body);
        res.status(201).send(`Producto agregado correctamanete con el id= ${insertID}`);
    } catch (error) {
        res.status(404).send(`El producto no pudo ser insertado`);
    }
}

async function remove(req, res){
    const id = req.params.id;
    const result = await productoModel.remove(id); //esto me trae el resultado de filas afectadas
    //validacion (si ninguna de las filas fue afectada)
    if(result <= 0){
        res.status(404).send(`El producto no pudo ser eliminado`);
        return;
    }
    res.send(`Se elimino el producto con el id = ${id}.`);
}

async function update(req, res){
    const id = req.params.id;
    const productoMod = req.body; //aca viene el objeto json mandado en el body por el cliente
    const columnNames = await productoModel.getColumnsName();

    // Excluir el campo id_producto de la validación
    const columnsToValidate = columnNames.filter(column => column !== 'id_producto');

    // Validar la estructura del objeto JSON
    const atributes = Object.keys(productoMod); //Object.keys(productoMod) devuelve un array con las claves/atributos del objeto productoMod
    
    for (const column of columnsToValidate) {
        //itero las columnas que se van a validar hasta que haya una incompatibilidad de atributos
        if (!atributes.includes(column)) {
            res.status(400).send('El cuerpo de la solicitud debe contener un objeto con las propiedades validas');
            return;
        }
    }
    // bloque try catch para capturar el error de una categoria invalida
    try {
        const result = await productoModel.update(id, productoMod);
        //validacion
        if(result <= 0){
            res.status(404).send(`El producto no pudo ser modificado`);
            return;
        }
        res.send(`se modifco el producto con el id = ${id}.`);
    } 
    catch (error) {
        res.status(400).send('ingrese un id_categoria valido');
    }
}

//exporto las funciones
module.exports = {
    getAll,
    get,
    getProductoByCategoria,
    insert,
    remove,
    update,
}
