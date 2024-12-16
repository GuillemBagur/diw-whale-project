function drawModalConfirm(question, callback) {
    function hide() {
        $(".modal").hide();
    }

    function execCallback() {
        callback();
        hide();
    }

    $("#admin-panel").append(`
        <div class="modal">
            <h2 class="modal__title">${question}</h2>

            <button onclick="${execCallback}" class"btn btn--block btn-dark-blue">Acceptar</button>
            <button onclick="hide" class"btn btn--block btn-white">Cancel·lar</button>
        </div>
    `);
}