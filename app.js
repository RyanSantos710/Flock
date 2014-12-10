/**
 * Created by phillipwright on 11/26/14.
 */
angular.module('myApp',  ['ngRoute'])


    myApp.config(function($routProvider){
        $routProvider

        .when('/',{

            templatem.Url : 'profile.ejs',
            controller : 'homeController'
        })


        .when('/profile',{

            templatem.Url : 'profile.ejs',
            controller : 'profileController'
        })

        .when('/login',{

            templatem.Url : 'profile.ejs',
            controller : 'loginController'
        })    

            .when('/tweets',{

            templatem.Url : 'profile.ejs',
            controller : 'tweetController'
        })
    })
    myApp.controller('NameController', ['$scope', function($scope) {
       
       }]);

    myApp.controller('HomeController', ['$scope', function($scope){

        }]);
    }]);