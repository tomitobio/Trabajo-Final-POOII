"use strict";
const Cuenta = require("../src/cuenta");
describe("Gestión de Cuenta y Saldo del Cliente", () => {
    // TEST 1
    test("Una cuenta nueva se inicializa con saldo cero.", () => {
        const cuenta = new Cuenta("Juan Perez", "1122334455");
        
        expect(cuenta.obtenerSaldo()).toBe(0);
    });



    
});