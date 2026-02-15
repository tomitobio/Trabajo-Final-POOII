
const Historial = function(campoFecha = 'fecha') {
    this.registros = [];
    this.campoFecha = campoFecha;

    this.agregar = (registro) => {
        this.registros.push(registro);
    };

    this.obtener = (filtro = null) => {
        let listado = [...this.registros].sort((a, b) => {
            return a[this.campoFecha] - b[this.campoFecha];
        });
        
        if (filtro && filtro.desde && filtro.hasta) {
            listado = listado.filter(item => {
                const fechaItem = item[this.campoFecha];
                return fechaItem >= filtro.desde && fechaItem <= filtro.hasta;
            });
        }

        return listado;
    };

};

module.exports = Historial;