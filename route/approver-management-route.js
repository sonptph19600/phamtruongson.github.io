app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("")
    $routeProvider.when('/event-manager', {
      templateUrl: '/page-approver-management/event-approval.html',
     controller:EventApproveController 
    }).otherwise({
      redirectTo: '/event-manager'
    });
  });


  
 