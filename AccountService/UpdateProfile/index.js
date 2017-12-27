console.log("Loading Function");
//Required Modules
const mongodb = require('mongodb');// using version 2.2.33
const MONGO_URI = process.env.MONGO_URI;// getting url from environment variable


exports.handler = (event, context, callback) => {
    //Initialise done function for sending response back in Lambda Proxy Integration
    var done = (err, res) => {
        callback(null, {
            statusCode: err ? err.statusCode||'400' : res.statusCode||'200',
            body: err ? JSON.stringify(err.body) : JSON.stringify(res.body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }    
    if(event.body){
        //If User sent request with body
        let requestBody = JSON.parse(event.body);
        //extract username and password from request body
        let {firstName, lastName} = requestBody;
        //put basic username and password validation
        if(username&&password){
            let dbConnection, newToken;
            //Connect with MongoDB remote host
            mongodb.MongoClient.connect(MONGO_URI)
            .then(connection => {
                //assign to dbConnection for using connection variable in other callbacks
                dbConnection = connection;
                return dbConnection.collection('profile').update({
                    'firstName': firstName,
                    'lastName': lastName
                });
            })
            .then(response => {
                console.log(response);
                //destroy database connection
                dbConnection.close();
                //send response to user
                done({
                    statusCode: 200,
                    body: {
                        'message': 'Profile Updated Successfully'
                    }
                })
            })
            .catch(err => {
                // log error
                console.log(err);
                //destory dbConnection if you are not prefering connection caching
                dbConnection.close();
                done({
                    //if err.message is there, so internal error is occured
                    // that we dont want to show to user
                    statusCode: err.message ? 500 : 400,
                    body: {
                        // if err.message is not there so that is custom error thrown by our program
                        message: err.message ? "Error updating profile" : err
                    }
                });
                callback("Unauthorized");
            });
        }else{
            // If no username or password
            done({
                statusCode: 400,
                body: {
                    message: "Fields are missing"
                }
            })
        }
    }else{
        // If no request body
        done({
            statusCode: 400,
            body: {
                message: "No request body passed"
            }
        });
    }
};
