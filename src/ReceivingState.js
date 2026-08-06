const SessionState = require("./SessionState");
const BiddingState = require("./BiddingState");

// Estado inicial de una sesión.
// En esta etapa solamente se permite recibir papers
// y cerrar el período de recepción.
class ReceivingState extends SessionState{

    // Durante la etapa de recepción solamente se aceptan
    // papers válidos.
        canSubmit(session, paper){
        return paper.isValid();
    }

    // Permite incorporar un paper válido a la sesión.
    submit(session, paper){

        if(!paper.isValid())
            throw new Error("Cannot submit invalid paper");

        session._papers.push(paper);
    }

    
    //ISSUE 4  
    // Finaliza la recepción de trabajos/papers y
    // habilita el período de bidding.
 
    closeSubmissions(session){

        // ReceivingState conoce directamente cuál es el siguiente
        // estado del flujo.
        session.setState(
            new BiddingState()
        );
    }

}

module.exports = ReceivingState;