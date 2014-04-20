'use strict';

//Queries service used for queries REST endpoint
angular.module('mean.queries').factory('Queries', ['$resource', function($resource) {
    return $resource('queries/:queryId', {
        queryId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);