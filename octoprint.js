const fetch = require('node-fetch');

const API_URL = process.env.OCTOPRINT_URL || 'http://octopi.local/';


const get = (url) => {
    return fetch(`${API_URL}/api${url}`);
};

const post = (url) => {
    return fetch(`${API_URL}/api${url}`,{
        method: 'POST',
        body: JSON.stringify(body)
    });
};


module.exports = {
    get,
    post
}
