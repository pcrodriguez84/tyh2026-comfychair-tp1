const SessionState = require("./SessionState");

// Estado donde se seleccionan los papers aceptados.
class SelectionState extends SessionState{

    // Durante la etapa de selección se aplica la política
    // configurada para obtener los papers aceptados.
    selectAcceptedPapers(session){

        return session.doSelectAcceptedPapers();

    }

}

module.exports = SelectionState;