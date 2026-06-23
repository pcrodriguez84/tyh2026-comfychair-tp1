// Clase base para todas las políticas de aceptación.
// Define el protocolo que deben implementar las políticas concretas.

class AcceptancePolicy{
    // Devuelve los papers aceptados según la estrategia utilizada.
    acceptedPapers(papers){
        throw new Error("Must implement");
    }
}

module.exports = AcceptancePolicy;