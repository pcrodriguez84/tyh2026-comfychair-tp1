const AcceptancePolicy = require("./AcceptancePolicy");

// Acepta todos los papers cuyo score promedio
// alcance un valor mínimo configurable.
class AcceptanceByScoreThreshold extends AcceptancePolicy{

    constructor(minimumScore){
        super();

        // Puntaje mínimo requerido para aceptar un paper.
        this._minimumScore = minimumScore;
    }

    acceptedPapers(papers){

        // Devuelve todos los papers que cumplen
        // con el score mínimo configurado.
        return papers.filter(
            (paper) => paper.score() >= this._minimumScore
        );
    }
}

module.exports = AcceptanceByScoreThreshold;