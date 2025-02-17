const domNav = document.getElementById("nav");
const userId = localStorage.getItem("whale-session"); // Should be better to use global var, but is unavailable as this is not a module.

domNav.innerHTML = `
<button class="nav-hamburger" id="expand-nav-btn">
<img src="/diw-whale-project/assets/icons/menu.svg" alt="Hamburger" class="nav-hamburger__img">
</button>

<!-- I'll use this structure because it can handle webp images with a fallback -->
<!-- https://stackoverflow.com/questions/65529016/webp-fallback-for-img-tag-in-html -->
<a href="/diw-whale-project/views/index.html">
<picture>
<source type="image/webp" srcset="/diw-whale-project/assets/imgs/logo-w-portrait.webp">
<img class="nav__logo" src="/diw-whale-project/assets/imgs/logo-w-portrait.png" alt="Logo Portrait">
</picture>
</a>

<ul class="nav__links nav__links--hidden" id="nav-links">
<li class="nav__li"><a href="/diw-whale-project/views/index.html" class="nav__link">Inici</a></li>
<li class="nav__li"><a href="/diw-whale-project/views/about-balena.html" class="nav__link">Sobre la
balena</a></li>
<li class="nav__li"><a href="/" class="nav__link">Història</a></li>
<li class="nav__li"><a href="/diw-whale-project/views/portfolio.html" class="nav__link">Procés</a></li>
<li class="nav__li"><a href="/diw-whale-project/views/noticies.html" class="nav__link">Notícies</a></li>
<li class="nav__li"><a href="/diw-whale-project/views/login.html" class="nav__link">${userId ? "Administració" : "Login"}</a></li>
</ul>
`;

const expandNavBtn = document.getElementById("expand-nav-btn");
const navLinks = document.getElementById("nav-links");
expandNavBtn.addEventListener("click", function () {
  navLinks.classList.toggle("nav__links--hidden");
});
