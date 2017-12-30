# Serverless-multiservice-architecture
A Serverless application scalaton which include multiple services, use AWS Lambda for Backend, and AWS API Gateway for HTTPS request also use SNS S3 trigger events

## Open Endpoints

Open endpoints require no Authentication.

* [Login](UserService/Login/README.md) : `POST /login`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the Login view above.

#### Authentication requirements

User need to pass valid x-access-token in header field got from login route

##### Success Response

Main function will be invoked

### Error Response

**Condition** : If wrong token

**Code** : `401 Unauthorized`

**Content** :

```json
{
    "message":"Unauthorized"
}
```


### AccountService

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request:


* [GetProfile](AccountService/GetProfile/README.md) : `GET /account/getprofile`
* [UpdateProfile](AccountService/UpdateProfile/README.md) : `POST /account/updateprofile/`
