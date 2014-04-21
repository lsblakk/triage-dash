'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Query = mongoose.model('Query'),
    _ = require('lodash');



/*
 * YQL for template mapping
 */

var YQL = require('yql');

function extrapolate(query) {
    console.log("i'm going to check for version now");
    new YQL.exec('select * from data.html.cssselect where url="https://wiki.mozilla.org/Template:BETA_VERSION" and css="#mw-content-text p"', function (response) {
        var $version = response.query.results.results.p;
        console.log(response.query.results.results.p);
        query.title = query.title.replace(/{{BETA_VERSION}}/g, $version);
        query.url = query.url.replace(/{{BETA_VERSION}}/g, $version);
        return query;
    });
}



/**
 * Find query by id
 */
exports.query = function(req, res, next, id) {
    Query.load(id, function(err, query) {
        if (err) return next(err);
        if (!query) return next(new Error('Failed to load query ' + id));
        req.query = query;
        // Transform the templates
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

 // need to abstract and map out the possible template values
exports.show = function(req, res) {
    var query = req.query;
    new YQL.exec('select * from data.html.cssselect where url="https://wiki.mozilla.org/Template:BETA_VERSION" and css="#mw-content-text p"', function (response) {
        var $version = response.query.results.results.p;
        query.title = query.title.replace(/{{BETA_VERSION}}/g, $version);
        query.url = query.url.replace(/{{BETA_VERSION}}/g, $version);
        res.jsonp(query);
    });
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


