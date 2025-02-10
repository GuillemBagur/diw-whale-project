// https://github.com/irevm/jquery_examples
import { addArticle, findArticle, getArticleByUrl, getArticles, saveArticles } from "./articles.js";
import { fsArticleUpdate } from "./firebase.js";
import { getSessionUser, isMainUser } from "./users.js";
import { convertFileToBase64 } from "./functions.js";
import { MAX_FILE_SIZE_UPLOAD } from "./globals.js";

async function getAllArticleData() {
  const article = {
    title: $("#article-title").text(),
    author_id: (await getSessionUser()).id,
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

async function loadArticle() {
  const articleData = await getArticleByUrl();

  if (!articleData) {
    $("#save-draft").show();
    $("#save-article").show();
    $("#save-update-draft").hide();
    $("#save-update-article").hide();
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
  $("#save-update-draft").attr("data-articleId", articleData.id);
  $("#save-update-article").attr("data-articleId", articleData.id);
}

async function handleSaveArticle() {
  if(blockUnallowedUserToCreate()) {
    return;
  }

  const articleData = await getAllArticleData();
  await addArticle({ ...articleData, published: true });

  alert("Article guardat i publicat");
  window.location.href = "?page=articlesList";
}

async function handleSaveDraft() {
  if(blockUnallowedUserToCreate()) {
    return;
  }

  const articleData = await getAllArticleData();
  await addArticle({ ...articleData, published: false });

  alert("Article guardat com a esborray");
  window.location.href = "?page=articlesList";
}


async function updateArticle(articleId, published) {
  if(blockUnallowedUserToEdit(articleId)) {
    return false;
  }

  const article = await findArticle(article => article.id == articleId);

  const articleNewData = await getAllArticleData();
  articleNewData.published = published;
  articleNewData.content = JSON.stringify(articleNewData.content);
  articleNewData.updated_on = new Date();
  console.log(articleId, articleNewData);
  await fsArticleUpdate(articleId, {...article, ...articleNewData});
  return true;
}

async function handleUpdateDraft() {
  const articleId = $(this).attr("data-articleId");
  if(await updateArticle(articleId, false)) {
    alert("Esborrany guardat");
    window.location.href = "?page=articlesList";
  }

}

async function handleUpdateArticle() {
  const articleId = $(this).attr("data-articleId");

  if(await updateArticle(articleId, true)) {
    alert("Article actualitzat i publicat");
    window.location.href = "?page=articlesList";
  }
}

function createNewElement(elementType, content) {
  if (elementType == "title-section") {
    return $(
      `<div class="element">
        <h3 class="section-title" contenteditable="true">${ content ?? "Títol de secció..."}</h3>
      </div>`
    );
  }

  if (elementType == "paragraph") {
    return $(
      `<div class="element">
        <p contenteditable="true">${ content ?? "Paràgraf..."}</p>
      </div>`
    );
  }

  if (elementType == "image") {
    return $(
      `<div class="element">
        <input type="file" class="load-image" accept="image/*" />
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

// Atm, the columns wont be sortable
export function makeColumnsSortable() {
  return;
  
  $(".row__column").each(function () {
    $(this).sortable();
  });
}

export async function checkUserisAllowedToCreate() {
  const sessionUser = await getSessionUser();

  if(isMainUser(sessionUser)) {
    return true;
  }

  return sessionUser.edit_news;
}

export async function checkUserIsAllowedToEdit(articleId) {
  const sessionUser = await getSessionUser();
  
  console.log(sessionUser, isMainUser(sessionUser));

  if(isMainUser(sessionUser)) {
    return true;
  }
  
  const article = findArticle(article => article.id == articleId);
  return sessionUser.edit_news && sessionUser.id == article.author_id;
}

export function blockUnallowedUserToCreate() {
  if(!checkUserisAllowedToCreate()) {
    alert("No pots crear notícies.");
    window.location.href = "/diw-whale-project/views/admin-panel.html";
    return true;
  }

  return false;
}


export function blockUnallowedUserToEdit(articleId) {
  if(!checkUserIsAllowedToEdit(articleId)) {
    alert("No pots editar aquesta notícia.");
    window.location.href = "/diw-whale-project/views/admin-panel.html";
    return true;
  }

  return false;
}

$(async function () {
  $("#save-draft").show();
  $("#save-article").show();
  $("#save-update-draft").hide();
  $("#save-update-article").hide();


  await loadArticle();

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

  $(".load-image").on("change", function(e) {
    loadImage(e.target);
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

  initializeDroppable();

});

export function loadImage(input) {
  const file = input.files[0];

  if(file.size >= MAX_FILE_SIZE_UPLOAD) {
    alert("La imatge és massa gran.");
    return;
  }

  convertFileToBase64(input.files[0], image => $(input).parent().find("img").attr("src", image));
}

export function editParagraph(paragraph) {
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

export function addRow(columnCount) {
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
