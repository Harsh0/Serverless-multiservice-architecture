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
    let dbConnection;
    let user = event.requestContext.authorizer;
    //Connect with MongoDB remote host
    mongodb.MongoClient.connect(MONGO_URI)
    .then(connection => {
        //assign to dbConnection for using connection variable in other callbacks
        dbConnection = connection;
        return dbConnection.collection('profile').findOne({
            'username': user.username
        });
    })
    .then(userProfile => {
        console.log(userProfile);
        //destory dbConnection if you are not prefering connection caching
        dbConnection.close();
        //send response to user
        done({
            statusCode: 200,
            body: {
                'message': 'Success',
                'profile': userProfile
            }
        });
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
                message: err.message ? "Error getting profile" : err
            }
        });
    });
};
