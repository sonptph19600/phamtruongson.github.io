var app = angular.module("homeApp", ['ngRoute', 'oc.lazyLoad', 'angularCSS']);
app.directive("myTooltip", function () {
    return {
        restrict: "A",
        scope: {
            tooltipContent: "@",
        },
        link: function (scope, element, attrs) {
            $(element).attr("data-bs-toggle", "tooltip");
            $(element).attr("title", scope.tooltipContent);
            $(element).attr("data-bs-placement", "top");
            $(element).attr("data-bs-delay", "500");
            $(element).tooltip();

            scope.$watch("tooltipContent", function (newVal) {
                $(element).tooltip("dispose");
                $(element).attr("data-bs-toggle", "tooltip");
                $(element).attr("title", newVal);
                $(element).attr("data-bs-placement", "top");
                $(element).tooltip();
            });
        },
    };
});
  