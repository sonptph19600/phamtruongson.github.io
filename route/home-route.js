app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("")
    $routeProvider.when('/trang-chu', {
        title: "Trang chủ",
        templateUrl: '/page-home/home.html',
        css: '../assets/css/home.css',
        controller: homeController
    }).when('/event-detail/:id', {
        title: "Chi tiết",
        templateUrl: '/page-home/detail.html',
        controller: detailController,
        css: './assets/css/detail-style.css',
        resolve: {
            loadMyFiles: function($ocLazyLoad) {
                return $ocLazyLoad.load('/assets/js/detail.js');
              }
        }
    }).otherwise({
        redirectTo: '/trang-chu'
    });
});
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);