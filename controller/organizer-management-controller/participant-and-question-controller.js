window.ParticipantAndQuestionController = function (
  $scope,
  $http,
  $location,
  $routeParams,
  OmEventService,
  OmQuestionService,
  ConvertLongToDateString
) {
  document.title = "Danh sách sinh viên đã đăng ký | Portal Event";

  $scope.idEvent = $routeParams.id;

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
  $scope.page = 0;
  $scope.currentPage = 1;
  $scope.size = "10";
  $scope.firstCount = 0;
  $scope.lastCount = 0;
  $scope.question = "";

  function loadData() {
    let obj = {
      idEvent: $scope.idEvent,
      email: $scope.email,
      className: $scope.className,
      question: $scope.question,
      page: $scope.page,
      size: parseInt($scope.size),
    };

    OmQuestionService.fetchQuestions(obj).then(function () {
      $scope.listQuestion = OmQuestionService.getQuestions();
      if ($scope.listQuestion.length == 0) {
        $scope.nodata = "Danh sách trống";
      } else {
        $scope.nodata = "";
      }
      $scope.totalPages = OmQuestionService.getTotalPages();
      $scope.listQuestion.forEach((item) => {
        item.convertAttendanceTime = ConvertLongToDateString.setDateYearString(
          item.createdDate
        );
      });
      $scope.firstCount = $scope.listQuestion[0].stt;
      $scope.lastCount =
        $scope.listQuestion[$scope.listQuestion.length - 1].stt;
    });

    let objCount = {
      idEvent: $scope.idEvent,
      email: $scope.email,
      className: $scope.className,
      question: $scope.question
    };

    OmQuestionService.fetchCountAll(objCount).then(function () {
      $scope.countAll = OmQuestionService.getCount();
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
    var table = document.getElementById("tableQuestion");
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
};
