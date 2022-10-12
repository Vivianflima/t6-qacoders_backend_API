const express = require('express')

module.exports = function(server) {
    const protectedAPI = express.Router();
    server.use('/api', protectedAPI);

    server.use('/status', (req, res) => 
        res.send(`BACKEND is runner.`));
    
    const register = require('../api/registerService');
    register.register(protectedAPI, '/register')   
        
    server.use(express.static(require('path').join(__dirname, '../public')));
}

