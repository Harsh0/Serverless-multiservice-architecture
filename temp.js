


const mongodb = require('mongodb');
const MONGO_URI = process.env.MONGO_URI;
exports.handler = (event, context, callback) => {
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
    mongodb.MongoClient.connect(MONGO_URI)
    .then(connection => {
        dbConnection = connection;
        return dbConnection.collection('profile').findOne({
            'username': user.username
        });
    })
    .then(userProfile => {
        dbConnection.close();
        done({
            statusCode: 200,
            body: {
                'message': 'Operation Success',
                'profile': userProfile
            }
        });
    })
    .catch(err => {
        console.log(err);
        dbConnection.close();
        done({
            statusCode: err.message ? 500 : 400,
            body: {
                message: err.message ? "Error getting profile" : err
            }
        });
    });
};

