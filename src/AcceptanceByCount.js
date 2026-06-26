const AcceptancePolicy = require("./AcceptancePolicy");

// Acepta una cantidad fija de papers.
// Siempre selecciona los papers con mejor score.
class AcceptanceByCount extends AcceptancePolicy{

    constructor(maxPapers){
        super();

        // Cantidad máxima de papers a aceptar.
        this._maxPapers = maxPapers;
    }

    acceptedPapers(papers){

        // Ordena los papers de mayor score a menor score.
        let orderedPapers = papers.sort(
            (paperA, paperB) => paperB.score() - paperA.score()
        );

        // Devuelve solamente los primeros N papers.
        return orderedPapers.slice(0, this._maxPapers);
    }
}

module.exports = AcceptanceByCount;