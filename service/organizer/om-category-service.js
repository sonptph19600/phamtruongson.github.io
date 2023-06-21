app.service("OmCategoryService", function ($http) {
  var categories = [];

  this.getCategories = function () {
    return categories;
  };

  this.fetchCategories = function () {
    return $http.get(apiURL + "/organizer/category").then(
      function (response) {
        if (response.status === 200) {
          categories = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
