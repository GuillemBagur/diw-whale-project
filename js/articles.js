const ARTICLES_LOCAL_STORAGE = "whale-articles";

function findArticle(condition) {
  const articles = getArticles();

  return articles.find(condition);
}

function joinAuthorToArticle(article) {
  let articleView = { ...article };
  const author = findUser((user) => article.author_id === user.id);
  articleView.author = author;
  return articleView;
}

function getArticles() {
  let articles = localStorage.getItem(ARTICLES_LOCAL_STORAGE);

  return JSON.parse(articles) ?? [];
}

// Rich data version of article (with author data)
// Simulates an SQL view
function getArticlesView() {
  let articles = getArticles();

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
  article.id = lastId + 1;

  articles.push(article);

  saveArticles(articles);
}

function deleteArticle(articleId, callback) {
  const articles = getArticles();

  const articleIndex = articles.findIndex(
    (article) => article.id == articleId
  );

  articles.splice(articleIndex, 1);

  saveArticles(articles);
  callback();
}

function updateArticle(articleId) {
  const articleNewData = getAllArticleData();

  const articles = getArticles();

  const articleIndex = articles.findIndex(
    (article) => article.id === articleId
  );

  articles[articleIndex] = articleNewData;

  console.log(articleNewData);

  saveArticles(articles);
}
