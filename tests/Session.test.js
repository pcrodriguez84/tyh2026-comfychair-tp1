const Session = require("../src/Session");
const User = require("../src/User");
const Paper = require("../src/Paper");
const {Bid, Interests} = require("../src/Bid");

let newSession;
let asse;
let juan, julian, matias;
let paper01, paper02, paper03;

beforeEach( ()=> {
    newSession = new Session();
    asse = new Session();
    juan = new User("Juan Gardey", "LIFIA, UNLP", "jgardey@lifia.ar", "123");
    julian = new User("Julián Grigera", "LIFIA, UNLP", "jgrigera@lifia.ar", "123");
    matias = new User("Matias Urbieta", "LIFIA, UNLP", "murbieta@lifia.ar", "123");
    paper01 = new Paper("A new approach on something", [juan, julian], juan);
    paper02 = new Paper("Another approach on something else", [matias, julian], matias);
    paper03 = new Paper("Yet another approach on something", [juan, matias], juan);
});

describe("A new Session", () =>{              //TITULO
    it("should have an empty name", ()=> {    //LO QUE DEBERIA PASAR
        expect(newSession.name()).toBe("");   //RESULTADO ESPERADO  El nombre debería ser "".
    })

    it("should have an empty Program Committee", ()=>{  //LO QUE DEBERIA PASAR
        expect(newSession.programCommittee()).toHaveLength(0);   //RESULTADO ESPERADO
    })
})
 
describe("A Session", ()=>{
    it("should be able to add PC members.", ()=>{
        asse.addReviewer(juan);
        expect(asse.reviewers()).toContain(juan);
        expect(asse.reviewers()).toHaveLength(1);
    })
    it("should allow paper submissions", ()=>{
        expect(asse.canSubmit(paper01)).toBe(true);
        asse.submit(paper01);
        expect(asse.papers()).toContain(paper01);
    })
})

//Bidding process: Proceso de asignación (o selección).
//Session: Sesión (grupo de artículos o área temática).
//Receive bids: Recibir ofertas / Recibir propuestas.

//TESTS SIEMPRE TIENEN (El test verifica comportamiento)
//1. Preparación
//2. Acción
//3. Verificación

//Qué prepara
//Qué ejecuta
//Qué verifica

describe("During the bidding process, a Session", ()=>{  //Durante el proceso de selección, una sesion (articulo), deberia recibir propuestas.
    it("should receive bids", ()=>{
        asse.closeSubmissions();  //la session pasa a bidding (preparación)
        asse.enterBid(paper02, juan, Interests.Interested); // Juan Carga interés
        expect(asse.bidExistsFor(paper02, juan)).toBe(true); // Verificamos que el Bid exista
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Interested); // verificamos
    })
    it("should allow overriding bids", ()=>{
        asse.closeSubmissions();
        asse.enterBid(paper02, juan, Interests.Interested);
        const secondBid = () => {asse.enterBid(paper02, juan, Interests.Maybe)};
        expect(secondBid).not.toThrow();
        expect(asse.interestFor(paper02, juan)).toBe(Interests.Maybe);
        expect(asse.bids()).toHaveLength(1);
    })
    it("should not allow to receive submissions", ()=>{
        asse.closeSubmissions();
        expect(asse.canSubmit(paper01)).toBe(false);
    })
    it("should fail to receive submissions", ()=>{
        asse.closeSubmissions();
        let submission = ()=>{asse.submit(paper01)};
        expect(submission).toThrow();
    })
})

//Reviewer assignment TEST  (1)
describe("Reviewer assignment", ()=>{
    it("should assign exactly three reviewers to each paper", ()=>{
        let reviewer1 = new User("Reviewer 1", "UNLP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UNLP", "r2@test.com", "123");
        let reviewer3 = new User("Reviewer 3", "UNLP", "r3@test.com", "123");

        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
        asse.addReviewer(reviewer3);

        asse.submit(paper01);
        asse.closeSubmissions();

        asse.assignReviewers();

        expect(asse.reviewersFor(paper01)).toHaveLength(3);
        expect(asse.reviewersFor(paper01)).toContain(reviewer1);
        expect(asse.reviewersFor(paper01)).toContain(reviewer2);
        expect(asse.reviewersFor(paper01)).toContain(reviewer3);
    })
})


//Review submission  TEST (2)
describe("Review submission", ()=>{

    //reviewer asignado puede revisar
    //review queda registrada 
    it("should allow assigned reviewers to submit reviews", ()=>{

        let reviewer1 = new User("Reviewer 1", "UP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UP", "r2@test.com", "123");
        let reviewer3 = new User("Reviewer 3", "UP", "r3@test.com", "123");

        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
        asse.addReviewer(reviewer3);

        asse.submit(paper01);

        asse.closeSubmissions();

        asse.assignReviewers();

        asse.submitReview(paper01, reviewer1, "Excellent paper", 3);

        expect(paper01.reviews()).toHaveLength(1);

        expect(paper01.score()).toBe(3);

    })


    //un reviewer NO asignado no puede revisar
    it("should not allow unassigned reviewers to submit reviews", ()=>{

        let reviewer1 = new User("Reviewer 1", "UP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UP", "r2@test.com", "123");
        let reviewer3 = new User("Reviewer 3", "UP", "r3@test.com", "123");
        let outsider = new User("Outsider", "UNLP", "out@test.com", "123");
    
        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
        asse.addReviewer(reviewer3);
    
        asse.submit(paper01);
    
        asse.closeSubmissions();
    
        asse.assignReviewers();
    
        let invalidReview = () => {
            asse.submitReview(paper01, outsider, "Bad review", 1);
        };
    
        expect(invalidReview).toThrow(); //significa espero que falle
    
    })

    //un paper no puede tener más de 3 reviews
    it("should not allow more than three reviews per paper", ()=>{

        let reviewer1 = new User("Reviewer 1", "UP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UP", "r2@test.com", "123");
        let reviewer3 = new User("Reviewer 3", "UP", "r3@test.com", "123");
    
        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
        asse.addReviewer(reviewer3);
    
        asse.submit(paper01);
    
        asse.closeSubmissions();
    
        asse.assignReviewers();
    
        asse.submitReview(paper01, reviewer1, "Review 1", 1);
        asse.submitReview(paper01, reviewer2, "Review 2", 2);
        asse.submitReview(paper01, reviewer3, "Review 3", 3);
    
        let extraReview = () => {
            asse.submitReview(paper01, reviewer1, "Extra review", 1);
        };
    
        expect(extraReview).toThrow();
    
    })

    //Si alguien marcó Interested, debería ser elegido y debería tener prioridad durante el proceso de selección.
    //TEST Prioridad de Bids
    it("should prioritize interested reviewers during assignment", ()=>{

          // Creamos cuatro reviewers
        let reviewer1 = new User("Reviewer 1", "UNLP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UNLP", "r2@test.com", "123");
        let reviewer3 = new User("Reviewer 3", "UNLP", "r3@test.com", "123");
        let reviewer4 = new User("Reviewer 4", "UNLP", "r4@test.com", "123");
    
        //se agregan riviewers al comite
        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
        asse.addReviewer(reviewer3);
        asse.addReviewer(reviewer4);
    
         // Se envía el paper a la sesión
        asse.submit(paper01);
    
        //sesion pasa a etapa de bidding
        asse.closeSubmissions();
    
        //Reviewer4 expresa interés en revisar paper01 mediante un bid Interested
        asse.enterBid(paper01, reviewer4, Interests.Interested);
        
        // Se ejecuta el proceso de asignación  de reviewers
        asse.assignReviewers();
    
         // Verificamos que reviewer4 haya sido asignado como reviewer del paper, debido a su interés
        expect(asse.reviewersFor(paper01)).toContain(reviewer4);
    
    })


    // TEST Un autor no pude revisar su propo paper
    it("should not assign authors as reviewers of their own papers", ()=>{

        
        //se crean 2 reviewers normales
        let reviewer1 = new User("Reviewer 1", "UNLP", "r1@test.com", "123");
        let reviewer2 = new User("Reviewer 2", "UNLP", "r2@test.com", "123");
    
         // Agregamos reviewers al comité
        // Juan también se agrega como reviewer, pero Juan es autor de paper01
        asse.addReviewer(juan);
        asse.addReviewer(reviewer1);
        asse.addReviewer(reviewer2);
    

        // Se envía el paper a la sesión, paper01 tiene a Juan como autor
        asse.submit(paper01);
    
         // La sesión pasa a etapa de bidding
        asse.closeSubmissions();
    
        // Se ejecuta el proceso de asignación de reviewers
        asse.assignReviewers();
    
         // Verificamos que Juan NO haya sido asignado como reviewer de su propio paper
         //la lista de reviewers NO debe contener a Juan
        expect(asse.reviewersFor(paper01)).not.toContain(juan);
    
    })

})