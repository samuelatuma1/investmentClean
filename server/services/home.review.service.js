const {Review} = require("../models/review.model.js");
const { Utils } =  require("../utils/utils.utils");

const ReviewDTO = {
    imageUrl: String || null,
    name: String,
    gender: ["male", "female"],
    review: String,
    country: String
}

const ReviewDTOWithIdx = {
    imageUrl: String || null,
    idx: Number,
    name: String,
    country: String,
    gender: ["male", "female"],
    review: String
}

const currentReviewImgUrlDTO = {
    age:Number,
    date_added:Date,
    filename:String,
    image_url:String
}

class IReviewService {
    /**
    * @desc creates reviews with imageUrl for reviews without imageUrl.
    * @param {Array<ReviewDTO>} reviews 
    * @returns {Promise<Review>}
    */
     addReviews = async (reviews) => {}

     /**
     * 
     * @returns {Promise<Review>}
     */
    getReviews = async () => {}
}

class ReviewService extends IReviewService {
    /**
     * adds an image url to each review 
     * @param {Array<ReviewDTOWithIdx>} reviews 
     * @param {Set<String>} existingImgUrls
     * @returns {Promise<Array<ReviewDTOWithIdx>>}
     */
    #getImageForReview = async (reviews /** Array<ReviewDTOWithIdx>*/, existingImgUrls /**Set */) /**Promise<Array<ReviewDTOWithIdx>> */=> {
        const url /** String */ = "https://fakeface.rest/face/json";

        for(let review /**ReviewDTOWithIdx */ of reviews){
            // Get image url from api
            const params /** { [Key: String]: any} */ = {
                gender: review.gender,
                minimum_age: 20,
                maximum_age: 60
            };
            const method /**String */= "GET"
            let currentReviewImgUrl /** currentReviewImgUrlDTO  */= await Utils.fetchData({
                method, url, params
            });
            if(currentReviewImgUrl !== null){
                const image_url /** String */ = currentReviewImgUrl.image_url
                while(existingImgUrls.has(image_url) ){
                    currentReviewImgUrl = await Utils.fetchData({
                        method, url, params
                    });
                }
                const imageUrl = currentReviewImgUrl.image_url
                existingImgUrls.add(imageUrl);

                // Include imageurl to current review
                review.imageUrl = imageUrl;
            } else{
                review.imageUrl = ""
            }
        }
        return reviews;
    }
    /**
     * 
     * @param {Array<ReviewDTO>} reviews 
     * @returns {Promise<Array<ReviewDTO>>}
     */
    #createReviewsWithImages = async (reviews /**Array<ReviewDTO> */) /** Array<Review> */=> {
        // Get all reviews without an imageUrl
        const cloned_reviews = reviews.slice();
        const idxWithoutImgUrls /**Array<ReviewDTOWithIdx> */ = [];
        const existingImgUrls /**Set */= new Set();
        for(let  i /**int */ = 0; i < reviews.length; i++){
            const review /**ReviewDTO */ = reviews[i];
            if(!review.imageUrl){
                review.idx = i;
                idxWithoutImgUrls.push(review);
            }
            else{
                existingImgUrls.add(review.imageUrl);
            }
        }

        const getImgUrlsForReviews /** Array<ReviewDTOWithIdx>*/ = await this.#getImageForReview(idxWithoutImgUrls, existingImgUrls);

        for(let reviewWithImg /**ReviewDTOWithIdx */ of getImgUrlsForReviews){
            const idxToReplace /**number */ = reviewWithImg.idx;
            delete reviewWithImg.idx;
            cloned_reviews[idxToReplace] = reviewWithImg;
        }
        return cloned_reviews.filter(review /**ReviewDTO */ => review.imageUrl);
    }

     /**
     * @desc creates reviews with imageUrl for reviews without imageUrl.
     * @param {Array<ReviewDTO>} reviews 
     * @returns {Promise<Review>}
     */
    addReviews = async (reviews /**Array<ReviewDTO> */) /**Review */ => {
        const reviewsWithImgs /** Array<Review> */= await this.#createReviewsWithImages(reviews);

        let reviewExists /** Review */= await Review.findOne();
        if(reviewExists !== null){
            await Review.deleteOne();
        }
        const newReviews /** Review */ = new Review({reviews: reviewsWithImgs});
        return await newReviews.save();
    }

    /**
     * 
     * @returns {Promise<Review>}
     */
    getReviews = async () => {
        return await Review.findOne();
    }


}

module.exports = {ReviewService, IReviewService};