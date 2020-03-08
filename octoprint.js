const fetch = require('node-fetch');

const API_URL = process.env.OCTOPRINT_URL || 'http://octopi.local';
const API_KEY = process.env.API_KEY;


const get = (url) => {
    return fetch(`${API_URL}/api${url}`, {
        headers: {
            ['X-Api-Key']: API_KEY
        }
    });
};

const post = (url, body) => {
    const apiRoute = `${API_URL}/api${url}`;

    return fetch(apiRoute,{
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        }
    });
};


module.exports = {
    get,
    post
}
