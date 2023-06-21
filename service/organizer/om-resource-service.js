app.service("OmResourceService", function ($http) {
  var resources = [];

  this.getResources = function () {
    return resources;
  };

  this.fetchResources = function (id) {
    return $http.get(apiURL + "/organizer/resource/" + id).then(
      function (response) {
        if (response.status === 200) {
          resources = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
