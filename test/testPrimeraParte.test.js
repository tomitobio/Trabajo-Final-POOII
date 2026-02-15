"use strict";

const { CrearCliente, CrearPaquete, CrearConsumo } = require("./factories");

// Repasando los tests, me doy cuenta que faltan varios tests
// de partes claves del negocio, como por ejemplo, 
// test de conversion de MB a GB y test de bloqueo de compra
// cuando queda saldo de un recurso cualquiera, por los que esos caso puntuales
// que tal vez deberian haber sido chequeados previamente en el orden de la consigna
// seran incluidos tanto en tests como refactors sobre el final del codigo


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
    test("No se puede crear un paquete con minutos de minutosLlamada negativos", () => {
        
        expect(() => {
            CrearPaquete(2.5, -1000, 30, 400); 
        }).toThrow("La cantidad de minutos de minutosLlamada no puede ser negativa");
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
        }).toThrow("Aun quedan recursos o días disponibles del paquete actual, no se puede comprar un nuevo paquete.");
    });

    // TEST 7
    test("El cliente puede comprar un paquete después de haber comprado y usado otro", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400);
        const paquete2 = CrearPaquete(5.0, 2000, 60, 800);

        cliente.cargarSaldo(10000); 
        cliente.comprarPaquete(paquete1);

        cliente.usarRecursos(CrearConsumo("datosMoviles", 2.5 * 1024, new Date("2024-05-10T10:00:00"), new Date("2024-05-15T10:00:00")));
        cliente.usarRecursos(CrearConsumo("minutosLlamada", 1000, new Date("2024-05-10T10:00:00"), new Date("2024-05-15T10:00:00")));

        cliente.comprarPaquete(paquete2);
        expect(cliente.obtenerPaqueteContratado().obtenerInfo()).toEqual({
            datosMoviles: 5.0,
            minutosLlamada: 2000,
            diasDuracion: 60,
            costo: 800
        });

    });

    // TEST 8
    test("El cliente puede configurar la renovacion automatica de su paquete", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);

        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        expect(cliente.renovacionAutomatica).toBe(true);
        expect(cliente.obtenerPaqueteContratado()).toEqual(paquete);
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
        const consumo = CrearConsumo("datosMoviles", 2000, inicio, fin);
        cliente.usarRecursos(consumo);

        expect(cliente.obtenerPaqueteContratado().obtenerInfo()).toEqual({
            datosMoviles: 0.55,
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
        const consumo = CrearConsumo("datosMoviles", 5000, inicio, fin);

        expect(() => {
            // cliente.usarDatos(5 (datos), 15 (dias));
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de MB consumidos no puede superar la cantidad de datos del paquete");    

    });
    
    // TEST 11
    test("El cliente desea consumir mas dias que los que su paquete tiene", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-07-10T10:30:00");
        const consumo = CrearConsumo("datosMoviles", 1, inicio, fin);

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
            const consumo = CrearConsumo("datosMoviles", -1, inicio, fin);
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de MB consumidos no puede ser negativa");    
        expect(() => {
            const inicio = new Date("2024-05-10T10:00:00");
            const fin = new Date("2024-07-10T10:30:00");
            const consumo = CrearConsumo("datosMoviles", 1, fin , inicio);
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de dias consumidos no puede ser negativa"); 
    });

    // TEST 13
    test("El cliente consume minutos de minutosLlamada de su paquete durante 10 dias", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("minutosLlamada", 100, inicio, fin);
        // cliente.usarminutosLlamada(200, 10);
        
        cliente.usarRecursos(consumo);
        expect(cliente.obtenerPaqueteContratado().obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 900,
            diasDuracion: 20,
            costo: 400
        });
    });

    // TEST 14
    test("El cliente desea consumir mas minutos de minutosLlamada que los que su paquete tiene", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("minutosLlamada", 10000, inicio, fin);

        expect(() => {
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de minutos consumidos no puede superar la cantidad de minutos del paquete");    
    });

    // TEST 15
    test("El cliente desea consumir mas dias que los que su paquete tiene al usar minutos de minutosLlamada", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-10-20T10:00:00");
        const consumo = CrearConsumo("minutosLlamada", 100, inicio, fin);

        expect(() => {
            cliente.usarRecursos(consumo);
        }).toThrow("La cantidad de dias consumidos no puede superar la cantidad de dias del paquete");
    });

    // TEST 16
    test("El cliente desea un numero negativo de dias consumidos y/o minutos de minutosLlamada consumidos", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");

        expect(() => {
            cliente.usarRecursos(CrearConsumo("minutosLlamada", -100, inicio, fin));
        }).toThrow("La cantidad de minutos consumidos no puede ser negativa");    
        expect(() => {
            cliente.usarRecursos(CrearConsumo("minutosLlamada", 100, fin, inicio));
        }).toThrow("La cantidad de dias consumidos no puede ser negativa"); 
    });

    // TEST 17
    // Creo nuevo objeto Consumos
    test("El cliente desea tener un registro de tiempo de consumos utilizados", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        // Al crear clase consumo, voy a modificar tests anteriores,
        // donde los consumos eran simples numeros, que algunos 
        // quedaran comentados para ver la evolucion del codigo
        cliente.cargarSaldo(paquete.obtenerInfo().costo);
        cliente.comprarPaquete(paquete, true);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("datosMoviles", 1, inicio, fin);

        // Tambien aproveche para hacer un gran refactor,
        // en donde el cliente simplemente utiliza recursos 
        // y los metodos se encargan de seleccionar el tipo de consumo
        // correcto a partir del objeto Consumo.

        cliente.usarRecursos(consumo);

        expect(cliente.obtenerHistorialConsumos()[0].inicio).toEqual(inicio);
        expect(cliente.obtenerHistorialConsumos()[0].fin).toEqual(fin);
    });

    // TEST 18
    test("NO se puede comprar paquete nuevo si se acabaron los datos pero quedan minutos (No está agotado)", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400);
        const paquete2 = CrearPaquete(3, 100, 30, 200);

        cliente.cargarSaldo(1000);
        cliente.comprarPaquete(paquete1);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("datosMoviles", 1, inicio, fin);

        cliente.usarRecursos(consumo);

        expect(() => {
            cliente.comprarPaquete(paquete2);
        }).toThrow("Aun quedan recursos o días disponibles del paquete actual, no se puede comprar un nuevo paquete."); 
    });

    // TEST 19
    test("Se puede comprar paquete nuevo si la fecha actual supera el vencimiento (aunque tenga datos)", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 10, 400);
        const paquete2 = CrearPaquete(3, 100, 30, 200);

        cliente.cargarSaldo(1000);
        cliente.comprarPaquete(paquete1);

        const inicio = new Date("2024-05-10T10:00:00");
        const fin = new Date("2024-05-20T10:00:00");
        const consumo = CrearConsumo("datosMoviles", 1000, inicio, fin);

        cliente.usarRecursos(consumo);
        cliente.comprarPaquete(paquete2);
        expect(cliente.obtenerPaqueteContratado()).toEqual(paquete2);
    });

    // TEST 20
    test("El historial debe devolverse ordenado por fecha de inicio", () => {
        
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(1000);
        cliente.comprarPaquete(paquete);

        const inicio1 = new Date("2024-05-10T10:00:00");
        const fin1 = new Date("2024-05-15T10:00:00");
        const inicio2 = new Date("2024-05-12T10:00:00");
        const fin2 = new Date("2024-05-20T10:00:00");

        const consumoHoy = CrearConsumo("datosMoviles", 1, inicio1, fin1);
        const consumoAyer = CrearConsumo("datosMoviles", 1, inicio2, fin2);

        cliente.usarRecursos(consumoHoy);
        cliente.usarRecursos(consumoAyer);

        const historial = cliente.obtenerHistorialConsumos();
        expect(historial[0].inicio).toEqual(inicio1);
        expect(historial[1].inicio).toEqual(inicio2);
    });

    // TEST 21
    test("El historial se puede filtrar por rango de fechas", () => {

        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(100, 1000, 30, 400);
        cliente.cargarSaldo(1000);
        cliente.comprarPaquete(paquete);
        const fechaEnero = new Date("2024-01-15T10:00:00");
        const fechaMarzo = new Date("2024-03-15T10:00:00");
        const fechaMayo = new Date("2024-05-15T10:00:00");

        cliente.usarRecursos(CrearConsumo("datosMoviles", 1, fechaEnero, fechaEnero));
        cliente.usarRecursos(CrearConsumo("datosMoviles", 1, fechaMarzo, fechaMarzo));
        cliente.usarRecursos(CrearConsumo("datosMoviles", 1, fechaMayo, fechaMayo));

        const inicioFiltro = new Date("2024-02-01");
        const finFiltro = new Date("2024-04-01");
        const historialFiltrado = cliente.obtenerHistorialConsumos({desde: inicioFiltro, hasta: finFiltro});

        expect(historialFiltrado.length).toBe(1);
        expect(historialFiltrado[0].inicio).toEqual(fechaMarzo);
    });

    // TEST 22
    test("El cliente tiene renovacion automatica activada y se le renueva el paquete al usar todos los datos", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 30, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo * 2); 
        cliente.comprarPaquete(paquete, true);

        const inicio1 = new Date("2024-05-01T10:00:00");
        const fin1 = new Date("2024-05-12T10:00:00");
        const inicio2 = new Date("2024-05-17T10:00:00");
        const fin2 = new Date("2024-05-19T10:00:00");
        const consumo1 = CrearConsumo("datosMoviles", 2.5 * 1024, inicio1, fin1);
        const consumo2 = CrearConsumo("minutosLlamada", 1000, inicio2, fin2);
        cliente.usarRecursos(consumo1);
        cliente.usarRecursos(consumo2);

        expect(cliente.obtenerPaqueteContratado().obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 1000,
            diasDuracion: 30,
            costo: 400
        });
    });
    // TEST 23
    test("El cliente tiene renovacion automatica activada y se le renueva el paquete al quedarse sin dias", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 10, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo * 2); 
        cliente.comprarPaquete(paquete, true);

        const inicio = new Date("2024-05-01T10:00:00");
        const fin = new Date("2024-05-11T10:00:00");
        const consumo = CrearConsumo("datosMoviles", 2.5 * 1024, inicio, fin);
        
        cliente.usarRecursos(consumo);

        expect(cliente.obtenerPaqueteContratado().obtenerInfo()).toEqual({
            datosMoviles: 2.5,
            minutosLlamada: 1000,
            diasDuracion: 10,
            costo: 400
        });
    });

    // TEST 23
    test("El cliente tiene no precisa renovar ya que le quedan recursos asignados al paquete", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete1 = CrearPaquete(2.5, 1000, 30, 400);
        const paquete2 = CrearPaquete(2.5, 2000, 30, 400);
        cliente.cargarSaldo(paquete1.obtenerInfo().costo * 2); 
        cliente.comprarPaquete(paquete1);

        const inicio1 = new Date("2024-05-01T10:00:00");
        const fin1 = new Date("2024-05-12T10:00:00");
        const inicio2 = new Date("2024-05-17T10:00:00");
        const fin2 = new Date("2024-05-19T10:00:00");
        const consumo1 = CrearConsumo("datosMoviles", 2.5 * 1024, inicio1, fin1);
        const consumo2 = CrearConsumo("minutosLlamada", 200, inicio2, fin2);
        cliente.usarRecursos(consumo1);
        cliente.usarRecursos(consumo2);

        expect(() => {cliente.comprarPaquete(paquete2)}).toThrow("Aun quedan recursos o días disponibles del paquete actual, no se puede comprar un nuevo paquete.");
    });

    // TEST 24
    test("El cliente no tiene paquetes contratados", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 10, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo * 2); 


        const inicio = new Date("2024-05-01T10:00:00");
        const fin = new Date("2024-05-11T10:00:00");
        const consumo = CrearConsumo("datosMoviles", 2.5 * 1024, inicio, fin);
        
        expect(() => cliente.usarRecursos(consumo)).toThrow("El cliente no tiene paquetes contratados");
    });

    // TEST 25
    test("El cliente tiene un paquete contratado pero no tiene saldo para renovarlo", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(2.5, 1000, 10, 400);
        cliente.cargarSaldo(paquete.obtenerInfo().costo); 
        cliente.comprarPaquete(paquete, true);
        
        expect(() => {
            const inicio = new Date("2024-05-01T10:00:00");
            const fin = new Date("2024-05-11T10:00:00");
            const consumo = CrearConsumo("datosMoviles", 2.5 * 1024, inicio, fin);
            cliente.usarRecursos(consumo);
        }).toThrow("Saldo insuficiente para la renovación automática del paquete");
    });
});