const syncErrorHandler = require('../utils/SyncErrorHandler');
const asyncErrorHandler = require('./ErrorHandler');
const { callMicroService } = require('./microServiceHandler');

module.exports = {
    isAuthenticatedUser: asyncErrorHandler(async (req, res, next) => {
        let authResponse= await callMicroService(req, 'UserAuthentication')
        if (!authResponse) {
            return next(new syncErrorHandler("Please Login to Access", 401))
        }
        next();
    }),

    authorizeRoles : (...roles) => {
        return (req, res, next) => {
    
            if (!roles.includes(req.user.role)) {
                return next(new syncErrorHandler(`Role: ${req.user.role} is not allowed`, 403));
            }
            next();
        }
    }
    
}