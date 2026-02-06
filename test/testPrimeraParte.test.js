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

});


describe("Gestión de Compras y Saldo", () => {
    
    // TEST 1
    test("El cliente puede cargar saldo en su cuenta prepaga", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        
        cliente.cargarSaldo(1000);
        
        expect(cliente.obtenerSaldo()).toBe(1000);
    });

    // TEST 2
    test("El cliente no puede cargar un monto negativo", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        expect(() => {
            cliente.cargarSaldo(-500);
        }).toThrow("El monto a cargar no puede ser negativo");
    });

     // TEST 3
     test("El cliente puede cargar saldo varias veces y se acumula correctamente", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);   
        cliente.cargarSaldo(1000);
        cliente.cargarSaldo(500);
        expect(cliente.obtenerSaldo()).toBe(1500);
        }); 

    // TEST 4
    test("El cliente puede comprar un paquete si tiene saldo suficiente", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        
        cliente.cargarSaldo(500);
        cliente.cargarSaldo(paquete.obtenerInfo().costo);

        cliente.comprarPaquete(paquete);
        expect(cliente.obtenerSaldo()).toBe(500);
    });

    // TEST 5
    test("El cliente no puede comprar un paquete si tiene saldo insuficiente", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        
        cliente.cargarSaldo(paquete.obtenerInfo().costo - 100); 
        expect(() => {
            cliente.comprarPaquete(paquete);
        }).toThrow("Saldo insuficiente para comprar el paquete");
    });

    // TEST 6
    test("El cliente no puede comprar varios paquetes al mismo tiempo por regla de negocio", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400);
        const paquete2 = CrearPaquete(5.0, 2000, 60, 800);
        
        cliente.cargarSaldo(paquete1.obtenerInfo().costo + paquete2.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete1);
        expect(() => { 
            cliente.comprarPaquete(paquete2);
        }).toThrow("El cliente no puede comprar varios paquetes al mismo tiempo por regla de negocio");
    });

    // TEST 7
    test("El cliente puede comprar un paquete después de haber comprado y usado otro", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400);
        const paquete2 = CrearPaquete(5.0, 2000, 60, 800);

        cliente.cargarSaldo(paquete1.obtenerInfo().costo + paquete2.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete1);
        // Simular uso del paquete1
        cliente.usarPaquete();
        cliente.comprarPaquete(paquete2);

        expect(cliente.obtenerPaquetesContratados()).toEqual([paquete2]);
    });

    // TEST 8
    test("El cliente puede configurar la renovacion automatica de su paquete", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);

        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        cliente.usarPaquete();

        expect(cliente.renovacionAutomatica).toBe(true);
        expect(cliente.obtenerPaquetesContratados()).toEqual([paquete]);
    });

});