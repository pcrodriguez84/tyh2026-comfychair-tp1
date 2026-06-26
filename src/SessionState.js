// Clase base para representar los distintos estados de una sesión.
// Por defecto ninguna operación está permitida.
// Cada estado concreto sobrescribirá únicamente las operaciones válidas.

class SessionState {

    // Por defecto un paper no puede enviarse.
    // Cada estado concreto decidirá si lo permite.
    canSubmit(session, paper){
        return false;
    }

    submit(session, paper){
        throw new Error("Cannot submit papers at this stage");
    }

    closeSubmissions(session){
        throw new Error("Operation not allowed at this stage");
    }

    enterBid(session, paper, reviewer, interest){
        throw new Error("Cannot enter bids from the current stage.");
    }

    assignReviewers(session){
        throw new Error("Cannot assign reviewers at this stage.");
    }

    submitReview(session, paper, reviewer, reviewText, score){
        throw new Error("Cannot submit reviews at this stage.");
    }

    selectAcceptedPapers(session){
        throw new Error("Cannot select accepted papers at this stage.");
    }

}

module.exports = SessionState;