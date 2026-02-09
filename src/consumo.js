const Consumo = function(tipoConsumo, cantidadConsumida, fechaDeInicio, fechaDeFin, appConsumida = null) {
    this.tipo = tipoConsumo;
    this.cantidad = cantidadConsumida;
    this.inicio = fechaDeInicio;
    this.fin = fechaDeFin;
    this.app = appConsumida;

    this.usoDeRecurso = () => {
        const cantidadRecurso = this.cantidad;
        const cantidadDias = Math.ceil((this.fin - this.inicio) / (1000 * 60 * 60 * 24));
        const tipoConsumo = this.tipo;
        const appConsumida = this.app;

        return [cantidadRecurso, cantidadDias, tipoConsumo, appConsumida];
    };

    this.obtenerInfo = () => {
        return {
            tipo: this.tipo,
            cantidad: this.cantidad,
            inicio: this.inicio,
            fin: this.fin,
            app: this.app
        };
    };
}

module.exports = Consumo;