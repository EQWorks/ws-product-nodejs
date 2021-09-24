const redis = require('redis')
const moment = require('moment')

// Going to use Sliding Window Counter Algorithm 

const maxWindowSize = 6;  //In Minutes
const maxRequest = 100;   // Max Request allowed in 5 minutes
const windowLogInterval = 2;  // Logging Interval is 2 minutes

//Create a redis Client
const client = redis.createClient();

const rateLimiter = (req , res , next) => {

    try{

        // Throw error if redis client does not exist
        if(!client){
            throw new Error ('Client Does Not Exist');
            process.exit(1);
        }

        // Get the record of current user's IP address else throw an error
        client.get(req.ip , function(err , record){
            
            if (err) throw err;

            const currentRequestTime = moment();

            // Do Not forget to Remove the console.log
            // console.log('CHECKING FOR RECORDS:' , record);
            //No Record found or it is the first API Call for the current User
            if(record == null){

                // Creating an array of request log at the first API call
                let collection = [];
                let requestLog = {
                    timestamp: currentRequestTime.unix(),
                    count:1
                };

                collection.push(requestLog);
                // console.log('CHECKING FOR COLLECTION :' , collection);
                client.set(req.ip,JSON.stringify(collection));

                next();
            }
            
            //if a record is found
            let data = JSON.parse(record);
            
            let windowStartTime = moment()
            .subtract(maxWindowSize , 'minutes')
            .unix();

            
            // Get all the objects within the current Window Interval
            let requestInWindow =  data.filter(logs => {
                return logs.timestamp > windowStartTime;
            });

            // Do not forget to remove the console.log
            console.log ('CHECKING REQUEST IN WINDOW:' , requestInWindow)
            // Get the total number of request made in this Interval
            let requestCount = requestInWindow.reduce((accumulator , total ) => {
                return accumulator + total.count ;
            }, 0);

            
            // Checking if it's over the max limit of request
            if (requestCount >= maxRequest){

                res.status(429).json(`You have exceeded ${maxRequest} request within ${maxWindowSize} minutes`)    
            
            }else{

                // Checking which log to make the entry in
                let lastLog = data[data.length - 1];
                let potentialStartTime = currentRequestTime
                .subtract(windowLogInterval , 'minutes')
                .unix();

                //If it is in current Log
                if(lastLog.timestamp > potentialStartTime){
                    lastLog.count++;
                    data[data.length -1] = lastLog;
                }else{
                    // If not in the current log 
                    data.push({
                        timestamp: currentRequestTime.unix(),
                        count: 1
                    });
                } 

                client.set(req.ip,JSON.stringify(data))
            
                next();
            }
        });    
    }catch (error) {

        next(error);

    }
};

module.exports = rateLimiter;