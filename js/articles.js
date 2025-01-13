const ARTICLES_LOCAL_STORAGE = "whale-articles";

function findArticle(condition) {
    const articles = getArticles();

    return articles.find(condition);
}


async function addDefaultArticleToLocalStorage() {
    const article = await getDefaultArticle();
    addArticle(article);
}


function getArticles() {
    let articles = localStorage.getItem(ARTICLES_LOCAL_STORAGE);

    return JSON.parse(articles) ?? [];
}

function saveArticles(articles) {
    localStorage.setItem(ARTICLES_LOCAL_STORAGE, JSON.stringify(articles));
}

function addArticle(article) {
    let articles = getArticles();

    articles.push(article);

    saveArticles(articles);
}

function deleteArticle(articleId) {
    const articles = getArticles();

    const articleIndex = articles.findIndex(article => article.id === articleId);

    articles.splice(articleIndex, 1);

    saveArticles(articles);
}

function updateArticle(articleId, articleNewData) {
    const articles = getArticles();

    const articleIndex = articles.findIndex(article => article.id === articleId);

    articles[articleIndex] = articleNewData;

    saveArticles(articles);
}


