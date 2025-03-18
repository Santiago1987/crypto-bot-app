//HAY UNA LIBRERIA

// Clase para el Filtro de Kalman Extendido
class ExtendedKalmanFilter {
    constructor(initialState, initialCovariance, processNoise, measurementNoise) {
        this.x = initialState;      // Estado estimado (precio)
        this.P = initialCovariance; // Covarianza del estado
        this.Q = processNoise;      // Ruido del proceso
        this.R = measurementNoise;  // Ruido de la medición
    }

    // Función de transición no lineal: precio_t+1 = precio_t * exp(k * dt)
    f(x, dt) {
        const k = 0.01; // Tasa de crecimiento
        return x * Math.exp(k * dt);
    }

    // Jacobiano de la función de transición
    jacobianF(x, dt) {
        const k = 0.01;
        return Math.exp(k * dt);
    }

    // Función de observación: z_t = precio_t (identidad)
    h(x) {
        return x;
    }

    // Jacobiano de la función de observación (en este caso, es 1)
    jacobianH(x) {
        return 1;
    }

    // Predicción
    predict(dt) {
        // Predicción del estado
        const x_pred = this.f(this.x, dt);

        // Jacobiano
        const F = this.jacobianF(this.x, dt);

        // Predicción de la covarianza
        this.P = F * this.P * F + this.Q;

        // Actualizar estado predicho
        this.x = x_pred;
    }

    // Actualización con nueva medición
    update(measurement) {
        // Jacobiano de la observación
        const H = this.jacobianH(this.x);

        // Innovación (diferencia entre medición y predicción)
        const y = measurement - this.h(this.x);

        // Covarianza de la innovación
        const S = H * this.P * H + this.R;

        // Ganancia de Kalman
        const K = this.P * H / S;

        // Actualizar estado
        this.x = this.x + K * y;

        // Actualizar covarianza
        this.P = (1 - K * H) * this.P;
    }

    // Obtener estado actual
    getState() {
        return this.x;
    }
}

// Datos de ejemplo: serie de precios
const precios = [100, 101, 103, 102, 105];
const dt = 1.0; // Intervalo de tiempo

// Inicializar el EKF
const ekf = new ExtendedKalmanFilter(
    100.0,  // Estado inicial (precio inicial)
    10.0,   // Covarianza inicial
    0.1,    // Ruido del proceso
    5.0     // Ruido de la medición
);

// Filtrado de los datos
const estimaciones = [];
for (let i = 0; i < precios.length; i++) {
    ekf.predict(dt);           // Predicción
    ekf.update(precios[i]);    // Actualización con la medición
    estimaciones.push(ekf.getState()); // Guardar estimación
}

// Mostrar resultados
console.log("Precios originales:", precios);
console.log("Precios estimados:", estimaciones.map(x => x.toFixed(2)));

/*
Explicación del código
Clase ExtendedKalmanFilter:
Almacena el estado (x), la covarianza (P), y los ruidos (Q y R).

Define las funciones no lineales f (transición) y h (observación), junto con sus Jacobianos.

Función f:
Modela el precio con una tendencia exponencial: preciot+1=preciot⋅ek⋅Δtprecio_{t+1} = precio_t \cdot e^{k \cdot \Delta t}precio_{t+1} = precio_t \cdot e^{k \cdot \Delta t}
.

El Jacobiano (jacobianF) es la derivada de esta función: ek⋅Δte^{k \cdot \Delta t}e^{k \cdot \Delta t}
.

Función h:
Es la identidad (la observación es el precio mismo), y su Jacobiano es 1.

Predicción y actualización:
predict: Calcula el estado y la covarianza predichos usando la dinámica no lineal.

update: Corrige la predicción con la medición real usando la ganancia de Kalman.

Ejemplo:
Toma una serie de precios ([100, 101, 103, 102, 105]) y aplica el EKF para suavizarla y estimar la tendencia subyacente.


*/