//RSI
export function calcularRSI(precios, periodoRSI = 14, periodoMediaMovil = 14) {
    // Validar entrada
    if (!Array.isArray(precios) || precios.length < periodoRSI + 1) {
        return "Error: Se necesita un array con al menos " + (periodoRSI + 1) + " precios";
    }

    // Arrays para almacenar ganancias y pérdidas
    let ganancias = [];
    let perdidas = [];

    // Calcular cambios diarios
    for (let i = 1; i < precios.length; i++) {
        const cambio = precios[i] - precios[i - 1];
        ganancias.push(cambio > 0 ? cambio : 0);
        perdidas.push(cambio < 0 ? Math.abs(cambio) : 0);
    }

    // Array para almacenar los resultados
    let resultados = [];

    // Calcular primer promedio (simple) para el período inicial del RSI
    let sumaGanancias = ganancias.slice(0, periodoRSI).reduce((a, b) => a + b, 0);
    let sumaPerdidas = perdidas.slice(0, periodoRSI).reduce((a, b) => a + b, 0);

    let promedioGanancia = sumaGanancias / periodoRSI;
    let promedioPerdida = sumaPerdidas / periodoRSI;

    let rs = promedioPerdida === 0 ? Infinity : promedioGanancia / promedioPerdida;
    let rsiInicial = rs === Infinity ? 100 : 100 - (100 / (1 + rs));

    // Añadir valores iniciales (sin RSI ni media móvil completa)
    for (let i = 0; i < periodoRSI; i++) {
        resultados.push({ rsi: null, mediaMovil: null });
    }
    resultados.push({ rsi: rsiInicial, mediaMovil: null });

    // Calcular RSI para los siguientes períodos y almacenar valores
    let valoresRSI = [rsiInicial];
    for (let i = periodoRSI; i < ganancias.length; i++) {
        promedioGanancia = (promedioGanancia * (periodoRSI - 1) + ganancias[i]) / periodoRSI;
        promedioPerdida = (promedioPerdida * (periodoRSI - 1) + perdidas[i]) / periodoRSI;

        rs = promedioPerdida === 0 ? Infinity : promedioGanancia / promedioPerdida;
        const rsiActual = rs === Infinity ? 100 : 100 - (100 / (1 + rs));
        valoresRSI.push(rsiActual);
        resultados.push({ rsi: rsiActual, mediaMovil: null });
    }

    // Calcular media móvil simple sobre los valores RSI
    for (let i = periodoRSI + periodoMediaMovil - 1; i < resultados.length; i++) {
        const ventana = valoresRSI.slice(i - periodoMediaMovil + 1, i + 1);
        const mediaMovil = ventana.reduce((a, b) => a + b, 0) / periodoMediaMovil;
        resultados[i].mediaMovil = mediaMovil;
    }

    return resultados;
}
