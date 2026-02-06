"use strict";

const { CrearCliente, CrearPaquete } = require("./factories");

describe("Gestión de Cliente", () => {
    // TEST 1
   test("Se le asigna un nombre y numero de linea", () => {
    const cliente = CrearCliente("Maria Lopez", 1132096752);
    
    expect(cliente.obtenerInfo()).toEqual({
        nombre: "Maria Lopez",
        numeroLinea: 1132096752});
    });

    // TEST 2
   test("Debe asignar correctamente nombre y número de cuenta", () => {
    const cliente1 = CrearCliente("Maria Lopez", 1132096752);
    const cliente2 = CrearCliente("Maria Cervantes", 1132096751);
    
    expect(cliente1.obtenerInfo()).toEqual({
        nombre: "Maria Lopez",
        numeroLinea: 1132096752});
    expect(cliente2.obtenerInfo()).toEqual({
        nombre: "Maria Cervantes",
        numeroLinea: 1132096751});
    });

});

describe("Gestion de Paquete", () => {

    // TEST 1
    test("Se crea un paquete con datos, minutos, duración y precio", () => {
        // 2.5 GB, 1000 minutos, 30 días, $400
        const paquete = CrearPaquete(2.5, 1000, 30, 400); 

        expect(paquete.obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 1000,
            diasDuracion: 30,
            costo: 400
        });
    });

    // TEST 2
    test("No se puede crear un paquete con datos moviles negativos", () => {
        
        expect(() => {
            CrearPaquete(-2.5, 1000, 30, 400); 
        }).toThrow("La cantidad de datos no puede ser negativa");
    });

    // TEST 3
    test("No se puede crear un paquete con minutos de llamada negativos", () => {
        
        expect(() => {
            CrearPaquete(2.5, -1000, 30, 400); 
        }).toThrow("La cantidad de minutos de llamada no puede ser negativa");
    });

    // TEST 4
    test("No se puede crear un paquete con dias de duracion negativos", () => {
        
        expect(() => {
            CrearPaquete(2.5, 1000, -30, 400); 
        }).toThrow("La cantidad de dias de duracion no puede ser negativa");
    });

    // TEST 5
    test("No se puede crear un paquete con costo negativo", () => {
        
        expect(() => {
            CrearPaquete(2.5, 1000, 30, -400); 
        }).toThrow("La cantidad de costo no puede ser negativa");
    });

    // TEST 6
    test("Se crean dos paquetes diferentes con distintos valores", () => {
        // 2.5 GB, 1000 minutos, 30 días, $400
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400); 
        const paquete2 = CrearPaquete(5.0, 2000, 60, 800);

        expect(paquete1.obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 1000,
            diasDuracion: 30,
            costo: 400
        });
        expect(paquete2.obtenerInfo()).toEqual({
            datosMoviles: 5.0,
            minutosLlamada: 2000,
            diasDuracion: 60,
            costo: 800
        });
    });

    // TEST 7

});

