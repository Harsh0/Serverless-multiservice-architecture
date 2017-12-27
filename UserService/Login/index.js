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
        let {username, password} = requestBody;
        //put basic username and password validation
        if(username&&password){
            let dbConnection, newToken;
            //Connect with MongoDB remote host
            mongodb.MongoClient.connect(MONGO_URI)
            .then(connection => {
                //assign to dbConnection for using connection variable in other callbacks
                dbConnection = connection;
                return dbConnection.collection('login').findOne({
                    'username': username,
                    'password': password
                });
            })
            .then(user => {
                if(!user){
                    throw new Error("Please Signup to Continute");
                }
                //Generate new Token for Length 30
                newToken = generateNewToken(30);
                //Update token in Database and assign to newToken for using in other callback
                return dbConnection.collection('token_list').update({
                    'username': username
                },{
                    '$set':{
                        'token': newToken,
                        'addedDate': Date.now() // current date timestamp 
                    }
                },{
                    'upsert': true
                });
            })
            .then(response => {
                console.log(response);
                //send response to user
                done({
                    statusCode: 200,
                    body: {
                        'message': 'Login Successful',
                        'token': newToken
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
                        message: err.message ? "Error commenting" : err
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

function generateNewToken(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
