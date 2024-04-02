const Microservice = require('../models/microserviceModel');
const axios = require('axios');

module.exports = {
    callMicroService: async (req, name) => {
        try {
            let microservice = await Microservice.findOne({ name })
            if (microservice) {
                const axiosConfig = {
                    method: microservice.method,
                    url: `http://${microservice.host}${microservice.path}`,
                    data: req.body,
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Cookie': req.headers.cookie || req.headers.Cookie
                    }
                };

                const response = await axios(axiosConfig);
                if (!(response.status == 200 && response.data.success)) {
                    return false
                }
                req.user = (response.data.user) ? response.data.user : req.user
            }
            return true
        } catch (ex) {
            return false
        }

    }
}