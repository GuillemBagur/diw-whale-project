import { getArticleByUrl, getArticlesView, getArticlesViewSortedByCreatedOn } from "./articles.js";
import { stringToHumanDate } from "./functions.js";

function drawArticleElement(elementType, content) {
  if (elementType == "title-section") {
    return $(
      `<h2 class="font-serif text-darkblue text-3xl font-bold">${content}</h2>`
    );
  }

  if (elementType == "paragraph") {
    return $(
      `<p class="text-justify text-brown font-sans text-lg mb-6">${content}</p>`
    );
  }

  if (elementType == "image") {
    return $(
      `<img src="${content}" alt="Imagen" class="w-full object-cover" />`
    );
  }
}

export async function drawArticle() {
  const articleData = await getArticleByUrl();

  if (!articleData?.published) {
    alert("No s'ha trobat aquesta notícia.");
    window.location.href = "/diw-whale-project/views/index.html";
    return;
  }

  $("#article-title").html(articleData.title);
  $("#article-author-name").html(articleData.author.name);
  $("#article-date").html(
    `Darrera modif. ${stringToHumanDate(articleData.updated_on)}`
  );

  $("#article-content").empty(); // Limpiar todo antes de cargar

  const rows = articleData.content;
  rows.forEach((row) => {
    let newRow = "";
    newRow += "<div class='flex mb-8 gap-8'>";
    row.forEach((column) => {
      newRow += "<div class='flex-1 basis-0'>";
      column.forEach((element) => {
        newRow += drawArticleElement(element.type, element.content).prop(
          "outerHTML"
        );
      });
      newRow += "</div>";
    });

    newRow += `</div>`;
    $("#article-content").append(newRow);
  });
}

function getFirstImageInArticle(article) {
  return article?.content.flat(2).find((column) => column.type == "image");
}

function getFirstParagraphInArticle(article) {
  return article?.content.flat(2).find((column) => column.type == "paragraph");
}

export async function drawArticlesPreview(numArticlesToDisplay) {
  let articles = await getArticlesViewSortedByCreatedOn(
    (article) => article.published
  );

  if(numArticlesToDisplay) {
    articles = articles.slice(0, numArticlesToDisplay);
  }

  if(!articles.length) {
    $("#articles-wrapper").append(`<section class="mt-[5rem] mb-[10rem] md:mb-[3rem]"><article class="relative">
        <h2 class="text-brown font-serif">No s'han trobat notícies encara.</h2>
    </section`);
  }

  for (let article of articles) {
    const imageSrc = getFirstImageInArticle(article)?.content;
    let articleHtml = `<section class="mt-[5rem] mb-[10rem] md:mb-[3rem]"><article class="relative">`;
    articleHtml += `<h2 class="article-title">${article.title}</h2>`;
    articleHtml += `
      <div class="flex gap-4 mt-3 mb-8">
        <img class="h-14 rounded-full" src="/diw-whale-project/assets/imgs/avatar.png"
            alt="L'autor de la notícia">
        <div>
            <h3 class="text-brown text-lg font-serif">${
              article.author.name
            }</h3>
            <h4 class="text-brown text-sm opacity-70 font-serif">Darrera modif. ${stringToHumanDate(
              article.updated_on
            )}</h4>
        </div>
    </div>
    `;

    if (imageSrc) {
      articleHtml += `<img class="rounded-xl w-full max-h-[30rem] object-cover" src="${imageSrc}" alt="Imatge del procés de restauració.">`;
    }

    articleHtml += `
    <div class="relative">
        <div class="absolute top-0 h-full w-full bg-gradient-to-b from-transparent to-white"></div>
        <p class="text-justify text-brown font-sans text-lg mt-6">
          ${getFirstParagraphInArticle(article)?.content ?? ""}
        </p>
    </div>`;

    articleHtml += `<a href="noticia.html?articleId=${article.id}" class="button-main">Llegir</a></article></section>`;

    $("#articles-wrapper").append(articleHtml);
  }
}
