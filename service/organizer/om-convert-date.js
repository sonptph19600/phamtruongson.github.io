app.service("OmConvertDate", function () {
  this.converter = function (date) {
    if (date == null) {
      return null;
    }
    
    let dateTime = new Date(date);
    let year = dateTime.getFullYear();
    let month = String(dateTime.getMonth() + 1).padStart(2, "0");
    let day = String(dateTime.getDate()).padStart(2, "0");
    let hours = String(dateTime.getHours()).padStart(2, "0");
    let minutes = String(dateTime.getMinutes()).padStart(2, "0");
    let seconds = String(dateTime.getSeconds()).padStart(2, "0");

    let newFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return newFormat;
  };
});
