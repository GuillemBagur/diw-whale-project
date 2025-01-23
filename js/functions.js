// Converts a locale ISO date into a readable date
function stringToHumanDate(strDate) {
    console.log(strDate);
    strDate = strDate?.split("T")[0];
    return new Date(strDate).toLocaleDateString(
        "ca-ES",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
}