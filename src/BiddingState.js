const SessionState = require("./SessionState");
const {Bid} = require("./Bid");

// Estado donde los reviewers pueden cargar bids
// y luego se realiza la asignación de revisores.
class BiddingState extends SessionState{

    // Durante la etapa de bidding se permite registrar
   // o actualizar el interés de un reviewer por un paper.
    enterBid(session, paper, reviewer, interest){

        if(session.bidExistsFor(paper, reviewer)){

            let existing = session.bidFor(paper, reviewer);
            existing.setInterest(interest);

        }
        else{

            let bid = new Bid(paper, reviewer, interest);
            session._bids.push(bid);

        }

    }

    // Durante el bidding se permite realizar la asignación
    // de reviewers a los papers enviados.
        assignReviewers(session){

            session.doAssignReviewers();

            // Finaliza el bidding y comienza la etapa de revisión.
            //Si no actualizamos _stage, esos métodos van a seguir creyendo que 
            //la sesión está en "Bidding".
            session.setStage("Reviewing");
            session.setState(
                session.reviewingState()
            );

        }

}

module.exports = BiddingState;