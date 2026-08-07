const ReceivingState = require("./ReceivingState");
const Assignment = require("./Assignment");


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
        
       
        //ISSUE 4
        // La sesión solamente conoce su estado actual.
        this._state = new ReceivingState();

        // Estrategia utilizada para decidir qué papers son aceptados.
       // Inicialmente conserva el comportamiento existente.
        this._acceptancePolicy = new AcceptanceByPercentage(100);

    }


    
    //Patrón State
        setState(state){
            this._state = state;
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
    


    // Delega el cambio de etapa al estado actual.
    closeSubmissions(){
        
        return this._state.closeSubmissions(this);

    }
    
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
    
                
                this._assignments.push(
                    new Assignment(paper, reviewer)
                );
    
            }
        }
    

        
    }

    //session conoce el dominio y sabe asignar reviewers. 
    //El patrón State solamente decide cuándo esa operación está permitida y
    // cuál es la siguiente etapa.
    assignReviewers(){

        this._state.assignReviewers(this);
    
    }

   


        reviewersFor(paper) {

            let assignmentsForPaper = this._assignments.filter(
                (assignment) => assignment.paper() == paper
            );
        
            return assignmentsForPaper.map(
                (assignment) => assignment.reviewer()
            );
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