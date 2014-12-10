// angular.module('WordCounter', [])
//     .filter('wordCounter', function () {
//         return function (value) {
//             if (value && typeof value === 'string') {
//                 return value.trim().split(/\s+/).length;
//             } else {
//                 return 0;
//             }
//         };
//     })
//     .controller('CounterCtrl', function ($scope) {
//         $scope.notesNode = {
//             text: ''
//         };
//     });