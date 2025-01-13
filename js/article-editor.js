// https://github.com/irevm/jquery_examples

function saveArticle() {
    const article = {
      title: $("#article-title").text(),
      author_id: getSessionUser().id,
      content: [],
    };

    $(".row").each(function() {
      const row = [];
      $(this).find(".row__column").each(function() {
        const column = [];
        $(this).children(".element").each(function() {
          if ($(this).find("p").length) {
            column.push({
              type: "paragraph",
              content: $(this).find("p").text()
            });
          } else if ($(this).find("img").length) {
            column.push({
              type: "image",
              src: $(this).find("img").attr("src")
            });
          }
        });
        row.push(column);
      });
      article.content.push(row);
    });

    addArticle(article);

    //!
    alert("Configuración guardada en el navegador.");
}

$(function() {
    // Hacer los elementos de la toolbox arrastrables
    $(".tool").draggable({
      helper: "clone",
      revert: "invalid"
    });

    // Cleaner approach to add events to delete buttons
    $("#rows-container").on("click", ".row__delete-row-btn", function(){
      $(this).closest(".row").remove();
    })
  
    function initializeDroppable() {
      $(".row__column").droppable({
        accept: ".tool",
        over: function() {
          $(this).addClass("row__column--over");
        },
        out: function() {
          $(this).removeClass("row__column--over");
        },
        drop: function(event, ui) {
          const type = ui.draggable.data("type");

          if ($(this).children().length >= 1) {
            alert("Solo se permite un elemento en esta columna.");
            return;
          }
  
          let newElement;
          if (type === "paragraph") {
            newElement = $(
              `<div class="element">
                <p class="editable" onclick="editParagraph(this)">Escribe aquí tu texto...</p>
              </div>`
            );
          } else if (type === "image") {
            newElement = $(
              `<div class="element">
                <input type="file" accept="image/*" onchange="loadImage(event)" />
                <img src="" alt="Imagen" style="display: none;">
              </div>`
            );
          }
  
          $(this).append(newElement);
          makeElementsDraggable();
        }
      });
    }
  
    function makeElementsDraggable() {
      $(".element").draggable({
        helper: "original",
        revert: "invalid"
      });
    }
  
    $("#add-row").on("click", function() {
      const columnCount = $("#column-choice").val();
      let newRow = '<div class="row">';
      
      if (columnCount === "1") {
        newRow += `<div class="column row__column"></div>`;
      } else {
        newRow += `
          <div class="row__column row__column--half"></div>
          <div class="row__column row__column--half"></div>`;
      }
  
      newRow += `
        <button class="row__delete-row-btn">Eliminar fila</button>
        </div>`;
      $("#rows-container").append(newRow);
  
      initializeDroppable();
    });

    $("#save-config").on("click", saveArticle);
  
    // Cargar configuración
    $("#load-config").on("click", function() {
      const config = localStorage.getItem("postBuilderConfig");
      if (!config) {
        alert("No hay configuración guardada.");
        return;
      }
  
      const rows = JSON.parse(config);
      $("#rows-container").empty(); // Limpiar todo antes de cargar
      rows.forEach(row => {
        let newRow = '<div class="row">';
        row.forEach(column => {
          newRow += column.length > 1 ? `<div class="column row__column column row__column--half">` : `<div class="column row__column">`;
          column.forEach(element => {
            if (element.type === "paragraph") {
              newRow += `
                <div class="element">
                  <p class="editable" onclick="editParagraph(this)">${element.content}</p>
                </div>`;
            } else if (element.type === "image") {
              newRow += `
                <div class="element">
                  <img src="${element.src}" alt="Imagen">
                </div>`;
            }
          });
          newRow += `</div>`;
        });

        newRow += `<button class="row__delete-row-btn">Eliminar fila</button></div>`;
        $("#rows-container").append(newRow);
      });
  
      initializeDroppable();
    });
  
    initializeDroppable();
  });
  
  function loadImage(event) {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = function() {
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
  
    input.on("blur", function() {
      const newText = $(this).val();
      $p.text(newText);
      $p.show();
      $(this).remove();
    });
  
    $p.hide();
    $p.after(input);
    input.focus();
  }