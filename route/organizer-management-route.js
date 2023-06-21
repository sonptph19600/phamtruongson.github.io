app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/event-register", {
      templateUrl: "/page-organizer-management/event-register.html",
      controller: EventRegisterController,
      css: "../assets/css/organizer-management/event-register-style.css",
    })
    .when("/event-manager", {
      templateUrl: "/page-organizer-management/event-manager.html",
      controller: EventManagerController,
      css: "../assets/css/organizer-management/event-manager-style.css",
    })
    .when("/attendance/:id", {
      templateUrl: "/page-organizer-management/attendance.html",
      controller: AttendanceController,
      css: "../assets/css/organizer-management/attendance-style.css",
    })
    .when("/participant-and-question/:id", {
      templateUrl: "/page-organizer-management/participant-and-question.html",
      controller: ParticipantAndQuestionController,
      css: "../assets/css/organizer-management/participant-and-question-style.css",
    })
    .when("/detail-event/:id", {
      templateUrl: "/page-organizer-management/detail-event.html",
      controller: DetailEventController,
      css: "../assets/css/organizer-management/detail-event-style.css",
    })
    .otherwise({
      redirectTo: "/event-manager",
    });
});
