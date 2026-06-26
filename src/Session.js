const ReceivingState = require("./ReceivingState");
const BiddingState = require("./BiddingState");
const ReviewingState = require("./ReviewingState");
const SelectionState = require("./SelectionState");

const {Bid, Interests} = require("./Bid");


// Política de aceptación por defecto.
// Mantiene el comportamiento original del TP1.
const AcceptanceByPercentage =
    require("./AcceptanceByPercentage");

class Session{
    constructor(){
        this._name = "";
        this._programCommittee=[];
        this._papers=[];
        this._bids=[];
        this._assignments = []; //Reviewer assignment TEST
        //this._stage="Receiving";

        //commit 3
        // Instancias de los distintos estados de la sesión.
        // Se crean una sola vez y se reutilizan durante todo el ciclo de vida.
        this._receivingState = new ReceivingState();
        this._biddingState = new BiddingState();
        this._reviewingState = new ReviewingState();
        this._selectionState = new SelectionState();

        // La sesión comienza en estado Receiving.
        this._state = this._receivingState;

        // Estrategia utilizada para decidir qué papers son aceptados.
       // Inicialmente conserva el comportamiento existente.
        this._acceptancePolicy = new AcceptanceByPercentage(100);

    }


    // Los 5 métodos que siguen cambian el estado actual de la sesión.
    //Patrón State
        setState(state){
            this._state = state;
        }

        receivingState(){
            return this._receivingState;
        }

        biddingState(){
            return this._biddingState;
        }

        reviewingState(){
            return this._reviewingState;
        }

        selectionState(){
            return this._selectionState;
        }    

    // Permite cambiar dinámicamente la política de aceptación
    // sin modificar el resto de la sesión.
    setAcceptancePolicy(policy){
        this._acceptancePolicy = policy;
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

    /*
    Método utilizado en la implementación anterior.
    Deja de ser necesario al aplicar State, ya que el propio
    estado decide si una operación está permitida.


    canSubmit(paper){
        if (this.stage() == "Receiving" )
            return paper.isValid();
        else 
            return false;
    }*/

    /*
    submit(paper){
        if (!this.canSubmit(paper)) throw new Error("Cannot submit invalid paper");
        
        if (this.stage() == "Receiving" )
            this._papers.push(paper);
        else
            throw new Error("Cannot submit papers at this stage");
    }*/

    
    // La consulta se delega al estado actual.
    canSubmit(paper){
        return this._state.canSubmit(this, paper);
    }

    // La responsabilidad de decidir si un paper puede enviarse
    // queda delegada al estado actual de la sesión.
   
    submit(paper){
     this._state.submit(this, paper);
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
    // Delega el cambio de etapa al estado actual.
    closeSubmissions(){
        //this.setStage("Bidding");
        return this._state.closeSubmissions(this);

    }
    /*
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
    }*/

    // Delega al estado actual la decisión de registrar un bid.
        enterBid(paper, reviewer, interest){

            this._state.enterBid(
                this,
                paper,
                reviewer,
                interest
            );

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

    
    //assignReviewers(){
        doAssignReviewers(){

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
              //  .filter( (reviewer) =>
                //     !paper._authors.includes(reviewer)
                //)

                //Corrección Issue 1 TP1
                // Excluye de la revisión a los autores del paper.
                // Session delega la consulta al propio Paper para evitar
                // acceder directamente a sus atributos internos.
                .filter( (reviewer) =>
                    !paper.isAuthor(reviewer)
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
        //lo hace biddingstate
       // this.setStage("Reviewing");
    }

    //session conoce el dominio y sabe asignar reviewers. 
    //El patrón State solamente decide cuándo esa operación está permitida y
    // cuál es la siguiente etapa.
    assignReviewers(){

        this._state.assignReviewers(this);
    
    }

   


    
    reviewersFor(paper){
        let assignmentsForPaper = this._assignments.filter( (assignment) => assignment.paper == paper );
        return assignmentsForPaper.map( (assignment) => assignment.reviewer );
    }



    //Review submission  TEST (2)
    //el reviewer fue asignado
    //guardar review

    /*
    submitReview(paper, reviewer, reviewText, score){

        if(!this.reviewersFor(paper).includes(reviewer))
            throw new Error("Reviewer not assigned");
    
        paper.addReview(reviewer, reviewText, score);
    
    }*/

        // El estado actual decide si una review puede cargarse.
        submitReview(paper, reviewer, reviewText, score){

            this._state.submitReview(
                this,
                paper,
                reviewer,
                reviewText,
                score
            );

        }

        // Implementa la lógica de negocio para registrar una review.
        // Es invocado únicamente cuando el estado actual lo permite.
        doSubmitReview(paper, reviewer, reviewText, score){

            if(!this.reviewersFor(paper).includes(reviewer))
                throw new Error("Reviewer not assigned");

            paper.addReview(reviewer, reviewText, score);

        }

    /*
    selectAcceptedPapers(acceptancePercentage){

        // Ordena papers de mayor score a menor score
        let orderedPapers = this._papers.sort(
            (paperA, paperB) => paperB.score() - paperA.score()
        );
    
        // Calcula cantidad máxima de papers aceptados
        let acceptedCount = Math.ceil(
            orderedPapers.length * acceptancePercentage / 100
        );
    
        // Devuelve solamente los mejores papers
        return orderedPapers.slice(0, acceptedCount);
    
    }*/

        // Delega la decisión de aceptación a la política configurada.
        // Session deja de conocer los detalles de cada algoritmo.
       /* selectAcceptedPapers(){

            return this._acceptancePolicy
                .acceptedPapers(this._papers);
        
        }*/

        // El estado actual decide cuándo puede realizarse
        // la selección de papers aceptados.
        selectAcceptedPapers(){

            return this._state.selectAcceptedPapers(this);

        }

        // Ejecuta la política de aceptación configurada.
        // La decisión de cuándo puede invocarse queda
        // delegada al estado actual.
        doSelectAcceptedPapers(){

            return this._acceptancePolicy
                .acceptedPapers(this._papers);

        }


}

module.exports = Session;