console.log("Loading Function");
//Required Modules
const mongodb = require('mongodb');// using version 2.2.33
const MONGO_URI = process.env.MONGO_URI;// getting url from environment variable

exports.handler = (event, context, callback) => {
    // Get token passed from Client for Authorization
    var token = event.authorizationToken;
    console.log(token);
    let dbConnection;
    //Connect with MongoDB remote host
    mongodb.MongoClient.connect(MONGO_URI)
    .then(connection => {
        //assign to dbConnection for using connection variable in other callbacks
        dbConnection = connection;
        return dbConnection.collection('token_list').findOne({
            'token': token
        });
    })
    .then(user => {
        if(!user){
            throw new Error("No User Found");
        }
        //destroy database connection
        dbConnection.close();
        //Generate policy for user to invoke Lambda function
        //also send the user information so that next lambda need not to fetch details of authenticated user
        callback(null, generatePolicy('user', 'Allow', event.methodArn, user));
    })
    .catch(err => {
        console.log(err);
        //destroy database connection
        dbConnection.close();
        //Send error string "Unauthorized" for send unauthorize to User
        callback("Unauthorized");
    })
};

function generatePolicy(principalId, effect, resource, userData) {
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    authResponse.context = userData;
    return authResponse;
}
