const {Bid, Interests} = require("./Bid");

class Session{
    constructor(){
        this._name = "";
        this._programCommittee=[];
        this._papers=[];
        this._bids=[];
        this._assignments = []; //Reviewer assignment TEST
        this._stage="Receiving";
    }
    name(){
        return this._name;
    };
    programCommittee(){
        return this._programCommittee;
    };
    reviewers(){
        return this._programCommittee;
    };
    addReviewer(user){
        this._programCommittee.push(user);
    }
    canSubmit(paper){
        if (this.stage() == "Receiving" )
            return paper.isValid();
        else 
            return false;
    }
    submit(paper){
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        
        if (this.stage() == "Receiving" )
            this._papers.push(paper);
        else
            throw new Error("Cannot submit papers at this stage");
    }
    papers(){
        return this._papers;
    }
    bids(){
        return this._bids;
    }
    stage(){
        return this._stage;
    }
    setStage(stage){
        this._stage = stage;
    }
    closeSubmissions(){
        this.setStage("Bidding");
    }
    enterBid(paper, reviewer, interest){
        if (this.stage() == "Bidding" )
            if(this.bidExistsFor(paper, reviewer)){
                let existing =  this.bidFor(paper, reviewer);
                existing.setInterest(interest);
            }
            else{
                let bid = new Bid(paper, reviewer, interest);
                this._bids.push(bid);
            }
        else
            throw new Error("Cannot enter bids from the current stage.");
    }
    bidExistsFor(paper, reviewer){
        return typeof(this.bidFor(paper, reviewer)) != "undefined";
    }
    bidFor(paper, reviewer){
        return this._bids.find( (suspect) => (suspect.paper() == paper) && (suspect.reviewer()==reviewer) );
    }
    interestFor(paper, reviewer){
        return this.bidFor(paper, reviewer).interest();
    }

    
    assignReviewers(){

        // Recorre todos los papers enviados en la sesión
        for(let paper of this._papers){
    
            // Busca reviewers que hayan marcado Interested
            // para el paper actual
            let interestedReviewers = this._bids
    
                // Filtra bids:  del paper actual y  con interés Interested
                .filter( (bid) =>
                    bid.paper() == paper &&
                    bid.interest() == Interests.Interested
                )
    
                // Obtiene solamente el reviewer de cada bid
                .map( (bid) => bid.reviewer() );
        
    
            // Obtiene reviewers restantes del comité
            // que todavía no fueron seleccionados
            let remainingReviewers = this._programCommittee

              // Excluye autores del paper
                .filter( (reviewer) =>
                     !paper._authors.includes(reviewer)
                )
    
                // Filtra reviewers que NO estén dentro de los interesados
                .filter( (reviewer) =>
                    !interestedReviewers.includes(reviewer)
                );
        
            // Une:
            // 1. reviewers interesados
            // 2. reviewers restantes
            //
            // y toma solamente los primeros 3
            let assignedReviewers = interestedReviewers
                .concat(remainingReviewers)
                .slice(0,3);
    
           // Guarda las asignaciones reviewer-paper
            for(let reviewer of assignedReviewers){
    
                this._assignments.push({
                    paper: paper,
                    reviewer: reviewer
                });
    
            }
        }
    
        // Cambia la etapa de la sesión a Reviewing
        this.setStage("Reviewing");
    }


    
    reviewersFor(paper){
        let assignmentsForPaper = this._assignments.filter( (assignment) => assignment.paper == paper );
        return assignmentsForPaper.map( (assignment) => assignment.reviewer );
    }



    //Review submission  TEST (2)
    //el reviewer fue asignado
    //guardar review
    submitReview(paper, reviewer, reviewText, score){

        if(!this.reviewersFor(paper).includes(reviewer))
            throw new Error("Reviewer not assigned");
    
        paper.addReview(reviewer, reviewText, score);
    
    }


}

module.exports = Session;