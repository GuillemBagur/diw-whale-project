const ARTICLES_LOCAL_STORAGE = "whale-articles";

function findArticle(condition) {
  const articles = getArticles();

  return articles.find(condition);
}

function getArticleByUrl() {
  const url = new URL(window.location.href);
  const articleId = url.searchParams.get("articleId");

  const articleData = findArticle((article) => article.id == articleId);

  return articleData;
}

function joinAuthorToArticle(article) {
  let articleView = { ...article };
  const author = findUser((user) => article?.author_id === user.id);
  articleView.author = author;
  return articleView;
}

function getArticles(condition = () => true) {
  let articles = localStorage.getItem(ARTICLES_LOCAL_STORAGE);
  
  articles = JSON.parse(articles) ?? [];
  articles = articles.filter(condition);

  return articles;
}

// Rich data version of article (with author data)
// Simulates an SQL view
function getArticlesView(condition = () => true) {
  let articles = getArticles(condition);

  if(!articles) {
    return;
  }

  articles = articles.map(function (article) {
    return joinAuthorToArticle(article);
  });

  return articles;
}

function saveArticles(articles) {
  localStorage.setItem(ARTICLES_LOCAL_STORAGE, JSON.stringify(articles));
}

function addArticle(article) {
  let articles = getArticles();

  // Assign ID to that article
  let lastId = articles[articles.length - 1]?.id ?? 0;
  article.id = Number(lastId) + 1;
  article.created_on = new Date();

  articles.push(article);

  saveArticles(articles);
}

function deleteArticle(articleId, callback = () => {}) {
  const articles = getArticles();

  const articleIndex = articles.findIndex(
    (article) => article.id == articleId
  );

  articles.splice(articleIndex, 1);

  saveArticles(articles);
  callback();
}

function updateArticle(articleId, published) {
  const articleNewData = getAllArticleData();
  articleNewData.id = articleId;
  articleNewData.published = published;
  articleNewData.created_on = new Date();

  const articles = getArticles();

  const articleIndex = articles.findIndex(
    (article) => article.id == articleId
  );

  articles[articleIndex] = articleNewData;

  console.log(articleNewData);
  console.log(articles);

  saveArticles(articles);
}
