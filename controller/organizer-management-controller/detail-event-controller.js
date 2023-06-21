window.DetailEventController = function (
  $scope,
  $http,
  $routeParams,
  $location,
  OmCategoryService,
  OmEventService,
  OmConvertDate,
  OmResourceService
) {
  document.querySelector("body").scrollTop = 0;
  OmCategoryService.fetchCategories().then(function () {
    $scope.listCategory = OmCategoryService.getCategories();
  });

  $scope.idEvent = $routeParams.id;

  OmResourceService.fetchResources($scope.idEvent).then(function () {
    $scope.listResource = OmResourceService.getResources();
  });

  OmEventService.fetchDetail($scope.idEvent).then(function () {
    $scope.detailEvent = OmEventService.getDetail();
    document.title = $scope.detailEvent.name + " | Portal Event";
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

  $scope.deleteThumbnail = function () {
    document.querySelector("#showImageThumbnail").src = "";
    $scope.detailEvent.thumbnailPath = null;
    $scope.statusUpdateThumbnail = 1;
  };

  $scope.deleteBackground = function () {
    document.querySelector("#showImageBackground").src = "";
    $scope.detailEvent.backgroundPath = null;
    $scope.statusUpdateBackground = 1;
  };

  document
    .querySelector("#valueThumbnailEvent")
    .addEventListener("input", function () {
      var formData = new FormData();
      var file = document.querySelector("#valueThumbnailEvent").files[0];
      formData.append("file", file);
      $scope.detailEvent.thumbnailPath = "thumbnailPath";
      $scope.$apply();
      document.querySelector("#showImageThumbnail").src =
        URL.createObjectURL(file);
    });

  document
    .querySelector("#valueBackgroundEvent")
    .addEventListener("input", function () {
      var formData = new FormData();
      var file = document.querySelector("#valueBackgroundEvent").files[0];
      formData.append("file", file);
      $scope.detailEvent.backgroundPath = "backgroundPath";
      $scope.$apply();
      document.querySelector("#showImageBackground").src =
        URL.createObjectURL(file);
    });

  var guid = () => {
    var w = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return `${w()}${w()}-${w()}-${w()}-${w()}-${w()}${w()}${w()}`;
  };

  $scope.statusUpdateBackground = 0;
  $scope.statusUpdateThumbnail = 0;

  $scope.saveEvent = function () {
    let check = 0;
    if ($scope.detailEvent.name == "") {
      $scope.errorNameEvent = "Tên sự kiện không được để trống";
      ++check;
    } else {
      $scope.errorNameEvent = "";
    }
    if ($scope.detailEvent.startTime == "") {
      $scope.errorStartTimeEvent = "Thời gian bắt đầu không được để trống";
      ++check;
    } else {
      $scope.errorStartTimeEvent = "";
    }
    if ($scope.detailEvent.endTime == "") {
      $scope.errorEndTimeEvent = "Thời gian kết thúc không được để trống";
      ++check;
    } else {
      $scope.errorEndTimeEvent = "";
    }
    if ($scope.detailEvent.formality == "") {
      $scope.errorFormalityEvent = "Hãy chọn hình thức của sự kiện";
      ++check;
    } else {
      $scope.errorFormalityEvent = "";
    }
    if ($scope.detailEvent.location == "") {
      $scope.errorLocationEvent = "Địa điểm của sự kiện không được để trống";
      ++check;
    } else {
      $scope.errorLocationEvent = "";
    }
    if ($scope.detailEvent.startTime != "") {
      if (
        new Date($scope.detailEvent.startTime) >=
        new Date($scope.detailEvent.endTime)
      ) {
        $scope.errorEndTimeEvent =
          "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
        ++check;
      } else {
        $scope.errorEndTimeEvent = "";
      }
    }

    if (check == 0) {
      let obj = {
        id: $scope.idEvent,
        name: $scope.detailEvent.name,
        startTime: OmConvertDate.converter($scope.detailEvent.startTime),
        endTime: OmConvertDate.converter($scope.detailEvent.endTime),
        formality: $scope.detailEvent.formality,
        location: $scope.detailEvent.location,
        idCategory: $scope.detailEvent.categoryId,
        description: $scope.detailEvent.description,
        background: $scope.detailEvent.backgroundPath,
        thumbnail: $scope.detailEvent.thumbnailPath,
        statusUpdateBackground: $scope.statusUpdateBackground,
        statusUpdateThumbnail: $scope.statusUpdateThumbnail,
        status: $scope.detailEvent.status + "",
      };

      let valueThumbnailEvent = document.querySelector("#valueThumbnailEvent")
        .files[0];
      let valueBackgroundEvent = document.querySelector("#valueBackgroundEvent")
        .files[0];
      let uuidThumbnail = guid() + ".jpg";
      let uuidBackground = guid() + ".jpg";
      if (valueThumbnailEvent != null && valueThumbnailEvent != undefined) {
        obj.thumbnail = uuidThumbnail;
        obj.statusUpdateThumbnail = 1;
      }
      if (valueBackgroundEvent != null && valueBackgroundEvent != undefined) {
        obj.background = uuidBackground;
        obj.statusUpdateBackground = 1;
      }

      $http.put("http://localhost:1626/organizer/event", obj).then(
        function (response) {
          toastr.success("Cập nhật thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
        },
        function (error) {}
      );

      let formData = new FormData();
      if (
        valueThumbnailEvent != "" &&
        valueThumbnailEvent != null &&
        valueThumbnailEvent != undefined
      ) {
        let newFileThumbnail = new File([valueThumbnailEvent], uuidThumbnail, {
          type: valueThumbnailEvent.type,
        });
        formData.append("fileThumbnail", newFileThumbnail);
      }

      if (
        valueBackgroundEvent != "" &&
        valueBackgroundEvent != null &&
        valueBackgroundEvent != undefined
      ) {
        let newFileBackground = new File(
          [valueBackgroundEvent],
          uuidBackground,
          { type: valueBackgroundEvent.type }
        );
        formData.append("fileBackground", newFileBackground);
      }

      if (
        (valueBackgroundEvent != "" &&
          valueBackgroundEvent != null &&
          valueBackgroundEvent != undefined) ||
        (valueThumbnailEvent != "" &&
          valueThumbnailEvent != null &&
          valueThumbnailEvent != undefined)
      ) {
        formData.append("idEvent", $scope.idEvent);
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
        idEvent: $scope.idEvent,
      };

      $http.post("http://localhost:1626/organizer/resource", obj).then(
        function (response) {
          toastr.success("Thêm thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          let resource = response.data.data;
          let obj = {
            id: resource.id,
            name: resource.name,
            path: resource.path,
            description: resource.description,
          };
          $scope.listResource.unshift(obj);
        },
        function (error) {}
      );

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

  $scope.openModalUpdateResource = function (
    index,
    id,
    name,
    path,
    description
  ) {
    $scope.indexUpdateResource = index;
    $scope.idResourceUpdate = id;
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
        id: $scope.idResourceUpdate,
        name: $scope.nameResourceUpdate,
        path: $scope.pathResourceUpdate,
        description: $scope.descriptionResourceUpdate,
        idEvent: $scope.idEvent,
      };
      $http.put("http://localhost:1626/organizer/resource", obj).then(
        function (response) {
          toastr.success("Cập nhật thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          let resource = response.data.data;
          let obj = {
            id: resource.id,
            name: resource.name,
            path: resource.path,
            description: resource.description,
          };
          $scope.listResource[$scope.indexUpdateResource] = obj;
        },
        function (error) {}
      );

      $("#modal_update_resource").modal("hide");
    }
  };

  $scope.deleteResource = function (index, id) {
    let check = confirm("Bạn có chắc muốn xóa tài nguyên này không ?");
    if (check) {
      $scope.listResource.splice(index, 1);
      $http.delete("http://localhost:1626/organizer/resource/" + id).then(
        function (response) {
          toastr.success("Xóa thành công !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
        },
        function (error) {}
      );
      if ($scope.listResource.length == 0) {
        $scope.dataResourceEmpty = "Chưa có tài nguyên nào !!!";
      } else {
        $scope.dataResourceEmpty = "";
      }
    }
  };

  window.addEventListener("scroll", () => {
    const scrollTopBtn = document.getElementById("scroll-top-btn");
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollDistanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    if (scrollDistanceFromBottom < 170) {
      scrollTopBtn.style.display = "none";
    } else {
      scrollTopBtn.style.display = "block";
    }
  });
};
