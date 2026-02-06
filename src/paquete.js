const Paquete = function(datosMoviles, minutosLlamada, diasDuracion, costo) {
    this.validaciones = () => {
        if (datosMoviles < 0) {
        throw new Error("La cantidad de datos no puede ser negativa");
        }
        if (minutosLlamada < 0) {
            throw new Error("La cantidad de minutos de llamada no puede ser negativa");
        }
        if (diasDuracion < 0) {
            throw new Error("La cantidad de dias de duracion no puede ser negativa");
        }
        if (costo < 0) {
            throw new Error("La cantidad de costo no puede ser negativa");
        }
    }
    
    this.validaciones();
    this.datosMoviles = datosMoviles;
    this.minutosLlamada = minutosLlamada;
    this.diasDuracion = diasDuracion;
    this.costo = costo;

    // devuelve objeto manteniendo aislamiento
    this.obtenerInfo = () => {
        return {
            datosMoviles: this.datosMoviles,
            minutosLlamada: this.minutosLlamada,
            diasDuracion: this.diasDuracion,
            costo: this.costo
        };
    };


};

module.exports = Paquete;
