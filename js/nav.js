const expandNavBtn = document.getElementById("expand-nav-btn");
const navLinks = document.getElementById("nav-links");

expandNavBtn.addEventListener("click", function() {
    navLinks.classList.toggle("nav__links--hidden");
})