"use strict";

const { CrearCliente, CrearPaquete, CrearConsumo } = require("./factories");

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

    // TEST 9
    test("El cliente consume gigas de su paquete durante 15 dias", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-25T10:00:00");

        // cliente.usarDatos(2 (datos), 15 (dias));
        const consumo = CrearConsumo("Internet", 2, inicio, fin);
        cliente.usarRecursos(consumo);

        expect(cliente.obtenerPaquetesContratados()[0].obtenerInfo()).toEqual({
            datosMoviles: 0.5,
            minutosLlamada: 1000,
            diasDuracion: 15,
            costo: 400
        });
    });
    
    // TEST 10
    test("El cliente desea consumir mas gigas que los que su paquete tiene", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-10T10:30:00");
        const consumo = CrearConsumo("Internet", 5, inicio, fin);

        expect(() => {
            // cliente.usarDatos(5 (datos), 15 (dias));
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de gigas consumidos no puede superar la cantidad de datos del paquete");    

    });
    
    // TEST 11
    test("El cliente desea consumir mas dias que los que su paquete tiene", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-07-10T10:30:00");
        const consumo = CrearConsumo("Internet", 1, inicio, fin);

        expect(() => {
            // cliente.usarDatos(1, 50);
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de dias consumidos no puede superar la cantidad de dias del paquete");    
    });
    
    // TEST 12
    test("El cliente desea un numero negativo de dias consumidos y/o gigas consumidos", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        expect(() => {
            const inicio = new Date("2024-05-10T10:00:00");
            const fin = new Date("2024-05-10T10:30:00");
            const consumo = CrearConsumo("Internet", -1, inicio, fin);
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de gigas consumidos no puede ser negativa");    
        expect(() => {
            const inicio = new Date("2024-05-10T10:00:00");
            const fin = new Date("2024-07-10T10:30:00");
            const consumo = CrearConsumo("Internet", 1, fin , inicio);
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de dias consumidos no puede ser negativa"); 
    });

    // TEST 13
    test("El cliente consume minutos de llamada de su paquete durante 10 dias", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("Llamada", 100, inicio, fin);
        // cliente.usarMinutosLlamada(200, 10);
        
        cliente.usarRecursos(consumo);
        expect(cliente.obtenerPaquetesContratados()[0].obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 900,
            diasDuracion: 20,
            costo: 400
        });
    });

    // TEST 14
    test("El cliente desea consumir mas minutos de llamada que los que su paquete tiene", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("Llamada", 10000, inicio, fin);

        expect(() => {
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de minutos consumidos no puede superar la cantidad de minutos del paquete");    
    });

    // TEST 15
    test("El cliente desea consumir mas dias que los que su paquete tiene al usar minutos de llamada", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-10-20T10:00:00");
        const consumo = CrearConsumo("Llamada", 100, inicio, fin);

        expect(() => {
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de dias consumidos no puede superar la cantidad de dias del paquete");
    });

    // TEST 16
    test("El cliente desea un numero negativo de dias consumidos y/o minutos de llamada consumidos", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-10-20T10:00:00");
        
        expect(() => {
            cliente.usarRecursos(CrearConsumo("Llamada", -100, inicio, fin));
        }).toThrow("La cantidad de minutos consumidos no puede ser negativa");    
        expect(() => {
            cliente.usarRecursos(CrearConsumo("Llamada", 100, fin, inicio));
        }).toThrow("La cantidad de dias consumidos no puede ser negativa"); 
    });

    // TEST 17
    // Creo nuevo objeto Consumos
    test("El cliente desea tener un registro de tiempo de consumos utilizados", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-10T10:30:00");
        const consumo = CrearConsumo("Datos Moviles", 500, inicio, fin);
        // Al crear clase consumo, voy a modificar tests anteriores,
        // donde los consumos eran simples numeros, que quedaran comentados
        // para ver la evolucion del codigo
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        cliente.usarDatos(500, consumo);
        
        expect(cliente.obtenerHistorialConsumos()[0]).toEqual({
            tipo: "Datos Moviles",
            cantidad: 500,
            inicio: inicio,
            fin: fin
        });
    });

     // TEST 18
    // Creo nuevo objeto Consumos
    test("El cliente desea tener un registro de tiempo de consumos utilizados", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-10T10:30:00");
        const consumo = CrearConsumo("Datos Moviles", 500, inicio, fin);
        // Al crear clase consumo, voy a modificar tests anteriores,
        // donde los consumos eran simples numeros, que quedaran comentados
        // para ver la evolucion del codigo
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        cliente.usarDatos(500, consumo);
        
        expect(cliente.obtenerHistorialConsumos()[0]).toEqual({
            tipo: "Datos Moviles",
            cantidad: 500,
            inicio: inicio,
            fin: fin
        });
    });
});