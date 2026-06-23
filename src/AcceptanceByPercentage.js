const AcceptancePolicy = require("./AcceptancePolicy");

// Política de aceptación original del TP1.
// Acepta un porcentaje configurable de los papers mejor puntuados.
class AcceptanceByPercentage extends AcceptancePolicy{

    constructor(percentage){
        super();
        // Porcentaje máximo de papers a aceptar.
        this._percentage = percentage;
    }

    acceptedPapers(papers){

         // Ordena los papers por score de mayor a menor.
        let orderedPapers = papers.sort(
            (paperA, paperB) => paperB.score() - paperA.score()
        );

         // Calcula cuántos papers deben aceptarse.
        let acceptedCount = Math.ceil(
            orderedPapers.length * this._percentage / 100
        );

        // Devuelve únicamente los mejores papers.
        return orderedPapers.slice(0, acceptedCount);
    }
}

module.exports = AcceptanceByPercentage;