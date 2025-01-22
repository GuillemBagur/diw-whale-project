function drawArticleElement(elementType, content) {
  if (elementType === "title-section") {
    return $(`<h2 class="title">${content}</h2>`);
  }

  if (elementType === "paragraph") {
    return $(
      `<p class="flex-1 basis-0 text-justify text-brown font-sans text-lg mt-6">${content}</p>`
    );
  }

  if (elementType === "image") {
    return $(
      `<img src="${content}" alt="Imagen" class="flex-1 basis-0 overflow-hidden w-full max-w-[40rem] md:float-right md:mx-6 md:my-2" />`
    );
  }
}

function drawArticle() {
  const articleData = joinAuthorToArticle(getArticleByUrl());

  $("#article-title").html(articleData.title);
  $("#article-author-name").html(articleData.author.name);
  $("#article-date").html(articleData.date);


  $("#article-content").empty(); // Limpiar todo antes de cargar

  const rows = articleData.content;
  rows.forEach((row) => {
    let newRow = "<div>";
    row.forEach((column) => {
      column.forEach(
        (element) => {
          newRow += "<div class='flex'>";
          newRow += drawArticleElement(element.type, element.content).prop(
            "outerHTML"
          );
          newRow += "</div>";
        }
      );
    });

    newRow += `</div>`;
    $("#article-content").append(newRow);
  });
}


drawArticle();