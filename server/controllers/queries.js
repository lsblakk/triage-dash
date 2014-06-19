'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Query = mongoose.model('Query'),
    _ = require('lodash');

// Supported Templates for interpolation
var templates = ['BETA_VERSION', 'AURORA_VERSION'];
var wikiUrl = "https://wiki.mozilla.org/Template:";

/*
 * YQL for template mapping
 */
var YQL = require('yql');

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
    console.log("Searching query for any templates");
    for (var i = templates.length - 1; i >= 0; i--) {
        if (query.url.search(templates[i]) != -1) {
            // found
            var template = templates[i];
            console.log('found ' + template);
            var url = wikiUrl + template;
            console.log(url);
            var cmd = "select * from data.html.cssselect where url=" + '"' + url + '"' + " and css=" + '"' + "#mw-content-text p" + '"';
            console.log(cmd);
            new YQL.exec(cmd, function (response) {
                console.log(response);
                var $version = response.query.results.results.p;
                console.log('Version found: ' + $version);
                var temp = "{{" + template + "}}";
                var re = new RegExp(temp, "g");
                console.log(re);
                query.url = query.url.replace(re, $version);
                query.title = query.title.replace(re, $version);
                res.jsonp(query);
            });
        };
    };
    
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


