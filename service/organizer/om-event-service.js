app.service("OmEventService", function ($http) {
  var events = [];

  this.getEvents = function () {
    return events;
  };

  var detailEvent = [];

  this.getDetail = function () {
    return detailEvent;
  };

  this.fetchEvents = function (obj) {
    if (obj.status == null) {
      return $http
        .get(
          apiURL +
            "/organizer/event?idOrganizer=" +
            obj.idOrganizer +
            "&name=" +
            obj.name +
            "&idCategory=" +
            obj.idCategory +
            "&startTime=" +
            obj.startTime +
            "&endTime=" +
            obj.endTime +
            "&formality=" +
            obj.formality +
            "&statusSort=" +
            obj.statusSort
        )
        .then(
          function (response) {
            if (response.status === 200) {
              events = response.data.data;
            }
            return response;
          },
          function (errors) {
            console.log(errors);
          }
        );
    } else {
      return $http
        .get(
          apiURL +
            "/organizer/event?idOrganizer=" +
            obj.idOrganizer +
            "&status=" +
            obj.status +
            "&name=" +
            obj.name +
            "&idCategory=" +
            obj.idCategory +
            "&startTime=" +
            obj.startTime +
            "&endTime=" +
            obj.endTime +
            "&formality=" +
            obj.formality +
            "&statusSort=" +
            obj.statusSort
        )
        .then(
          function (response) {
            if (response.status === 200) {
              events = response.data.data;
            }
            return response;
          },
          function (errors) {
            console.log(errors);
          }
        );
    }
  };

  this.fetchDetail = function (idEvent) {
    return $http.get(apiURL + "/organizer/event/" + idEvent).then(
      function (response) {
        if (response.status === 200) {
          detailEvent = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});

app.service("ConvertLongToDateString", function () {
  let result = "";
  let resultMonthDay = "";
  let resultMonthDayYear = "";

  this.setMonthDay = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${monthName} ${day}`;
    resultMonthDay = formattedTime;
    return formattedTime;
  };

  this.setDateString = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = `${monthName} ${day} at ${formattedHours}:${formattedMinutes}`;
    result = formattedTime;
    return formattedTime;
  };

  this.getDateString = function () {
    return result;
  };

  this.getMonthDay = function () {
    return resultMonthDay;
  };

  this.setDateYearString = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = `${monthName} ${day}, ${year} at ${formattedHours}:${formattedMinutes}`;
    resultMonthDayYear = formattedTime;
    return formattedTime;
  };

  this.getDateYearString = function () {
    return resultMonthDayYear;
  };
});
