"use strict";

const { CrearCliente, CrearPaquete, CrearConsumo } = require("./factories");

describe("Segunda Parte: Apps Ilimitadas", () => {
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
        const cliente = CrearCliente("Luis", 11223344);
        const paquete = CrearPaquete(1, 100, 30, 200, "WhatsApp");
        cliente.cargarSaldo(200);
        cliente.comprarPaquete(paquete);

        // Consumo de Instagram (no es ilimitada en este paquete)
        const consumoIG = CrearConsumo("datosMoviles", 512, new Date(), new Date(), "Instagram");
        cliente.usarRecursos(consumoIG);

        expect(cliente.obtenerPaquetesContratados()[0].obtenerInfo().datosMoviles).toBe(0.5);
    });
});