// https://github.com/irevm/jquery_examples

function getAllArticleData() {
  const article = {
    title: $("#article-title").text(),
    author_id: getSessionUser().id,
    content: [],
  };

  $(".row").each(function () {
    const row = [];
    $(this)
      .find(".row__column")
      .each(function () {
        const column = [];
        $(this)
          .children(".element")
          .each(function () {
            if ($(this).find(".section-title").length) {
              column.push({
                type: "title-section",
                content: $(this).find(".section-title").text(),
              });

              return;
            }

            if ($(this).find("p").length) {
              column.push({
                type: "paragraph",
                content: $(this).find("p").text(),
              });

              return;
            }
            
            if ($(this).find("img").length) {
              column.push({
                type: "image",
                content: $(this).find("img").attr("src"),
              });

              return;
            }
          });
        row.push(column);
      });
    article.content.push(row);
  });

  return article;
}

function saveArticle(published) {
  
}

function loadArticle() {
  const url = new URL(window.location.href);
  const articleId = url.searchParams.get("articleId");

  const articleData = findArticle((article) => article.id == articleId);

  if (!articleData) {
    return;
  }

  $("#article-title").text(articleData.title);

  const rows = articleData.content;
  $("#rows-container").empty(); // Limpiar todo antes de cargar
  rows.forEach((row) => {
    let newRow = '<div class="row">';
    row.forEach((column) => {
      newRow += `<div class="row__column">`;
      column.forEach(element => newRow += createNewElement(element.type, element.content).prop("outerHTML"));
      newRow += `</div>`;
    });

    newRow += `<button title="Eliminar fila" class="row__delete-row-btn"><img src="/diw-whale-project/assets/icons/trash-2.svg" alt="Eliminar fila" /></button></div>`;
    $("#rows-container").append(newRow);
  });

  initializeDroppable();

  // Update the buttons
  $("#save-draft").hide();
  $("#save-article").hide();
  $("#save-update-draft").show();
  $("#save-update-article").show();
  $("#save-update-draft").attr("data-articleId", articleId);
  $("#save-update-article").attr("data-articleId", articleId);
}

function handleSaveArticle() {
  addArticle({ ...getAllArticleData(), published: true });

  alert("Article guardat i publicat");
  window.location.href = "?page=articlesList";
}

function handleSaveDraft() {
  addArticle({ ...getAllArticleData(), published: false });

  alert("Article guardat com a esborray");
  window.location.href = "?page=articlesList";
}

function handleUpdateDraft() {
  const articleId = $(this).attr("data-articleId");
  updateArticle(articleId, false);

  alert("Esborrany guardat");
  window.location.href = "?page=articlesList";
}

function handleUpdateArticle() {
  const articleId = $(this).attr("data-articleId");
  updateArticle(articleId, true);

  alert("Article actualitzat i publicat");
  window.location.href = "?page=articlesList";
}

function createNewElement(elementType, content) {
  if (elementType === "title-section") {
    return $(
      `<div class="element">
        <h3 class="section-title" contenteditable="true">${ content ?? "Títol de secció..."}</h3>
      </div>`
    );
  }

  if (elementType === "paragraph") {
    return $(
      `<div class="element">
        <p contenteditable="true">${ content ?? "Paràgraf..."}</p>
      </div>`
    );
  }

  if (elementType === "image") {
    return $(
      `<div class="element">
        <input type="file" accept="image/*" onchange="loadImage(event)" />
        <img src="${content}" alt="Imagen" style="display: ${content ? "block " : "none"};">
      </div>`
    );
  }
}

function initializeDroppable() {
  $(".row__column").droppable({
    accept: ".tool",
    over: function () {
      $(this).addClass("row__column--over");
    },
    out: function () {
      $(this).removeClass("row__column--over");
    },
    drop: function (event, ui) {
      const type = ui.draggable.data("type");

      $(this).removeClass("row__column--over");

      if ($(this).children().length >= 4) {
        alert("Solo se permiten 4 elementos por columna.");
        return;
      }

      const newElement = createNewElement(type);

      $(this).append(newElement);
      makeColumnsSortable();
    },
  });
}

function makeColumnsSortable() {
  return;
  
  $(".row__column").each(function () {
    $(this).sortable();
  });
}

$(function () {
  // Hacer los elementos de la toolbox arrastrables
  $(".tool").draggable({
    helper: "clone",
    revert: "invalid",
  });

  // Cleaner approach to add events to delete buttons
  $("#rows-container").on("click", ".row__delete-row-btn", function () {
    if(confirm("Segur que vols eliminar aquesta fila?")) {
      $(this).closest(".row").remove();
    }
  });

  $("#editor").on("click", ".add-row-tooltip__btn", function () {
    console.log("adding row");
    addRow($(this).attr("data-cols"));
  });

  $("#admin-panel").on("click", "#add-row", function () {
    $("#add-row-tooltip").toggle();
  });

  $("#admin-panel").on("click", ".add-row-tooltip__btn", function () {
    $("#add-row-tooltip").hide();
  });

  $("#save-draft").on("click", handleSaveDraft);
  $("#save-article").on("click", handleSaveArticle);
  $("#save-update-draft").on("click", handleUpdateDraft);
  $("#save-update-article").on("click", handleUpdateArticle);

  $("#save-draft").show();
  $("#save-article").show();
  $("#save-update-draft").hide();
  $("#save-update-article").hide();

  initializeDroppable();
  loadArticle();
});

function loadImage(event) {
  const input = event.target;
  const reader = new FileReader();
  reader.onload = function () {
    const img = $(input).siblings("img");
    img.attr("src", reader.result);
    img.show();
    $(input).hide();
  };
  reader.readAsDataURL(input.files[0]);
}

function editParagraph(paragraph) {
  const $p = $(paragraph);
  const currentText = $p.text();
  const input = $(`<input type="text" value="${currentText}" />`);

  input.on("blur", function () {
    const newText = $(this).val();
    $p.text(newText);
    $p.show();
    $(this).remove();
  });

  $p.hide();
  $p.after(input);
  input.focus();
}

function addRow(columnCount) {
  let newRow = '<div class="row">';

  if (columnCount == "1") {
    newRow += `<div class="row__column"></div>`;
  } else if (columnCount == "2") {
    newRow += `
      <div class="row__column row__column--half"></div>
      <div class="row__column row__column--half"></div>`;
  } else {
    newRow += `
      <div class="row__column row__column--half"></div>
      <div class="row__column row__column--half"></div>
      <div class="row__column row__column--half"></div>`;
  }

  newRow += `
    <button title="Eliminar fila" class="row__delete-row-btn"><img src="/diw-whale-project/assets/icons/trash-2.svg" alt="Eliminar fila" /></button></div>
    </div>`;
  $("#rows-container").append(newRow);

  initializeDroppable();
}
