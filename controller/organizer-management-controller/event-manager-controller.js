window.EventManagerController = function (
  $scope,
  $http,
  $location,
  OmEventService,
  ConvertLongToDateString,
  OmCategoryService,
  OmConvertDate
) {
  document.title = "Sự kiện đã đăng ký | Portal Event";
  $scope.idOrganizer = "ae443d25-124c-460a-82e4-ee93d306990c";

  $scope.selectedFilter = null;
  $scope.name = "";
  $scope.idCategory = "";
  $scope.startTime = null;
  $scope.endTime = null;
  $scope.formality = "";
  $scope.statusSort = 3;

  $scope.valueSort = "3";

  $scope.filterEvent = function (status) {
    $scope.selectedFilter = status;

    filter();
  };

  $scope.filterEvent(null);

  OmCategoryService.fetchCategories().then(function () {
    $scope.listCategory = OmCategoryService.getCategories();
  });

  $scope.searchEvent = function () {
    filter();
  };

  function filter() {
    let obj = {
      idOrganizer: $scope.idOrganizer,
      status: $scope.selectedFilter,
      name: $scope.name,
      idCategory: $scope.idCategory,
      startTime: OmConvertDate.converter($scope.startTime),
      endTime: OmConvertDate.converter($scope.endTime),
      formality: $scope.formality,
      statusSort: $scope.statusSort,
    };
    console.log(obj);
    OmEventService.fetchEvents(obj).then(function () {
      $scope.listEvent = OmEventService.getEvents();
      $scope.listEvent.forEach((item) => {
        item.convertStartTime = ConvertLongToDateString.setDateYearString(
          item.startTime
        );
        item.convertEndTime = ConvertLongToDateString.setDateYearString(
          item.endTime
        );
      });
      if ($scope.listEvent.length == 0) {
        if ($scope.statusSort == 0) {
          $scope.nodatListEvent = "Không có sự kiện nào sắp diễn ra";
        } else if ($scope.statusSort == 1) {
          $scope.nodatListEvent = "Không có sự kiện kết thúc gần nhất";
        } else if ($scope.statusSort == 2) {
          $scope.nodatListEvent = "Không có sự kiện nào mới tạo";
        }else {
          $scope.nodatListEvent = "Không có sự kiện nào đang diễn ra";
        }
      } else {
        $scope.nodatListEvent = "";
      }
    });
  }

  $scope.clearFilter = function () {
    $scope.selectedFilter = null;
    $scope.name = "";
    $scope.idCategory = "";
    $scope.startTime = null;
    $scope.endTime = null;
    $scope.formality = "";

    filter();
  };

  $scope.sortEvent = function () {
    $scope.statusSort = parseInt($scope.valueSort);

    filter();
  };
};
