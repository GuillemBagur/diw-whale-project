import { fsArticleAdd, fsArticleDelete, fsArticlesGet } from "./firebase.js";
import { findUser, getUsers } from "./users.js";

const ARTICLES_LOCAL_STORAGE = "whale-articles";

export async function findArticle(condition) {
  const articles = await getArticles();

  return articles.find(condition);
}

export async function getArticleByUrl() {
  const url = new URL(window.location.href);
  const articleId = url.searchParams.get("articleId");

  const [articleData] = await getArticlesView((article) => article.id == articleId);

  return articleData;
}

export async function getArticles(condition = () => true) {
  let articles = await fsArticlesGet();
  articles = articles.filter(condition);
  articles = articles.map(article => ({...article, content: JSON.parse(article.content)}))

  return articles;
}

// Rich data version of article (with author data)
// Simulates an SQL view
export async function getArticlesView(condition = () => true) {
  
  // Identifies what user from the array is the author of the param-given-article
  // Returns a merged array
  function joinAuthorToArticle(article, users) {
    let articleView = { ...article };
    const author = users.find((user) => article?.author_id == user.id);
    articleView.author = author;
    return articleView;
  }

  let articles = await getArticles(condition);

  if(!articles) {
    return [];
  }

  const users = await getUsers();

  articles = articles.map(function (article) {
    return joinAuthorToArticle(article, users);
  });

  return articles;
}

export async function getArticlesViewSortedByCreatedOn(condition = () => true) {
  return (await getArticlesView(condition)).sort((a, b) => b.created_on.seconds - a.created_on.seconds);
}

export function saveArticles(articles) {
  localStorage.setItem(ARTICLES_LOCAL_STORAGE, JSON.stringify(articles));
}

export async function addArticle(article) {
  article.content = JSON.stringify(article.content);
  article.created_on = new Date();
  article.updated_on = new Date();
  await fsArticleAdd(article);
}

export function deleteArticle(articleId, callback = () => {}) {
  fsArticleDelete(articleId);
  callback();
}

