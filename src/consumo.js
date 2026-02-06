const Consumo = function(tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin) {
    this.tipo = tipoConsumo;
    this.cantidad = cantidadConsumida;
    this.inicio = fechaDeInicio;
    this.fin = fechaDeFin;

    this.usoDeRecurso = () => {
        const cantidadRecurso = this.cantidad;
        const cantidadDias = Math.ceil((this.fin - this.inicio) / (1000 * 60 * 60 * 24));
        const tipoConsumo = this.tipo;

        return [cantidadRecurso, cantidadDias, tipoConsumo];
    };

    this.obtenerInfo = () => {
        return {
            tipo: this.tipo,
            cantidad: this.cantidad,
            inicio: this.inicio,
            fin: this.fin
        };
    };
}

module.exports = Consumo