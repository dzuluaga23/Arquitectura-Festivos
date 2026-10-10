function obtenerDomingoRamos(anio) {
    const a = anio % 19;
    const b = anio % 4;
    const c = anio % 7;
    const d = (19 * a + 24) % 30;

    const dias = d + (2 * b + 4 * c + 6 * d + 5) % 7;

    let dia = 15 + dias;
    let mes = 3;
    if (dia > 31) {
        mes = 4;
        dia = dia - 31;
    }

    return new Date(anio, mes - 1, dia);
}

function agregarDias(fecha, dias) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
}

function siguienteLunes(fecha) {
    const nuevaFecha = new Date(fecha);
    const diaSemana = nuevaFecha.getDay();
    let diasParaLunes = 0;
    if (diaSemana != 1) {
        diasParaLunes = 1 + (7 - diaSemana) % 7;
    }
    return agregarDias(fecha, diasParaLunes);

}

module.exports = {
    obtenerDomingoRamos,
    agregarDias,
    siguienteLunes
}
