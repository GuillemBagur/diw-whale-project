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
        <article class="user-card" data-userid="${user.id}">
                <h3 class="user-card__name">${user.name}</h3>
                <h4 class="user-card__email">${user.email}</h4>
                <button id="update-user" data-userid=${user.id} class="user-card__button"><img src="/diw-whale-project/assets/icons/pencil.svg" /></button>
                ${isMainUser(user) ? `<button id="delete-user" data-userid=${user.id} class="user-card__button"><img src="/diw-whale-project/assets/icons/trash-2.svg" /></button>` : ""}
        </article>
    `;
}

function drawPageManageUsers() {
    const storedUsers = getUsers();

    clearPage();
    $("#admin-panel").append(`
        <section class="section">
            <h2 class="section__title section__title--mt-5">Gestionar usuaris</h2>
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

function drawPageUpdateUser(userId) {
    clearPage();

    const user = findUser(user => user.id === +userId);

    $("#admin-panel").append(`
        <section class="section section--white">
            <h2 class="section__title section__title--brown section__title--centered section__title--mt-5">Editar usuari</h2>
            
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

function drawPageCreateArticle() {
    clearPage();

    $("#admin-panel").append(`
        <section class="section section--white">
            <h1 class="section__title section__title--dark-blue">Post Editor</h1>
        
            <div class="builder">
                <div>
                    <button class="btn-dark-blue" id="add-row">Añadir Fila</button>
                    <button class="btn-dark-blue" id="save-config">Guardar Configuración</button>
                </div>

                <div class="toolbox">
                    <h3>Elements i dissenys</h3>

                    <div class="tool" data-type="title-section">Títol de secció</div>
                    <div class="tool" data-type="paragraph">Paràgraf</div>
                    <div class="tool" data-type="image">Imatge</div>

                    <label for="column-choice">Número de columnas por fila:</label>
                    <select id="column-choice">
                        <option value="1">1 columna</option>
                        <option value="2">2 columnas</option>
                    </select>
                </div>

                <div id="editor" class="editor">
                <h2 id="article-title" class="section__title section__title--brown" contenteditable="true">Títol de la notícia...</h2>
                <div id="rows-container" class="rows-container"></div>
                <button id="add-row" class="btn-add-row">+<button>
                
                <div id="add-row-tooltip" class="add-row-tooltip">
                    <button data-cols="1" class="add-row-tooltip__btn">1<button>
                    <button data-cols="2" class="add-row-tooltip__btn">2<button>
                    <button data-cols="3" class="add-row-tooltip__btn">3<button>
                </div>
                </div>
            </div>
        </section>
    `);

    $("#toolbar > .create-article__block").draggable({
        revert: "invalid",
    });

    $("#toolbar").droppable({
        
    });



    $("#article-structure").droppable({
        drop: function(e, ui) {
            $element = ui.draggable;
            console.log($element);
            $(this).append(`<div class="${$element.attr("class")}"></div>`);
            console.log($(this).html());
        }
    });
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

            drawPageManageUsers();
        }
    });

    $("#admin-panel").on("click", "#delete-user", function(e) {
        const userId = e.target.dataset.userid;

        // Modal confirm component under construction
        // drawModalConfirm("Estàs segur que vols eliminar l'usuari " + user.name + "?", () => deleteUser(userId));

        deleteUser(userId);
    });

    $("#admin-panel").on("click", "#update-user, .user-card", function(e) {
        const userId = e.target.dataset.userid;

        drawPageUpdateUser(userId);
    });

    if (user.is_first_login ?? true) {
        drawPageChangePassword();
        return;
    }

    drawPageCreateArticle();
});