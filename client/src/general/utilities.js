class Utilities {
    /**
         * @desc greets according to the time of the day e.g good morning,
         * @returns {string}
     */
    static greet = () /** String */ => {
        const hour /** number */ = new Date().getHours();
        
        let greeting /** String */= "Good ";
        
        
        if(hour < 12)
            greeting += "morning,";
        else if(hour >= 12 && hour <= 15)
            greeting += "afternoon,";
        else if(hour  > 15 && hour <= 23)
            greeting += "evening,"; 
        else
            greeting += "day,";

        return greeting;
    }

    /**
     * 
     * @param {string} data  
     * @returns the first name from user Full name
     */
    static getFirstName = (data /** string */) /** string */ =>{
        const names /**string */ = data?.split(" ");
        if(names){
            if(names.length >= 1){
                return names[0];
            }
        }
        return "user";
    }
}

export {Utilities};