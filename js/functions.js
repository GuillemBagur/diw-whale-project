// Converts a locale ISO date into a readable date
export function stringToHumanDate(timestamp) {
  let strDate = timestamp.toDate().toISOString();

  strDate = strDate?.split("T")[0];
  return new Date(strDate).toLocaleDateString("ca-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
