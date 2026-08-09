const ReceivingState = require("./ReceivingState");
const Assignment = require("./Assignment");
const Paper = require("./Paper");


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



// Devuelve la prioridad de un reviewer para un paper.
// Un valor menor representa una preferencia mayor.
// Si no existe un bid, el TP1 indica que se considera NotInterested.
assignmentPriorityFor(paper, reviewer){

    let bid = this.bidFor(paper, reviewer);

    if(typeof(bid) == "undefined")
        return 2;

    if(bid.interest() == Interests.Interested)
        return 0;

    if(bid.interest() == Interests.Maybe)
        return 1;

    return 2;
}

doAssignReviewers(){

    const totalAssignments = this._papers.length * Paper.allowedReviews;
    const reviewerCount = this._programCommittee.length;

    if(totalAssignments == 0)
        return;

    if(reviewerCount == 0)
        throw new Error("Cannot assign reviewers without a program committee");


    // Calcula la carga correspondiente a cada reviewer.
    //
    // Ejemplo:
    // 10 papers * 3 = 30 asignaciones
    // 30 / 7 = 4 con resto 2
    //
    // Capacidades:
    // [5, 5, 4, 4, 4, 4, 4]

    const baseLoad =
        Math.floor(totalAssignments / reviewerCount);

    const remainder =
        totalAssignments % reviewerCount;


    let capacityByReviewer = new Map();
    let assignmentsByReviewer = new Map();


    // Inicializa capacidad y carga actual.
    for(let i = 0; i < reviewerCount; i++){

        let reviewer =
            this._programCommittee[i];

        let capacity =
            baseLoad +
            (i < remainder ? 1 : 0);

        capacityByReviewer.set(
            reviewer,
            capacity
        );

        assignmentsByReviewer.set(
            reviewer,
            0
        );
    }


    // Recorre todos los papers.
    for(let paper of this._papers){

        let candidates =
            this._programCommittee

                // Un autor no puede revisar su propio paper.
                .filter(
                    (reviewer) =>
                        !paper.isAuthor(reviewer)
                )

                // Sólo considera reviewers que todavía
                // tengan capacidad disponible.
                .filter(
                    (reviewer) =>
                        assignmentsByReviewer.get(reviewer)
                        <
                        capacityByReviewer.get(reviewer)
                );


        // Ordena primero por prioridad del Bid:
        //
        // Interested > Maybe > NotInterested
        //
        // Dentro del mismo nivel de interés se prioriza
        // al reviewer con menor carga actual.
        //
        // Ante empate se conserva el orden original
        // del comité.

        candidates.sort(
            (reviewerA, reviewerB) => {

                let priorityDifference =
                    this.assignmentPriorityFor(
                        paper,
                        reviewerA
                    )
                    -
                    this.assignmentPriorityFor(
                        paper,
                        reviewerB
                    );

                if(priorityDifference != 0)
                    return priorityDifference;


                let loadDifference =
                    assignmentsByReviewer.get(reviewerA)
                    -
                    assignmentsByReviewer.get(reviewerB);

                if(loadDifference != 0)
                    return loadDifference;


                return this._programCommittee
                    .indexOf(reviewerA)
                    -
                    this._programCommittee
                    .indexOf(reviewerB);
            }
        );


        let assignedReviewers =
            candidates.slice(0, Paper.allowedReviews);


        // Registra las asignaciones.
        for(let reviewer of assignedReviewers){

            this._assignments.push(
                new Assignment(
                    paper,
                    reviewer
                )
            );

            assignmentsByReviewer.set(
                reviewer,
                assignmentsByReviewer.get(reviewer) + 1
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