"use strict";

const CrearCliente = require("./factories");

describe("Gestión de Cliente", () => {
    // TEST 1

   test("Se le asigna un nombre y numero de cuenta", () => {
    const cliente = CrearCliente("Maria Lopez", 1);
    
    expect(cliente.obtenerInfoCliente()).toEqual({
        nombre: "Maria Lopez",
        numeroCuenta: 1});
    });

   test("Debe asignar correctamente nombre y número de cuenta", () => {
    const cliente1 = CrearCliente("Maria Lopez", 1);
    const cliente2 = CrearCliente("Maria Cervantes", 2);
    
    expect(cliente1.obtenerInfoCliente()).toEqual({
        nombre: "Maria Lopez",
        numeroCuenta: 1});
    expect(cliente2.obtenerInfoCliente()).toEqual({
        nombre: "Maria Cervantes",
        numeroCuenta: 2});
    });

});