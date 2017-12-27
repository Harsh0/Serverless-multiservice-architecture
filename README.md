# Serverless-multiservice-architecture
A Serverless application scalaton which include multiple services, use AWS Lambda for Backend, and AWS API Gateway for HTTPS request also use SNS S3 trigger events


first install serverless to you development environment

npm i serverless -g


Create your first service
sls create --template aws-nodejs --path UserService
remove handler.js
create two folder with Authorizer and Login

authroizer is used for authorization

edit serverless.yml file

sls encrypt --stage dev --password 'custompassword'
sls decrypt --stage dev --password 'custompassword'


Create another service

this is becuase we have limit per lambda basis
sls create --template aws-nodejs --path AccountService

Go to Account Service 