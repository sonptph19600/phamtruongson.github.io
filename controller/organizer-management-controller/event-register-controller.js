window.EventRegisterController = function (
  $scope,
  $http,
  $location,
  OmCategoryService,
  OmConvertDate
) {
  document.title = "Đăng ký sự kiện | Portal Event";
  OmCategoryService.fetchCategories().then(function () {
    $scope.listCategory = OmCategoryService.getCategories();
  });

  $scope.listResource = [];
  if ($scope.listResource.length == 0) {
    $scope.dataResourceEmpty = "Chưa có tài nguyên nào !!!";
  }

  $scope.nameResourceAdd = "";
  $scope.pathResourceAdd = "";
  $scope.descriptionResourceAdd = "";

  $scope.clearFormAddResource = function () {
    $scope.errorNameResourceAdd = "";
    $scope.errorPathResourceAdd = "";
    $scope.nameResourceAdd = "";
    $scope.pathResourceAdd = "";
    $scope.descriptionResourceAdd = "";
  };

  $scope.addResource = function () {
    let check = 0;
    if ($scope.nameResourceAdd == "") {
      $scope.errorNameResourceAdd = "Tên tài nguyên không được để trống";
      check++;
    } else {
      $scope.errorNameResourceAdd = "";
    }
    if ($scope.pathResourceAdd == "") {
      $scope.errorPathResourceAdd = "Đường dẫn không được để trống";
      check++;
    } else {
      $scope.errorPathResourceAdd = "";
    }
    if (check == 0) {
      let obj = {
        name: $scope.nameResourceAdd,
        path: $scope.pathResourceAdd,
        description: $scope.descriptionResourceAdd,
      };

      $scope.listResource.push(obj);

      if ($scope.listResource.length == 0) {
        $scope.dataResourceEmpty = "Chưa có tài nguyên nào !!!";
      } else {
        $scope.dataResourceEmpty = "";
      }
      $("#modal_add_resource").modal("hide");
    }
  };

  $scope.nameResourceUpdate = "";
  $scope.pathResourceUpdate = "";
  $scope.descriptionResourceUpdate = "";
  $scope.indexUpdateResource = -1;

  $scope.openModalUpdateResource = function (index, name, path, description) {
    $scope.indexUpdateResource = index;
    $scope.nameResourceUpdate = name;
    $scope.pathResourceUpdate = path;
    $scope.descriptionResourceUpdate = description;
    $("#modal_update_resource").modal("show");
  };

  $scope.updateResource = function () {
    let check = 0;
    if ($scope.nameResourceUpdate == "") {
      $scope.errorNameResourceUpdate = "Tên tài nguyên không được để trống";
      check++;
    } else {
      $scope.errorNameResourceUpdate = "";
    }
    if ($scope.pathResourceUpdate == "") {
      $scope.errorPathResourceUpdate = "Đường dẫn không được để trống";
      check++;
    } else {
      $scope.errorPathResourceUpdate = "";
    }
    if (check == 0) {
      let obj = {
        name: $scope.nameResourceUpdate,
        path: $scope.pathResourceUpdate,
        description: $scope.descriptionResourceUpdate,
      };
      $scope.listResource[$scope.indexUpdateResource] = obj;
      $("#modal_update_resource").modal("hide");
    }
  };

  $scope.deleteResource = function (index) {
    let check = confirm("Bạn có chắc muốn xóa tài nguyên này không ?");
    if (check) {
      $scope.listResource.splice(index, 1);

      if ($scope.listResource.length == 0) {
        $scope.dataResourceEmpty = "Chưa có tài nguyên nào !!!";
      } else {
        $scope.dataResourceEmpty = "";
      }
    }
  };

  $scope.clearFormRegester = function () {
    $scope.nameEvent = "";
    $scope.startTimeEvent = "";
    $scope.endTimeEvent = "";
    $scope.formalityEvent = "";
    $scope.locationEvent = "";
    document.querySelector("#valueThumbnailEvent").value = null;
    document.querySelector("#valueBackgroundEvent").value = null;
    $scope.categoryEvent = "";
    $scope.descriptionEvent = "";
    $scope.thumbnailEvent = "";
    $scope.backgroundEvent = "";
    $scope.listResource = [];
  };

  $scope.clearFormRegester();

  var guid = () => {
    var w = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return `${w()}${w()}-${w()}-${w()}-${w()}-${w()}${w()}${w()}`;
  };

  $scope.regesterEvent = function () {
    let check = 0;
    if ($scope.nameEvent == "") {
      $scope.errorNameEvent = "Tên sự kiện không được để trống";
      ++check;
    } else {
      $scope.errorNameEvent = "";
    }
    if ($scope.startTimeEvent == "") {
      $scope.errorStartTimeEvent = "Thời gian bắt đầu không được để trống";
      ++check;
    } else {
      $scope.errorStartTimeEvent = "";
    }
    if ($scope.endTimeEvent == "") {
      $scope.errorEndTimeEvent = "Thời gian kết thúc không được để trống";
      ++check;
    } else {
      $scope.errorEndTimeEvent = "";
    }
    if ($scope.formalityEvent == "") {
      $scope.errorFormalityEvent = "Hãy chọn hình thức của sự kiện";
      ++check;
    } else {
      $scope.errorFormalityEvent = "";
    }
    if ($scope.locationEvent == "") {
      $scope.errorLocationEvent = "Địa điểm của sự kiện không được để trống";
      ++check;
    } else {
      $scope.errorLocationEvent = "";
    }
    if ($scope.categoryEvent == "") {
      $scope.errorCategoryEvent = "Thể loại của sự kiện không được để trống";
      ++check;
    } else {
      $scope.errorCategoryEvent = "";
    }
    if ($scope.startTimeEvent != "") {
      if (new Date($scope.startTimeEvent) >= new Date($scope.endTimeEvent)) {
        $scope.errorEndTimeEvent =
          "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
        ++check;
      } else {
        $scope.errorEndTimeEvent = "";
      }
      if (new Date($scope.startTimeEvent) < new Date()) {
        $scope.errorStartTimeEvent =
          "Thời gian bắt đầu không được nằm trong quá khứ";
        ++check;
      } else {
        $scope.errorStartTimeEvent = "";
      }
    }
    if (check == 0) {
      let obj = {
        name: $scope.nameEvent,
        startTime: OmConvertDate.converter($scope.startTimeEvent),
        endTime: OmConvertDate.converter($scope.endTimeEvent),
        formality: $scope.formalityEvent,
        location: $scope.locationEvent,
        idCategory: $scope.categoryEvent,
        description: $scope.descriptionEvent,
        listResource: $scope.listResource,
        background: null,
        thumbnail: null,
      };

      let uuidNameFileBackground = guid() + ".jpg";
      let uuidNameFileThumbnail = guid() + ".jpg";
      let valueThumbnail = document.querySelector("#valueThumbnailEvent");
      if (
        valueThumbnail.files[0] != "" &&
        valueThumbnail.files[0] != null &&
        valueThumbnail.files[0] != undefined
      ) {
        obj.thumbnail = uuidNameFileThumbnail;
      }

      let valueBackground = document.querySelector("#valueBackgroundEvent");
      if (
        valueBackground.files[0] != "" &&
        valueBackground.files[0] != null &&
        valueBackground.files[0] != undefined
      ) {
        obj.background = uuidNameFileBackground;
      }

      $http.post("http://localhost:1626/organizer/event", obj).then(
        function (response) {
          let objEvent = response.data.data;
          let formData = new FormData();
          if (
            valueThumbnail.files[0] != "" &&
            valueThumbnail.files[0] != null &&
            valueThumbnail.files[0] != undefined
          ) {
            let fileInputThumbnail = document.querySelector(
              "#valueThumbnailEvent"
            );
            let fileThumbnail = fileInputThumbnail.files[0];
            let newFileThumbnail = new File(
              [fileThumbnail],
              uuidNameFileThumbnail,
              { type: fileThumbnail.type }
            );
            formData.append("fileThumbnail", newFileThumbnail);
          }

          if (
            valueBackground.files[0] != "" &&
            valueBackground.files[0] != null &&
            valueBackground.files[0] != undefined
          ) {
            let fileInputBackground = document.querySelector(
              "#valueBackgroundEvent"
            );
            let fileBackground = fileInputBackground.files[0];
            let newFileBackground = new File(
              [fileBackground],
              uuidNameFileBackground,
              { type: fileBackground.type }
            );
            formData.append("fileBackground", newFileBackground);
          }

          if (
            (valueBackground.files[0] != "" &&
              valueBackground.files[0] != null &&
              valueBackground.files[0] != undefined) ||
            (valueThumbnail.files[0] != "" &&
              valueThumbnail.files[0] != null &&
              valueThumbnail.files[0] != undefined)
          ) {
            formData.append("idEvent", objEvent.id);
            $.ajax({
              type: "POST",
              url: "http://localhost:1626/organizer/event/upload",
              contentType: false,
              processData: false,
              cache: false,
              data: formData,
              success: function (data) {
                console.log(data);
              },
              error: function (error) {
                console.log(error);
              },
            });
          }
          toastr.success("Đăng ký sự kiện thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $scope.clearFormRegester();
          if ($scope.listResource.length == 0) {
            $scope.dataResourceEmpty = "Chưa có tài nguyên nào !!!";
          }
        },
        function (error) {
          alert(error.data.message);
        }
      );
    }
  };

  $scope.codeCategory = "";
  $scope.nameCategory = "";

  $scope.addCategory = function () {
    let check = 0;
    if ($scope.codeCategory == "") {
      $scope.errorCodeCategory = "Mã thể loại không được để trống";
      check++;
    } else {
      $scope.errorCodeCategory = "";
    }
    if ($scope.nameCategory == "") {
      $scope.errorNameCategory = "Tên thể loại không được để trống";
      check++;
    } else {
      $scope.errorNameCategory = "";
    }
    if ($scope.codeCategory.length > 10) {
      $scope.errorCodeCategory = "Mã thể loại tối đa 10 ký tự";
      check++;
    } else {
      $scope.errorCodeCategory = "";
    }
    if ($scope.nameCategory.length > 100) {
      $scope.errorNameCategory = "Tên thể loại tối đa 100 ký tự";
      check++;
    } else {
      $scope.errorNameCategory = "";
    }
    if (check == 0) {
      let obj = {
        code: $scope.codeCategory,
        name: $scope.nameCategory,
      };

      $http.post("http://localhost:1626/organizer/category", obj).then(
        function (response) {
          toastr.success("Thêm thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $scope.codeCategory = "";
          $scope.nameCategory = "";
          OmCategoryService.fetchCategories().then(function () {
            $scope.listCategory = OmCategoryService.getCategories();
          });
          $("#modal_add_category").modal("hide");
        },
        function (error) {
          if (error.data.statusCode == "2003") {
            toastr.error("Mã thể loại không được trùng !", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
          }
        }
      );
    }
  };

  $scope.openModalAddCategory = function () {
    $scope.codeCategory = "";
    $scope.nameCategory = "";
  };
};
