const domDisplayBone = document.getElementById("display-bone");
const domDisplayBoneForeground = document.getElementById("display-bone-foreground");

function showDisplayBone() {
    domDisplayBone.classList.remove("display-bone--hidden");
    domDisplayBoneForeground.classList.remove("display-bone-foreground--hidden");
}

function hideDisplayBone() {
    domDisplayBone.classList.add("display-bone--hidden");
    domDisplayBoneForeground.classList.add("display-bone-foreground--hidden");
}

document.addEventListener("click", function (e) {
    if (!e.target.dataset.role) {
        return;
    }

    showDisplayBone();
})

domDisplayBoneForeground.addEventListener("click", function () {
    hideDisplayBone();
});