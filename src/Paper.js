const Review = require("./Review");

class Paper{
    constructor(title, authors, correspondingAuthor){
        if(!authors.includes(correspondingAuthor)) throw new Error("Corresponding author must be an author");
        this._title = title;
        this._reviews = [];
        this._authors = authors;
        this._correspondingAuthor = correspondingAuthor;
    }

    //Corrección Issue 1 TP1
    // Indica si el usuario recibido forma parte de la lista de autores.
    // Esta responsabilidad pertenece a Paper, ya que conoce quiénes son sus autores.
    isAuthor(user){
    return this._authors.includes(user);
    }

    title(){
        return this._title;
    }
    reviews(){
        return this._reviews;
    }
    isValid(){
        return (this._title !== "") && (this._authors.length > 0);
    }
    addReview(reviewer, review, score){
        if (this.reviewsCount() < this.constructor.allowedReviews)
            this._reviews.push(new Review(reviewer, review, score));
        else throw(new Error("Cannot allow any more reviews"))
    }
    reviewsCount(){
        return this.reviews().length;
    }
    score(){
        if (this.reviewsCount() > 0){
            let sum = this.reviews().reduce( (partialSum, review) => partialSum + review.score(), 0 );
            return sum / this.reviewsCount();
        }
        else 
            return 0;
    }
}

Paper.allowedReviews = 3;

module.exports = Paper;