export function calcularMACD(precios, corto = 12, largo = 26, señal = 9) {
    // Validar entrada
    if (!Array.isArray(precios) || precios.length < largo) {
        return "Error: Se necesita un array con al menos " + largo + " precios";
    }

    // Función para calcular EMA
    function calcularEMA(precios, periodo) {
        const k = 2 / (periodo + 1); // Factor de suavizado
        let ema = [];
        ema[0] = precios[0]; // Primer valor es el precio inicial

        for (let i = 1; i < precios.length; i++) {
            ema[i] = precios[i] * k + ema[i - 1] * (1 - k);
        }
        return ema;
    }

    // Calcular EMAs
    const emaCorto = calcularEMA(precios, corto);
    const emaLargo = calcularEMA(precios, largo);

    // Calcular Línea MACD
    let macdLine = [];
    for (let i = 0; i < precios.length; i++) {
        if (i < largo - 1) {
            macdLine.push(null); // No hay suficiente data aún
        } else {
            macdLine.push(emaCorto[i] - emaLargo[i]);
        }
    }

    // Calcular Línea Señal (EMA de la Línea MACD)
    let signalLine = [];
    const macdParaSignal = macdLine.slice(largo - 1); // Valores válidos de MACD
    const emaSignal = calcularEMA(macdParaSignal, señal);

    // Rellenar con null hasta tener suficiente data para la señal
    for (let i = 0; i < largo - 1; i++) {
        signalLine.push(null);
    }
    for (let i = 0; i < señal - 1; i++) {
        signalLine.push(null);
    }
    signalLine = signalLine.concat(emaSignal);

    // Calcular Histograma
    let histograma = [];
    for (let i = 0; i < precios.length; i++) {
        if (signalLine[i] === null || macdLine[i] === null) {
            histograma.push(null);
        } else {
            histograma.push(macdLine[i] - signalLine[i]);
        }
    }

    // Devolver array de objetos con los tres valores
    let resultados = [];
    for (let i = 0; i < precios.length; i++) {
        resultados.push({
            macd: macdLine[i],
            señal: signalLine[i],
            histograma: histograma[i]
        });
    }

    return resultados;
}