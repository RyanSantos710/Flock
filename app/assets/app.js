/**
 * Created by phillipwright on 11/26/14.
 */
angular.module('myApp', [])
    .controller('NameController', ['$scope', function($scope) {
        $scope.names = [
            {text:'?**?', done:true},
            {text:'(#)|(#)', done:false}];

        $scope.addName = function() {
            $scope.names.push({text:$scope.nameText, done:false});
            $scope.nameText = '';
        };

        $scope.remaining = function() {
            var count = 0;
            angular.forEach($scope.names, function(name) {
                count += name.done ? 0 : 1;
            });
            return count;
        };

        $scope.archive = function() {
            var oldnames = $scope.names;
            $scope.names = [];
            angular.forEach(oldNames, function(name) {
                if (!name.done) $scope.names.push(name);
            });
        };
    }]);