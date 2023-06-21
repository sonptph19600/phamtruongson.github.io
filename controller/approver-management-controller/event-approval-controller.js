window.EventApproveController = function ($scope, $http, $timeout,$route, $window) {
  $http.get(approverEventAPI + "/event-group/list").then(
    function (reponse) {
      $scope.eventGroup = reponse.data.data;
      $timeout(() => {
        $(document).ready(function () {
          $('#inputEventGroup').chosen({ width: "80%", no_results_text: "Không tìm thấy nhóm sự kiện!" });
        });
      }, 0)
    },
    function (error) {
      console.log(error);
    }
  );
  $http.get(approverEventAPI + "/event-category/list").then(
    function (reponse) {
      $scope.eventCategory = reponse.data.data;

      $timeout(() => {
        $(document).ready(function () {
          $('#inputEventCategory').chosen({ width: "80%", no_results_text: "Không tìm thấy danh muc sự kiện!" });
        });
      }, 0)
    },
    function (error) {
      console.log(error);
    }
  );
  $http.post(approverEventAPI + "/list-event-approved", {
    name: null,
    eventGroup: null,
    categoryId: null,
    startTime: null,
    endTime: null,
    formality: null,
    status: null

  }).then(
    function (reponse) {
      $scope.currect = reponse.data.currentPage
      $scope.totalPage = reponse.data.totalPages
      $scope.listEvent = reponse.data.data;
    },
    function (error) {
      console.log(error);

    }
  );
  $scope.getEventCategory = () => $('#inputEventCategory').val();
  $scope.getEventGroup = () => $('#inputEventGroup').val();
  $scope.search = () => {
    console.log($scope.eventName)
    console.log(new Date($scope.startDate).getTime())
    console.log(new Date($scope.endDate).getTime())
    console.log($scope.formality == "null" ? null : $scope.formality)
    console.log($scope.approve == "null" ? null : $scope.approve)
    console.log($scope.getEventCategory())
    console.log($scope.getEventGroup())
    var startDate = new Date($scope.startDate).getTime();
    var endDate = new Date($scope.startDate).getTime();
    $http.post(approverEventAPI + "/list-event-approved", {
      name: $scope.eventName,
      eventGroup: $scope.getEventGroup().length === 0 ? null : $scope.getEventGroup().join(","),
      categoryId: $scope.getEventCategory().length === 0 ? null : $scope.getEventCategory().join(","),
      startTime: startDate === 0 ? null : startDate,
      endTime: endDate === 0 ? null : endDate,
      formality: $scope.formality,
      status: $scope.approve

    }).then(
      function (reponse) {
        $scope.currect = reponse.data.currentPage
        $scope.totalPage = reponse.data.totalPages
        $scope.listEvent = reponse.data.data;
      },
      function (error) {
        console.log(error);

      }
    );
  }
  $scope.resetForm = () => {
    $scope.eventName = null
    $scope.startDate = null
    $scope.formality = null
    $scope.approve = null
    $http.post(approverEventAPI + "/list-event-approved", {
      name: null,
      eventGroup: null,
      categoryId: null,
      startTime: null,
      endTime: null,
      formality: null,
      status: null

    }).then(
      function (reponse) {
        $scope.currect = reponse.data.currentPage
        $scope.totalPage = reponse.data.totalPages
        $scope.listEvent = reponse.data.data;
      },
      function (error) {
        console.log(error);

      }
    );
  }
  $scope.detail = (id, status) => {
    $scope.thongtin = status
    if (status == 0) {
      $scope.thongtin = "chưa phê duyệt"
      $http.get(approverEventAPI + "/detail/" + id).then(
        function (respone) {
          $scope.eventDetail = respone.data.data

        }
      )
    } else if (status == 2 || status == 1) {
      $scope.thongtin = "đã phê duyệt"
      $http.get(approverEventAPI + "/approved/detail/" + id).then(
        function (respone) {
          $scope.eventDetail = respone.data.data

        }
      )
    }
    $http.get(approverEventAPI + "/detail/organizers/" + id).then(
      function (respone) {
        $scope.listOrganizerEvent = respone.data.data

      }
    )
    $scope.status = status == 0 ? "MỚI THÀNH LẬP" : status == 2 ? "ĐÃ PHÊ DUYỆT" : "TỪ CHỐI";
    $scope.statusTextColor = status == 0 ? "text-primary" : status == 2 ? "text-success" : "text-danger";
  }
  $scope.approved = (check, id) => {
    if (check == 2) {
      $http.put(approverEventAPI + "/approve-event", {
        id: id,
        reason: null,
        status: 2
      }).then(
        function (respone) {
          console.log(respone.data)
          $scope.message = "Cập nhập thành công!"
        },function (error) {
          console.log(error.data)
          $scope.errors = "Lỗi hệ thống,vui lòng thử lại sau";
        }
      )
    } else {
      var modalInfo = $('#exampleModal');
      var modalUn = $('#staticBackdropUn');
      staticBackdropUn
      if($scope.reason == null || $scope.reason == ""){
        modalInfo.modal('hide');
        $scope.errorMess = "Yêu cầu nhập lý do từ chối!";
        return;
      }
      $scope.errorMess = "";
      $http.put(approverEventAPI + "/approve-event", {
        id: id,
        reason: $scope.reason,
        status: 1
      }).then(
        function (respone) {
          console.log(respone.data)
          modalUn.modal('hide');
          modalInfo.modal('show');
          $scope.message = "Cập nhập thành công!"
        },function (error) {
          console.log(error.data)
          $scope.errors = "Lỗi hệ thống,vui lòng thử lại sau";
        }
      )
    }
  }
  $scope.reloadPage = () =>{
              $route.reload();

  }
}

