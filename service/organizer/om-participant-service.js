app.service("OmAttendanceService", function ($http) {
  var attendances = [];
  let currentPage = 0;
  let totalPages = 0;
  let countAll = 0;

  this.getAttendances = function () {
    return attendances;
  };

  this.getCurrentPage = function () {
    return currentPage;
  };

  this.getTotalPages = function () {
    return totalPages;
  };

  this.getCount = function () {
    return countAll;
  };

  this.fetchAttendances = function (obj) {
    return $http
      .get(
        apiURL +
          "/organizer/participant" +
          "?idEvent=" +
          obj.idEvent +
          "&email=" +
          obj.email +
          "&className=" +
          obj.className +
          "&rate=" +
          obj.rate +
          "&feedback=" +
          obj.feedback +
          "&page=" +
          obj.page +
          "&size=" +
          obj.size
      )
      .then(
        function (response) {
          if (response.status === 200) {
            attendances = response.data.data.data;
            totalPages = response.data.data.totalPages;
            currentPage = response.data.data.currentPage;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  this.fetchCountAll = function (obj) {
    return $http
      .get(
        apiURL +
          "/organizer/participant/count" +
          "?idEvent=" +
          obj.idEvent +
          "&email=" +
          obj.email +
          "&className=" +
          obj.className +
          "&rate=" +
          obj.rate +
          "&feedback=" +
          obj.feedback
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countAll = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});

app.service("OmQuestionService", function ($http) {
  var questions = [];
  let currentPage = 0;
  let totalPages = 0;
  let countAll = 0;

  this.getQuestions = function () {
    return questions;
  };

  this.getCurrentPage = function () {
    return currentPage;
  };

  this.getTotalPages = function () {
    return totalPages;
  };

  this.getCount = function () {
    return countAll;
  };

  this.fetchQuestions = function (obj) {
    return $http
      .get(
        apiURL +
          "/organizer/participant/question" +
          "?idEvent=" +
          obj.idEvent +
          "&email=" +
          obj.email +
          "&className=" +
          obj.className +
          "&question=" +
          obj.question +
          "&page=" +
          obj.page +
          "&size=" +
          obj.size
      )
      .then(
        function (response) {
          if (response.status === 200) {
            questions = response.data.data.data;
            totalPages = response.data.data.totalPages;
            currentPage = response.data.data.currentPage;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  this.fetchCountAll = function (obj) {
    return $http
      .get(
        apiURL +
          "/organizer/participant/count-question" +
          "?idEvent=" +
          obj.idEvent +
          "&email=" +
          obj.email +
          "&className=" +
          obj.className +
          "&question=" +
          obj.question 
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countAll = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
