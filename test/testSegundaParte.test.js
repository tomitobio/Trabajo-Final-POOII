"use strict";

const { AplicacionIlimitada, AplicacionEstandar } = require("../src/aplicacion");
const { CrearCliente, CrearPaquete, CrearConsumo } = require("./factories");

describe("Apps Ilimitadas", () => {
    test("Un paquete con WhatsApp ilimitado no debe descontar MB al consumir esa app", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const whatsapp = new AplicacionIlimitada();
        const paquete = CrearPaquete(1, 100, 30, 200, whatsapp); 
        cliente.cargarSaldo(200);
        cliente.comprarPaquete(paquete);

        const consumoWA = CrearConsumo("datosMoviles", 500, new Date(), new Date(), whatsapp);
        cliente.usarRecursos(consumoWA);

        expect(cliente.obtenerPaqueteContratado().obtenerInfo().datosMoviles).toBe(1);
    });
    test("Un consumo de una app NO ilimitada debe descontar MB normalmente", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const instagram = new AplicacionEstandar();
        const paquete = CrearPaquete(1, 100, 30, 200, instagram);
        cliente.cargarSaldo(200);
        cliente.comprarPaquete(paquete);

        const consumoIG = CrearConsumo("datosMoviles", 512, new Date(), new Date(), instagram);
        cliente.usarRecursos(consumoIG);

        expect(cliente.obtenerPaqueteContratado().obtenerInfo().datosMoviles).toBe(0.5);
    });
});

describe("Préstamos de Datos y Minutos de llamada", () => {
    test("Un cliente puede regalar datos a otro si el receptor tiene su plan agotado", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 30, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024); 
        
        expect(emisor.obtenerPaqueteContratado().obtenerInfo().datosMoviles).toBe(4);
        expect(receptor.obtenerPaqueteContratado().obtenerInfo().datosMoviles).toBe(1);
    });

    test("No se puede realizar un regalo si el receptor tiene un plan vigente con recursos", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);

        emisor.cargarSaldo(500);
        emisor.comprarPaquete(CrearPaquete(5, 1000, 30, 500));
        receptor.cargarSaldo(500);
        receptor.comprarPaquete(CrearPaquete(2, 500, 30, 300));

        expect(() => {
            emisor.regalarRecursos(receptor, "datosMoviles", 1);
        }).toThrow("El receptor tiene un plan vigente. Solo puede recibir regalos si su plan está agotado o vencido."); 
    });

    test("No se puede realizar un regalo si el emisor no tiene un plan vigente con recursos", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);

        expect(() => {
            emisor.regalarRecursos(receptor, "datosMoviles", 1);
        }).toThrow("No tienes un paquete activo para realizar un regalo."); 
    });

    test("Un cliente puede regalar minutos de llamada a otro si el receptor tiene su plan agotado", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 30, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "minutosLlamada", 200); 
        
        expect(emisor.obtenerPaqueteContratado().obtenerInfo().minutosLlamada).toBe(800);
        expect(receptor.obtenerPaqueteContratado().obtenerInfo().minutosLlamada).toBe(200);
    });

    test("El préstamo queda registrado ", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 5, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024);

        expect(emisor.obtenerHistorialPrestamos()[0].detalle).toEqual("De Maria Lopez a Jorge Damasco");
        expect(emisor.obtenerHistorialPrestamos()[0].fecha).toBeInstanceOf(Date);
    });

    test("El préstamo queda registrado en una lista sobre prestamos", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 5, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024);
        receptor.usarRecursos(CrearConsumo("datosMoviles", 1*1024, new Date(), new Date()));
        
        emisor.regalarRecursos(receptor, "minutosLlamada", 200);

        expect(emisor.obtenerHistorialPrestamos()[0].detalle).toEqual("De Maria Lopez a Jorge Damasco");
        expect(emisor.obtenerHistorialPrestamos()[0].tipo).toBe("datosMoviles");
        expect(emisor.obtenerHistorialPrestamos()[0].cantidad).toBe(1024);
        expect(emisor.obtenerHistorialPrestamos()[1].detalle).toEqual("De Maria Lopez a Jorge Damasco");
        expect(emisor.obtenerHistorialPrestamos()[1].tipo).toBe("minutosLlamada");
        expect(emisor.obtenerHistorialPrestamos()[1].cantidad).toBe(200);
        
    });

    test("El préstamo queda registrado en una lista sobre prestamos", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 5, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024);
        receptor.usarRecursos(CrearConsumo("datosMoviles", 1*1024, new Date(), new Date()));
        
        emisor.regalarRecursos(receptor, "minutosLlamada", 200);

        expect(emisor.obtenerHistorialPrestamos()[0].detalle).toEqual("De Maria Lopez a Jorge Damasco");
        expect(emisor.obtenerHistorialPrestamos()[0].tipo).toBe("datosMoviles");
        expect(emisor.obtenerHistorialPrestamos()[0].cantidad).toBe(1024);
        expect(emisor.obtenerHistorialPrestamos()[1].detalle).toEqual("De Maria Lopez a Jorge Damasco");
        expect(emisor.obtenerHistorialPrestamos()[1].tipo).toBe("minutosLlamada");
        expect(emisor.obtenerHistorialPrestamos()[1].cantidad).toBe(200);
        
    });

    test("El préstamo debe tener la misma fecha de vencimiento que el plan del emisor", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 5, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024);

        const infoPrestamo = receptor.obtenerPaqueteContratado().obtenerInfo();
        expect(infoPrestamo.diasDuracion).toBe(5);
    });



});