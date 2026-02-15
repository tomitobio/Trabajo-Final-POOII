
const Aplicacion = function() {};

Aplicacion.prototype.debeCobrarConsumo = function() {
    return true; 
};
const AplicacionEstandar = function() {};
AplicacionEstandar.prototype = Object.create(Aplicacion.prototype);
AplicacionEstandar.prototype.constructor = AplicacionEstandar


const AplicacionIlimitada = function() {
    Aplicacion.call(this); 
};
AplicacionIlimitada.prototype = Object.create(Aplicacion.prototype);
AplicacionIlimitada.prototype.constructor = AplicacionIlimitada;
AplicacionIlimitada.prototype.debeCobrarConsumo = function() {
    return false;
};

module.exports = { AplicacionEstandar, AplicacionIlimitada };