import { addRow } from "./article-editor.js";
import { deleteArticle, getArticlesView, getArticlesViewSortedByCreatedOn } from "./articles.js";
import { fsUserGetById } from "./firebase.js";
import { getSessionUser, getUsers, isMainUser, findUser, updateUser, addUser, logout, hash, deleteUser, getUsersSortedByCreatedOn, checkUserPermission, SESSION_LOCAL_STORAGE } from "./users.js";

export function drawPageChangePassword() {
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

export function clearPage() {
    $("#admin-panel").html("");
}


export function drawCardUser(user) {
    const sessionUserId = localStorage.getItem(SESSION_LOCAL_STORAGE);

    return `
        <article class="card" data-userid="${user.id}">
                <h3 class="card__title">${user.name}</h3>
                <h4 class="card__subtitle">${user.email}</h4>
                ${!isMainUser(user) ? `<a href="/diw-whale-project/views/admin-panel.html?page=userEditor&userId=${user.id}" class="card__button"><img src="/diw-whale-project/assets/icons/pencil.svg" /></a>` : ""}
                ${!isMainUser(user) && user.id != sessionUserId ? `<button id="delete-user" data-userid=${user.id} class="card__button"><img src="/diw-whale-project/assets/icons/trash-2.svg" /></button>` : ""}
        </article>
    `;
}


export async function drawCardArticle(article) {
    function canEdit(user, article) {
        if(isMainUser(user)) {
            return true;
        }

        return user.id == article.author.id;
    }

    const articleLink = article.published ? `target="_blank" href="/diw-whale-project/views/noticia.html?articleId=${article.id}"` : "";

    console.log(article);
    return `
        <article class="card" data-articleid="${article.id}">
                <a class="card__link" ${articleLink}><h3 class="card__title">${article.title}${articleLink ? `<img class="card__icon" src="/diw-whale-project/assets/icons/square-arrow-out-up-right.svg" />` : ""}</h3></a>
                <h4 class="card__subtitle"><img src="/diw-whale-project/assets/icons/user-round.svg" class="card__icon" />${article.author.name}</h4>
                ${canEdit(await getSessionUser(), article) ? `<a href="/diw-whale-project/views/admin-panel.html?page=articleEditor&articleId=${article.id}" class="card__button"><img src="/diw-whale-project/assets/icons/pencil.svg" /></a>` : ""}
                <button id="delete-article" data-articleid=${article.id} class="card__button"><img src="/diw-whale-project/assets/icons/trash-2.svg" /></button>
        </article>
    `;
}


async function drawPageUsersList() {
    if(!checkUserPermission(await getSessionUser(), "edit_users")) {
        alert("No tens permisos per accedir a aquesta pàgina.");
        window.location.href = "/diw-whale-project/views/index.html";
        return
    }

    const storedUsers = await getUsersSortedByCreatedOn();

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

    let $userList = $("#users-list");
    $(storedUsers).each(function (_, user) {
        $userList.append(drawCardUser(user));
    });
}

export function setChecked(prop) {
    return prop ? "checked" : "";
}

async function drawPageUserEditor() {
    const sessionUser = await getSessionUser();

    if(!checkUserPermission(sessionUser, "edit_users")) {
        alert("No tens permisos per accedir a aquesta pàgina.");
        window.location.href = "/diw-whale-project/views/index.html";
        return
    }

    clearPage();

    const url = new URL(window.location.href);
    const userId = url.searchParams.get("userId");

    const emptyUser = {
        name: "",
        email: "",
        edit_news: false,
        edit_bone_files: false,
        edit_users: false,
    }

    let user = emptyUser;
    
    if(userId) {
        user = await fsUserGetById(userId);

        if(isMainUser(user)) {
            alert("L'usuari administrador no es pot editar");
            window.location.href = "/diw-whale-project/views/admin-panel.html";
            return;
        }
    }

    const isUserEditingHimself = userId === sessionUser.id;

    $("#admin-panel").append(`
        <section class="section section--white">
            <h2 class="section__title section__title--dark-blue section__title--centered">Gestionar usuari</h2>
            
            <form id="user-editor" class="form form--over-white form--small">
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
                ${isUserEditingHimself ? "" : `<fieldset class="form__fieldset">
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
                </fieldset>`}

                <div class="form__button-wrapper">
                    <button class="btn-orange btn--block btn--w100 btn--big btn--login" type="submit">Guardar</button>
                    <small class="form__error-msg"></small>
                </div>
            </form>
        </section>
    `);
}


export async function drawPageArticlesList() {
    if(!checkUserPermission(await getSessionUser(), "edit_news")) {
        alert("No tens permisos per accedir a aquesta pàgina.");
        window.location.href = "/diw-whale-project/views/index.html";
        return
    }

    const storedArticles = await getArticlesViewSortedByCreatedOn();

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

    let $articleList = $("#articles-list");
    $(storedArticles).each(async function (_, article) {
        $articleList.append(await drawCardArticle(article));
    });

}

export async function drawPageArticleEditor() {
    if(!checkUserPermission(await getSessionUser(), "edit_news")) {
        alert("No tens permisos per accedir a aquesta pàgina.");
        window.location.href = "/diw-whale-project/views/index.html";
        return
    }

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

export async function drawPageDefault() {
    const user = await getSessionUser();

    console.log(user);

    if(user.edit_news) {
        drawPageArticlesList();
        return;
    }

    if(user.edit_users) {
        drawPageUsersList();
        return;
    }
}

export function handlePages() {
    const url = new URL(window.location.href);
    let page = url.searchParams.get("page");

    if(page == "articleEditor") {
        drawPageArticleEditor();
        return;
    }

    if(page == "articlesList") {
        drawPageArticlesList();
        return;
    }

    if(page == "userEditor") {
        drawPageUserEditor();
        return;
    }

    if(page == "usersList") {
        drawPageUsersList();
        return;
    }

    if(page == "logout") {
        logout();
        window.location.href = "/diw-whale-project/views/index.html";
        return;
    }

    drawPageDefault();
}

export async function drawAdminPanelNav() {
    const sessionUser = await getSessionUser();

    if(sessionUser.edit_users) {
        $("#admin-panel-nav").append(`<a href="?page=usersList" class="admin-panel-nav__link">Usuaris</a>`);
    }

    if(sessionUser.edit_news) {
        $("#admin-panel-nav").append(`<a href="?page=articlesList" class="admin-panel-nav__link">Notícies</a>`);
    }

    if(sessionUser.edit_bone_files) {
        $("#admin-panel-nav").append(`<a href="?page=bonesList" class="admin-panel-nav__link">Fitxes d'ossos</a>`);
    }

    $("#admin-panel-nav").append(`<a href="?page=logout" class="admin-panel-nav__link admin-panel-nav__link--last">Tanca la sessió</a>`);
}

$(async function () {
    const user = await getSessionUser();

    $("#admin-panel").on("submit", "#change-password", async function (e) {
        e.preventDefault();

        const $newPassword = $("#new-password");
        const $newPasswordConfirm = $("#new-password-confirm");

        let isValidated = true;

        isValidated = updateValidation(isValidated,
            validateElement($newPasswordConfirm, (passwordConfirm) => $newPassword.val() == passwordConfirm, "Les contrasenyes no coincideixen."));

        isValidated = updateValidation(isValidated,
            checkRequiredElement($newPasswordConfirm, "Has d'escriure la comprovació de la contrasenya."));

        isValidated = updateValidation(isValidated,
            validateElement($newPassword, validatePassword, "La contrasenya ha de tenir mínim 12 caràcters i ha de contenir números, majúscules, minúscules i almenys un caràcter especial."));

        if (isValidated) {
            user.password = hash($newPassword.val(), user.salt);
            user.is_first_login = false;
            await updateUser(user.id, user);

            window.location.reload();
        }
    });

    $("#admin-panel").on("submit", "#user-editor", async function (e) {

        function checkUserHasAtLeastOnePermission() {
            return $("#edit-news").is(":checked") || $("#edit-bone-files").is(":checked") || $("#edit-users").is(":checked");
        }

        e.preventDefault();

        const url = new URL(window.location.href);
        const sessionUserId = localStorage.getItem("whale-session");
        const userId = url.searchParams.get("userId");
        const isUserEditingHimself = sessionUserId === userId;
        const user = await findUser(user => user.id == userId);
        const isUpdate = !!user;

        const $newPassword = $("#password");
        const $newPasswordConfirm = $("#password-confirm");

        let isValidated = true;

        isValidated = updateValidation(isValidated,
            checkRequiredElement($("#name"), "Has d'escriure el nom de l'usuari."));

        isValidated = updateValidation(isValidated,
            validateElement($("#email"), validateEmail, "L'email no és vàlid."));

        if ($newPassword.val()) {
            isValidated = updateValidation(isValidated,
                validateElement($newPasswordConfirm, (passwordConfirm) => $newPassword.val() == passwordConfirm, "Les contrasenyes no coincideixen."));

            isValidated = updateValidation(isValidated,
                checkRequiredElement($newPasswordConfirm, "Has d'escriure la comprovació de la contrasenya."));

            // If the user was already existing, we validate the new password
            // Any user in the system can enter with an unsafe password
            // New users will be forced to reset their password on enter
            if(isUpdate) {
                isValidated = updateValidation(isValidated,
                    validateElement($newPassword, validatePassword, "La contrasenya ha de tenir mínim 12 caràcters i ha de contenir números, majúscules, minúscules i almenys un caràcter especial."));
            }
        }

        if (isValidated) {
            if(isUpdate) {
                user.name = $("#name").val();
                user.email = $("#email").val();

                if(!isUserEditingHimself) {
                    user.edit_news = $("#edit-news").is(":checked");
                    user.edit_bone_files = $("#edit-bone-files").is(":checked");
                    user.edit_users = $("#edit-users").is(":checked");
                }

                if($newPassword.val()) {
                    user.password = hash($newPassword.val(), user.salt);
                }

                const areChangesValid = isUserEditingHimself || checkUserHasAtLeastOnePermission();

                if(areChangesValid) {
                    await updateUser(userId, user);
                    alert("Usuari actualitzat correctament.");
                    window.location.href = "?page=usersList";

                } else {
                    alert("Has de donar-li mínim un permís a l'usuari.");
                }

            } else {
                let newUser = {};
                newUser.name = $("#name").val();
                newUser.email = $("#email").val();
                newUser.password = $newPassword.val();
                newUser.edit_news = $("#edit-news").is(":checked");
                newUser.edit_bone_files = $("#edit-bone-files").is(":checked");
                newUser.edit_users = $("#edit-users").is(":checked");

                
                if(checkUserHasAtLeastOnePermission()) {
                    await addUser(newUser);
                    alert("Usuari creat correctament.");
                    window.location.href = "?page=usersList";

                } else {
                    alert("Has de donar-li mínim un permís a l'usuari.");
                }
            }

        }
    });

    $("#admin-panel").on("click", "#delete-user", async function(e) {
        if(!confirm("Segur que vols borrar aquest usuari?")) {
            return;
        }

        const userId = e.target.dataset.userid;

        // Modal confirm component under construction
        // drawModalConfirm("Estàs segur que vols eliminar l'usuari " + user.name + "?", () => deleteUser(userId));

        await deleteUser(userId, drawPageUsersList);
        window.location.href = "?page=usersList";
    });

    $("#admin-panel").on("click", "#delete-article", function(e) {
        if(!confirm("Segur que vols borrar aquesta notícia?")) {
            return;
        }

        const articleId = e.target.dataset.articleid;

        // Modal confirm component under construction
        // drawModalConfirm("Estàs segur que vols eliminar la notícia " + article.title + "?", () => deleteArticle(articleId));
        deleteArticle(articleId, drawPageArticlesList);
    });


    if (user.is_first_login ?? true) {
        drawPageChangePassword();
        return;
    }

    drawAdminPanelNav();
    handlePages();
});