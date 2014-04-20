'use strict';

// Queries routes use queries controller
var queries = require('../controllers/queries');
var authorization = require('./middlewares/authorization');

// Queries authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.query.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(app) {

    app.get('/queries', queries.all);
    app.post('/queries', authorization.requiresLogin, queries.create);
    app.get('/queries/:queryId', queries.show);
    app.put('/queries/:queryId', authorization.requiresLogin, hasAuthorization, queries.update);
    app.del('/queries/:queryId', authorization.requiresLogin, hasAuthorization, queries.destroy);

    // Finish with setting up the queryId param
    app.param('queryId', queries.query);

};