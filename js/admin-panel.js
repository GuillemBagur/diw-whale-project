function drawPageChangePassword() {
    $("#admin-panel").append(`<div class="modal-overlay"></div>`);
    $("#admin-panel").append(`
        <div id="change-password" class="modal">
            <h2 class="modal__title">Has de canviar la contrasenya</h2>

            <form class="form form--over-white" id="change-password">
                <div class="form__control">
                    <label class="form__label" for="new-password">Nova contrasenya</label>
                    <input type="password" id="new-password" class="input-text" placeholder="La contrasenya ha de tenir mínim 12 caràcters" />
                    <small class="form__error-msg"></small>
                </div>
                <div class="form__control">
                    <label class="form__label" for="new-password-confirm">Confirma la contrasenya</label>
                    <input type="password" id="new-password-confirm" class="input-text" placeholder="Les dues contrenyes han de ser idèntiques" />
                    <small class="form__error-msg"></small>
                </div>
                <div class="form__button-wrapper">
                    <button class="btn-orange btn--block btn--w100 btn--big btn--login" type="submit">Canvia</button>
                    <small class="form__error-msg"></small>
                </div>
            </form>
        </div>
    `);
}

function clearPage() {
    $("#admin-panel").html("");
}


function drawCardUser(user) {
    return `
        <article class="card" data-userid="${user.id}">
                <h3 class="card__title">${user.name}</h3>
                <h4 class="card__subtitle">${user.email}</h4>
                <button id="update-user" data-userid=${user.id} class="card__button"><img src="/diw-whale-project/assets/icons/pencil.svg" /></button>
                ${!isMainUser(user) ? `<button id="delete-user" data-userid=${user.id} class="card__button"><img src="/diw-whale-project/assets/icons/trash-2.svg" /></button>` : ""}
        </article>
    `;
}


function drawCardArticle(article) {
    return `
        <article class="card" data-articleid="${article.id}">
                <a class="card__link" target="_blank" href="/diw-whale-project/views/noticia.html?articleId=${article.id}"><h3 class="card__title">${article.title}<img class="card__icon" src="/diw-whale-project/assets/icons/square-arrow-out-up-right.svg" /></h3></a>
                <h4 class="card__subtitle"><img src="/diw-whale-project/assets/icons/user-round.svg" class="card__icon" />${article.author.name}</h4>
                <a href="/diw-whale-project/views/admin-panel.html?page=articleEditor&articleId=${article.id}" class="card__button"><img src="/diw-whale-project/assets/icons/pencil.svg" /></a>
                <button id="delete-article" data-articleid=${article.id} class="card__button"><img src="/diw-whale-project/assets/icons/trash-2.svg" /></button>
        </article>
    `;
}


function drawPageUsersList() {
    const storedUsers = getUsers();

    clearPage();
    $("#admin-panel").append(`
        <section class="section">
            <div class="section__header">
                <h2 class="section__title section__title--dark-blue">Gestionar usuaris</h2>
                <a class="btn-dark-blue" href="?page=userEditor"><img src="/diw-whale-project/assets/icons/plus.svg" />Crear usuari</a>
            </div>

            <article class="users-list" id="users-list">
            </article>
        </section>
    `);

    $userList = $("#users-list");
    $(storedUsers).each(function (_, user) {
        $userList.append(drawCardUser(user));
    });
}

function setChecked(prop) {
    return prop ? "checked" : "";
}

function drawPageUserEditor(userId) {
    clearPage();

    const emptyUser = {
        name: "",
        email: "",
        edit_news: false,
        edit_bone_files: false,
        edit_users: false,
    }
    const user = findUser(user => user.id === +userId) ?? emptyUser;

    $("#admin-panel").append(`
        <section class="section section--white">
            <h2 class="section__title section__title--dark-blue section__title--centered">Gestionar usuari</h2>
            
            <form id="edit-user" class="form form--over-white form--small">
                <div class="form__control">
                    <label class="form__label" for="name">Nom d'usuari</label>
                    <input type="text" id="name" class="input-text" placeholder="Escriu el nom d'usuari" value="${user.name}" />
                    <small class="form__error-msg"></small>
                </div>
                <div class="form__control">
                    <label class="form__label" for="email">Email</label>
                    <input type="text" id="email" class="input-text" placeholder="Escriu l'email" value="${user.email}" />
                    <small class="form__error-msg"></small>
                </div>
                <div class="form__control">
                    <label class="form__label" for="password">Contrasenya</label>
                    <input type="password" id="password" class="input-text" placeholder="Utilitza lletres, números i símbols especials i mínim 12 caràcters" />
                    <small class="form__error-msg"></small>
                </div>
                <div class="form__control">
                    <label class="form__label" for="password-confirm">Confirma la contrasenya</label>
                    <input type="password" id="password-confirm" class="input-text" placeholder="Les dues contrenyes han de ser idèntiques" />
                    <small class="form__error-msg"></small>
                </div>
                <fieldset class="form__fieldset">
                    <legend class="form__legend">Permisos</legend>

                    <div class="form__control">
                        <label class="form__label" for="edit-news"><input type="checkbox" class="input-checkbox" id="edit-news" ${setChecked(user.edit_news)} />Pot esciure/editar notícies</label>
                        
                    </div>
                    <div class="form__control">
                        <label class="form__label" for="edit-bone-files"><input type="checkbox" class="input-checkbox" id="edit-bone-files" ${setChecked(user.edit_bone_files)} />Pot esciure/editar fitxes d'ossos</label>
                        
                    </div>
                    <div class="form__control">
                        <label class="form__label" for="edit-users"><input type="checkbox" class="input-checkbox" id="edit-users" ${setChecked(user.edit_users)} />Pot crear/editar usuaris</label>
                        
                    </div>
                </fieldset>

                <div class="form__button-wrapper">
                    <button class="btn-orange btn--block btn--w100 btn--big btn--login" type="submit">Canvia</button>
                    <small class="form__error-msg"></small>
                </div>
            </form>
        </section>
    `);
}


function drawPageArticlesList() {
    const storedArticles = getArticlesView();

    clearPage();
    $("#admin-panel").append(`
        <section class="section">
            <div class="section__header">
                <h2 class="section__title section__title--dark-blue">Gestionar notícies</h2>
                <a class="btn-dark-blue" href="?page=articleEditor"><img src="/diw-whale-project/assets/icons/plus.svg" />Crear notícia</a>
            </div>
            <article class="articles-list" id="articles-list">
            </article>
        </section>
    `);

    $articleList = $("#articles-list");
    $(storedArticles).each(function (_, article) {
        $articleList.append(drawCardArticle(article));
    });

}

function drawPageArticleEditor() {
    clearPage();

    $("#admin-panel").append(`
        <section class="section section--white">
            <h1 class="section__title section__title--dark-blue">Post Editor</h1>
        
            <div class="builder">
                <div class="toolbox">
                    <h3 class="toolbox__title">Eines</h3>

                    <div class="tool" data-type="title-section"><img src="/diw-whale-project/assets/icons/type-outline.svg" /><span class="tool__name">Títol de secció</span></div>
                    <div class="tool" data-type="paragraph"><img src="/diw-whale-project/assets/icons/text.svg" /><span class="tool__name">Paràgraf</span></div>
                    <div class="tool" data-type="image"><img src="/diw-whale-project/assets/icons/image.svg" /><span class="tool__name">Imatge</span></div>
                </div>

                <div id="editor" class="editor">
                    <h2 id="article-title" class="section__title section__title--brown" contenteditable="true">Títol de la notícia...</h2>
                    <div id="rows-container" class="rows-container"></div>
                    <button id="add-row" class="btn-add-row"><img src="/diw-whale-project/assets/icons/plus-dark.svg" /></button>
                    
                    <div id="add-row-tooltip" class="add-row-tooltip">
                        <button title="1 columna" data-cols="1" class="add-row-tooltip__btn"><img src="/diw-whale-project/assets/icons/square.svg" /></button>
                        <button title="2 columnes" data-cols="2" class="add-row-tooltip__btn"><img src="/diw-whale-project/assets/icons/columns-2.svg" /></button>
                        <button title="3 columnes" data-cols="3" class="add-row-tooltip__btn"><img src="/diw-whale-project/assets/icons/columns-3.svg" /></button>
                    </div>
                </div>
            </div>

            <div class="builder-buttons-wrapper">
            <button class="btn-secondary" id="save-draft">Guardar esborrany</button>
            <button class="btn-dark-blue" id="save-article">Guardar i publicar</button>
            <button class="btn-secondary" id="save-update-draft">Actualitzar esborrany</button>
            <button class="btn-dark-blue" id="save-update-article">Actualitzar i publicar</button>
            </div>
        </section>
    `);

    $("#toolbar > .create-article__block").draggable({
        revert: "invalid",
    });

    $("#toolbar > .create-article__block").draggable({
        revert: "invalid",
    });


    $("#add-row-tooltip").hide();
    addRow("1");
    
}

function drawPageDefault() {
    console.log("Default page");
    drawPageArticlesList();
}

function handlePages() {
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page");

    if(page === "articleEditor") {
        drawPageArticleEditor();
        return;
    }

    if(page === "articlesList") {
        drawPageArticlesList();
        return;
    }

    if(page === "userEditor") {
        drawPageUserEditor();
        return;
    }

    if(page === "usersList") {
        drawPageUsersList();
        return;
    }

    drawPageDefault();
}


$(function () {
    const user = getSessionUser();

    $("#admin-panel").on("submit", "#change-password", function (e) {
        e.preventDefault();

        const $newPassword = $("#new-password");
        const $newPasswordConfirm = $("#new-password-confirm");

        let isValidated = true;

        isValidated = updateValidation(isValidated,
            validateElement($newPasswordConfirm, (passwordConfirm) => $newPassword.val() === passwordConfirm, "Les contrasenyes no coincideixen."));

        isValidated = updateValidation(isValidated,
            checkRequiredElement($newPasswordConfirm, "Has d'escriure la comprovació de la contrasenya."));

        isValidated = updateValidation(isValidated,
            validateElement($newPassword, validatePassword, "La contrasenya ha de tenir números, majúscules, minúscules i almenys un caràcter especial."));

        if (isValidated) {
            user.password = hash($newPassword.val(), user.salt);
            user.is_first_login = false;
            updateUser(user.id, user);
            setSessionUser(user);
            window.location.reload();
        }
    });

    $("#admin-panel").on("submit", "#edit-user", function (e) {
        e.preventDefault();

        const $newPassword = $("#new-password");
        const $newPasswordConfirm = $("#new-password-confirm");

        let isValidated = true;

        isValidated = updateValidation(isValidated,
            checkRequiredElement($("#name"), "Has d'escriure el nom de l'usuari."));

        isValidated = updateValidation(isValidated,
            validateElement($("#email"), validateEmail, "L'email no és vàlid."));

        if ($newPassword.val()) {
            isValidated = updateValidation(isValidated,
                validateElement($newPasswordConfirm, (passwordConfirm) => $newPassword.val() === passwordConfirm, "Les contrasenyes no coincideixen."));

            isValidated = updateValidation(isValidated,
                checkRequiredElement($newPasswordConfirm, "Has d'escriure la comprovació de la contrasenya."));

            isValidated = updateValidation(isValidated,
                validateElement($newPassword, validatePassword, "La contrasenya ha de tenir números, majúscules, minúscules i almenys un caràcter especial."));
        }

        if (isValidated) {
            if($newPassword.val()) {
                user.password = hash($newPassword.val(), user.salt);
            }

            user.name = $("#name").val();
            user.email = $("#email").val();
            user.edit_news = $("#edit-news").is(":checked");
            user.edit_bone_files = $("#edit-bone-files").is(":checked");
            user.edit_users = $("#edit-users").is(":checked");

            updateUser(user.id, user);

            drawPageUsersList();
        }
    });

    $("#admin-panel").on("click", "#delete-user", function(e) {
        const userId = e.target.dataset.userid;

        // Modal confirm component under construction
        // drawModalConfirm("Estàs segur que vols eliminar l'usuari " + user.name + "?", () => deleteUser(userId));

        deleteUser(userId, drawPageUsersList);
    });

    $("#admin-panel").on("click", "#update-user, .user-card", function(e) {
        const userId = e.target.dataset.userid;

        drawPageUserEditor(userId);
    });

    $("#admin-panel").on("click", "#delete-article", function(e) {
        const articleId = e.target.dataset.articleid;

        // Modal confirm component under construction
        // drawModalConfirm("Estàs segur que vols eliminar la notícia " + article.title + "?", () => deleteArticle(articleId));
        deleteArticle(articleId, drawPageArticlesList);
    });

    $("#admin-panel").on("click", "#update-article", function(e) {
        const articleId = e.target.dataset.articleid;

        drawPageArticleEditor(articleId);
    });


    if (user.is_first_login ?? true) {
        drawPageChangePassword();
        return;
    }

    handlePages();
});