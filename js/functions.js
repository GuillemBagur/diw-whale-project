import { MAX_FILE_SIZE_UPLOAD } from "./globals.js";

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

export function convertFileToBase64(file, callback) {
  // Convierte la imagen a base64
  const reader = new FileReader();

  reader.onload = async function (e) {
    const base64Image = e.target.result; // Imagen en formato base64

    callback(base64Image);
  };

  reader.readAsDataURL(file);
}

export function loadImage(input) {
  const file = input.files[0];

  if(file.size >= MAX_FILE_SIZE_UPLOAD) {
    alert("La imatge és massa gran.");
    return;
  }

  convertFileToBase64(input.files[0], image => $(input).parent().find("img").attr("src", image));
}