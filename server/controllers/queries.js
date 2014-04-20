'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Query = mongoose.model('Query'),
    _ = require('lodash');


/**
 * Find query by id
 */
exports.query = function(req, res, next, id) {
    Query.load(id, function(err, query) {
        if (err) return next(err);
        if (!query) return next(new Error('Failed to load query ' + id));
        req.query = query;
        next();
    });
};

/**
 * Create a query
 */
exports.create = function(req, res) {
    var query = new Query(req.body);
    query.user = req.user;

    query.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                query: query
            });
        } else {
            res.jsonp(query);
        }
    });
};

/**
 * Update a query
 */
exports.update = function(req, res) {
    var query = req.query;

    query = _.extend(query, req.body);

    query.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                query: query
            });
        } else {
            res.jsonp(query);
        }
    });
};

/**
 * Delete a query
 */
exports.destroy = function(req, res) {
    var query = req.query;

    query.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                query: query
            });
        } else {
            res.jsonp(query);
        }
    });
};

/**
 * Show a query
 */
exports.show = function(req, res) {
    res.jsonp(req.query);
};

/**
 * List of Queries
 */
exports.all = function(req, res) {
    Query.find().sort('-created').populate('user', 'name username').exec(function(err, queries) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(queries);
        }
    });
};
