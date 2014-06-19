'use strict';

//Setting up route
angular.module('mean.queries').config(['$stateProvider',
    function($stateProvider) {

        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $timeout(function() {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for queries
        $stateProvider
            .state('all queries', {
                url: '/queries',
                templateUrl: 'public/queries/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create query', {
                url: '/queries/create',
                templateUrl: 'public/queries/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit query', {
                url: '/queries/:queryId/edit',
                templateUrl: 'public/queries/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('query by id', {
                url: '/queries/:queryId',
                templateUrl: 'public/queries/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);
