const SessionState = require("./SessionState");

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

    // Finaliza la recepción de trabajos/papers y
    // habilita el período de bidding.
 
closeSubmissions(session){

    // Mantiene sincronizado el mecanismo anterior
    // mientras se completa la migración al patrón State.
    //Porque todavía hay métodos (enterBid, etc.) que preguntan:
    //this.stage()
    //Si no actualizamos _stage, esos métodos van a seguir creyendo que 
    //la sesión está en "Receiving".
    session.setStage("Bidding");

    // Cambia el estado actual de la sesión.
    session.setState(session.biddingState());
    }

}

module.exports = ReceivingState;