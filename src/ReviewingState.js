const SessionState = require("./SessionState");
const SelectionState = require("./SelectionState");

// Estado donde los reviewers asignados pueden cargar sus reviews.
class ReviewingState extends SessionState{

    // Durante la etapa de revisión los reviewers asignados
    // pueden registrar sus evaluaciones.
    submitReview(session, paper, reviewer, reviewText, score){

        session.doSubmitReview(
            paper,
            reviewer,
            reviewText,
            score
        );

    }

    // Una vez finalizadas las revisiones se puede aplicar
    // la política de aceptación para obtener los papers aceptados.
    selectAcceptedPapers(session){

        // ReviewingState conoce directamente el siguiente estado.
        const selectionState = new SelectionState();
        session.setState(selectionState);

         // La selección se ejecuta ya bajo la responsabilidad
        // del nuevo estado.
        return selectionState.selectAcceptedPapers(session);
        

    }

}

module.exports = ReviewingState;