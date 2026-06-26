const SessionState = require("./SessionState");

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

        return session.doSelectAcceptedPapers();

    }

}

module.exports = ReviewingState;