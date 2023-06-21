window.AttendanceController = function (
  $scope,
  $http,
  $location,
  ConvertLongToDateString,
  $routeParams,
  OmEventService,
  OmAttendanceService
) {
  document.title = "Điểm danh | Portal Event";

  $scope.idEvent = $routeParams.id;

  $scope.totalPage = "   5";

  OmEventService.fetchDetail($scope.idEvent).then(function () {
    $scope.detailEvent = OmEventService.getDetail();
    $scope.detailEvent.startTime = new Date(
      new Date($scope.detailEvent.startTime).toLocaleDateString("en-CA") +
        ", " +
        new Date($scope.detailEvent.startTime).toLocaleTimeString()
    );

    $scope.detailEvent.endTime = new Date(
      new Date($scope.detailEvent.endTime).toLocaleDateString("en-CA") +
        ", " +
        new Date($scope.detailEvent.endTime).toLocaleTimeString()
    );

    $scope.detailEvent.formality =
      $scope.detailEvent.formality == "ONLINE" ? "0" : "1";

    $scope.detailEvent.status =
      $scope.detailEvent.status == "JUST_REGISTERED"
        ? 0
        : $scope.detailEvent.status == "EDITING"
        ? 1
        : $scope.detailEvent.status == "APPROVED"
        ? 2
        : 3;
  });

  $scope.email = "";
  $scope.className = "";
  $scope.rate = "";
  $scope.page = 0;
  $scope.currentPage = 1;
  $scope.size = "10";
  $scope.firstCount = 0;
  $scope.lastCount = 0;
  $scope.feedback = "";

  function loadData() {
    let obj = {
      idEvent: $scope.idEvent,
      email: $scope.email,
      className: $scope.className,
      rate: $scope.rate,
      feedback: $scope.feedback,
      page: $scope.page,
      size: parseInt($scope.size),
    };

    OmAttendanceService.fetchAttendances(obj).then(function () {
      $scope.listAttendance = OmAttendanceService.getAttendances();
      if ($scope.listAttendance.length == 0) {
        $scope.nodata = "Danh sách trống";
      } else {
        $scope.nodata = "";
      }
      $scope.totalPages = OmAttendanceService.getTotalPages();
      $scope.listAttendance.forEach((item) => {
        item.convertAttendanceTime = ConvertLongToDateString.setDateYearString(
          item.attendanceTime
        );
      });
      $scope.firstCount = $scope.listAttendance[0].stt;
      $scope.lastCount =
        $scope.listAttendance[$scope.listAttendance.length - 1].stt;
    });

    let objCount = {
      idEvent: $scope.idEvent,
      email: $scope.email,
      className: $scope.className,
      rate: $scope.rate,
      feedback: $scope.feedback,
    };

    OmAttendanceService.fetchCountAll(objCount).then(function () {
      $scope.countAll = OmAttendanceService.getCount();
    });
  }

  loadData();

  $scope.changeData = _.debounce(function () {
    if ($scope.currentPage < 1) {
      $scope.currentPage = 1;
    }
    if ($scope.currentPage > $scope.totalPages) {
      $scope.currentPage = $scope.totalPages;
    }
    $scope.page = parseInt($scope.currentPage) - 1;
    loadData();
  }, 500);

  $scope.changeSize = _.debounce(function () {
    loadData();
  }, 300);

  $scope.search = function () {
    loadData();
  };

  $scope.backPage = function () {
    $scope.currentPage = $scope.currentPage - 1;
    $scope.page = $scope.currentPage - 1;
    loadData();
  };

  $scope.nextPage = function () {
    $scope.currentPage = $scope.currentPage + 1;
    $scope.page = $scope.currentPage - 1;
    loadData();
  };

  $scope.exportToExcel = function () {
    var table = document.getElementById("tableAttendance");
    var data = [];
    for (var i = 0, row; (row = table.rows[i]); i++) {
      var rowData = [];
      for (var j = 0, col; (col = row.cells[j]); j++) {
        rowData.push(col.innerText);
      }
      data.push(rowData);
    }

    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "data.xlsx");
  };

  $scope.clearFormFilter = function () {
    $scope.email = "";
    $scope.className = "";
    $scope.rate = "";
    $scope.page = 0;
    $scope.currentPage = 1;
    $scope.size = "10";
    $scope.firstCount = 0;
    $scope.lastCount = 0;
    $scope.feedback = "";

    loadData();
  };

  $scope.openAndCloseAttendance = function (status) {
    let obj = {
      idEvent: $scope.idEvent,
      status: status,
    };

    $http
      .post("http://localhost:1626/organizer/event/update-is-attendance", obj)
      .then(
        function (response) {
          let obj = response.data.data;
          $scope.detailEvent.isAttendance = obj.isAttendance;
          if (obj.isAttendance) {
            toastr.success("Mở điểm danh thành công !", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
          } else {
            toastr.success("Đóng điểm danh thành công !", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
          }
        },
        function (error) {}
      );
  };
};
