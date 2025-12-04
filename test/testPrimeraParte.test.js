"use strict";

// Asumimos que estas funciones las crearás en tu archivo "factories.js"
const { crearCliente, crearPaquete } = require("./factories");

describe("Gestión de Cuenta y Saldo del Cliente", () => {
    
    // TEST 1
    test("Una cuenta nueva se inicializa con saldo cero.", () => {
        const cliente = crearCliente("Juan Perez", "1122334455");
        
        expect(cliente.obtenerSaldo()).toBe(0);
    });

});