var app = angular.module("organizerManagementApp", ["ngRoute", "angularCSS"]);

app.controller("myController", function ($scope, $location) {
  $scope.isActive = function (path) {
    return $location.path() == path;
  };
});

app.directive("quillEditor", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      var quill = new Quill(element[0], {
        theme: "snow",
        placeholder: "Thêm mô tả sự kiện",
      });

      element.on("paste", function (event) {
        event.preventDefault();
        var text = (event.originalEvent || event).clipboardData.getData(
          "text/plain"
        );
        document.execCommand("insertHTML", false, text);
      });

      quill.on("text-change", function () {
        ngModel.$setViewValue(quill.root.innerHTML);
      });

      ngModel.$render = function () {
        quill.root.innerHTML = ngModel.$viewValue;
      };
    },
  };
});

app.directive("quillViewer", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      var quill = new Quill(element[0], {
        theme: "snow",
        readOnly: true,
        modules: {
          toolbar: false,
        },
      });

      ngModel.$render = function () {
        quill.root.innerHTML = ngModel.$viewValue;
      };
    },
  };
});
