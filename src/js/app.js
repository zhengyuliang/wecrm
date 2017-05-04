/**
 * Created by yinyaotao on 2017/5/3.
 */
var app = angular.module('wecrm',['ionic']);
    app.config(function ($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('');
        $stateProvider
            .state('home',{
                url: '',
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            })
            .state('login',{
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('addVisitPlan',{
                url: '/addVisitPlan',
                templateUrl: 'templates/addVisitPlan.html',
                controller: 'addVisitPlanCtrl'
            })
            .state('customerIndex',{
                url: '/customerIndex',
                templateUrl: 'templates/customerIndex.html',
                controller: 'customerIndexCtrl'
            })
    })