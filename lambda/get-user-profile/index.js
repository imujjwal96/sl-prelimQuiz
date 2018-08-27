'use strict';

const rp = require('request-promise');

const generateResponse = (status, message) => {
    return {
        statusCode: status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({'message': message})
    }
};

const handler = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2)); 

    const idToken = event.headers.Authorization;
    const accessToken = event.queryStringParameters.accessToken;
    const auth0Domain = process.env.AUTHO0_DOMAIN;

    if (!idToken) {
        const response = generateResponse(400, 'ID token not Found');

        callback(null, response);
        return;
    }

    if (!accessToken) {
        const response = generateResponse(400, 'AccessToken not found');

        callback(null, response);
        return;
    }

    const options = {
        url: `https://${auth0Domain}/userinfo`,
        method: 'POST',
        json: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }

    return rp(options).then((body) => {
        const response = generateResponse(200, body);
        callback(null, response);
    }).catch((error) => {
        const response = generateResponse(400, error);
        callback(null, response);
    });
};