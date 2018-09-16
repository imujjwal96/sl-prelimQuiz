'use strict';

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const mysql = require('promise-mysql');

exports.handler = (event, context, callback) => {
    const connectionParams = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : process.env.MYSQL_DATABASE
    };
    const dynamodb = new AWS.DynamoDB();
    const queryKey = uuidv4();
    
    const params = {
        Item: {
            "_id": {
                S: queryKey
            }, 
            "type": {
                S: "No One You Know"
            }, 
            "statement": {
                S: "Call Me Today"
            },
            "answer": {
                S: "dfgf"
            },
            "options": {
                SS: ["optionA", "optionB", "optionC", "optionD"]
            }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: "prelimquiz"
    };
    
    dynamodb.putItem(params).promise()
    .then(() => {
        return mysql.createConnection(connectionParams);
    }).then((connection) => {
        const sqlQuery = "INSERT INTO questions VALUES (NULL, '" + queryKey +"')";
        var result = connection.query(sqlQuery);
        connection.end();
        return result;
    }).then((result) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
        callback(null, result);
    }).catch((err) => {
        const response = {
            statusCode: 400,
            body: JSON.stringify(err)
        };
        callback(null, response);
    });
};