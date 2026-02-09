"use strict";

const { CrearCliente, CrearPaquete, CrearConsumo } = require("./factories");

describe("Apps Ilimitadas", () => {
    test("Un paquete con WhatsApp ilimitado no debe descontar MB al consumir esa app", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(1, 100, 30, 200, "WhatsApp"); 
        cliente.cargarSaldo(200);
        cliente.comprarPaquete(paquete);

        const consumoWA = CrearConsumo("datosMoviles", 500, new Date(), new Date(), "WhatsApp");
        cliente.usarRecursos(consumoWA);

        expect(cliente.obtenerPaquetesContratados()[0].obtenerInfo().datosMoviles).toBe(1);
    });
    test("Un consumo de una app NO ilimitada debe descontar MB normalmente", () => {
        const cliente = CrearCliente("Maria Lopez", 1132096752);
        const paquete = CrearPaquete(1, 100, 30, 200, "WhatsApp");
        cliente.cargarSaldo(200);
        cliente.comprarPaquete(paquete);

        const consumoIG = CrearConsumo("datosMoviles", 512, new Date(), new Date(), "Instagram");
        cliente.usarRecursos(consumoIG);

        expect(cliente.obtenerPaquetesContratados()[0].obtenerInfo().datosMoviles).toBe(0.5);
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
        
        expect(emisor.obtenerPaquetesContratados()[0].obtenerInfo().datosMoviles).toBe(4);
        expect(receptor.obtenerPaquetesContratados()[0].obtenerInfo().datosMoviles).toBe(1);
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
        
        expect(emisor.obtenerPaquetesContratados()[0].obtenerInfo().minutosLlamada).toBe(800);
        expect(receptor.obtenerPaquetesContratados()[0].obtenerInfo().minutosLlamada).toBe(200);
    });

    test("El préstamo debe tener la misma fecha de vencimiento que el plan del emisor", () => {
        const emisor = CrearCliente("Maria Lopez", 1132096752);
        const receptor = CrearCliente("Jorge Damasco", 1132096753);
        
        const paquete = CrearPaquete(5, 1000, 5, 500);
        emisor.cargarSaldo(500);
        emisor.comprarPaquete(paquete);

        emisor.regalarRecursos(receptor, "datosMoviles", 1*1024);

        const infoPrestamo = receptor.obtenerPaquetesContratados()[0].obtenerInfo();
        expect(infoPrestamo.diasDuracion).toBe(5);
    });

});