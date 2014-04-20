'use strict';

angular.module('mean.queries').controller('QueriesController', ['$scope', '$stateParams', '$location', 'Global', 'Queries', function ($scope, $stateParams, $location, Global, Queries) {
    $scope.global = Global;

    $scope.create = function() {
        var query = new Queries({
            title: this.title,
            url: this.url
        });
        query.$save(function(response) {
            $location.path('queries/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(query) {
        if (query) {
            query.$remove();

            for (var i in $scope.queries) {
                if ($scope.queries[i] === query) {
                    $scope.queries.splice(i, 1);
                }
            }
        }
        else {
            $scope.query.$remove();
            $location.path('queries');
        }
    };

    $scope.update = function() {
        var query = $scope.query;
        if (!query.updated) {
            query.updated = [];
        }
        query.updated.push(new Date().getTime());

        query.$update(function() {
            $location.path('queries/' + query._id);
        });
    };

    $scope.find = function() {
        Queries.query(function(queries) {
            $scope.queries = queries;
        });
    };

    $scope.findOne = function() {
        Queries.get({
            queryId: $stateParams.queryId
        }, function(query) {
            $scope.query = query;
        });
    };
}]);