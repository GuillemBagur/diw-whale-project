const accMenu = document.getElementById("acc-menu");
const accMenuContainer = document.getElementById("acc-menu-foreground");
const accToggle = document.getElementById("acc-toggle");

const nav = document.querySelector("body nav");
const main = document.querySelector("body main");
const footer = document.querySelector("body footer");

const accSetContrast = document.getElementById("acc-set-contrast");

const accDecFontSize = document.getElementById("acc-dec-font-size");
const accIncFontSize = document.getElementById("acc-inc-font-size");

const accDecLineHeight = document.getElementById("acc-dec-line-height");
const accIncLineHeight = document.getElementById("acc-inc-line-height");

const accDecWordSpacing = document.getElementById("acc-dec-word-spacing");
const accIncWordSpacing = document.getElementById("acc-inc-word-spacing");

const accDecLetterSpacing = document.getElementById("acc-dec-letter-spacing");
const accIncLetterSpacing = document.getElementById("acc-inc-letter-spacing");


let accDefaultConf = {
    fontSize: 0,
    lineHeight: 0,
    wordSpacing: 0,
    letterSpacing: 0,
    filter: "default",
}

let accStoredValues = loadSelection();
applyValues(accStoredValues);

function saveSelection() {
    localStorage.setItem("whale-accessibility", JSON.stringify(accStoredValues));
}

function loadSelection() {
    try {
        let result = JSON.parse(localStorage.getItem("whale-accessibility"));

        if (!result) {
            throw new Error();
        }

        return result;

    } catch (err) {
        return accDefaultConf;
    }
}

function applyValues(accStoredValues) {
    changeStyle("fontSize", accStoredValues.fontSize);
    changeStyle("lineHeight", accStoredValues.lineHeight);
    changeStyle("wordSpacing", accStoredValues.wordSpacing);
    changeStyle("letterSpacing", accStoredValues.letterSpacing);
}

function clearUnitsFromStyle(style) {
    return style.replace(/(r?em|px)$/, "");
}

function changeStyle(style, variation) {

    const allTextElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, label");

    for (let i = 0; i < allTextElements.length; i++) {
        const currentStyle = Number(clearUnitsFromStyle(window.getComputedStyle(allTextElements[i])[style]));

        if (currentStyle) {
            allTextElements[i].style[style] = (currentStyle + (currentStyle * variation / 100)) / 16 + "rem";
        }
    }
}

function changeStyleAndUpdate(style, variation) {
    function updateStoredValues(variation) {
        if (!accStoredValues[style]) {
            accStoredValues[style] = 0;
        }

        accStoredValues[style] += variation;
    }


    changeStyle(style, variation);

    updateStoredValues(variation);
    saveSelection();
}


document.addEventListener("DOMContentLoaded", function () {
    accToggle.addEventListener("click", function () {
        accMenu.classList.toggle("acc-menu--hidden");
        accMenuContainer.classList.toggle("acc-menu-foreground--hidden");
    });

    accMenuContainer.addEventListener("click", function () {
        if (!accMenu.classList.contains("acc-menu--hidden")) {
            accMenu.classList.add("acc-menu--hidden");
            accMenuContainer.classList.add("acc-menu-foreground--hidden");
        }
    });

    accDecFontSize.addEventListener("click", () => changeStyleAndUpdate("fontSize", -5));
    accIncFontSize.addEventListener("click", () => changeStyleAndUpdate("fontSize", 5));

    accDecLineHeight.addEventListener("click", () => changeStyleAndUpdate("lineHeight", -5));
    accIncLineHeight.addEventListener("click", () => changeStyleAndUpdate("lineHeight", 5));

    accDecWordSpacing.addEventListener("click", () => changeStyleAndUpdate("wordSpacing", -10));
    accIncWordSpacing.addEventListener("click", () => changeStyleAndUpdate("wordSpacing", 10));

    accDecLetterSpacing.addEventListener("click", () => changeStyleAndUpdate("letterSpacing", -5));
    accIncLetterSpacing.addEventListener("click", () => changeStyleAndUpdate("letterSpacing", 5));

    accSetContrast.addEventListener("change", function () {
        const filters = {
            default: "none",
            grayscale: "grayscale(100%)",
            "dark-contrast": "invert(0%)",
            "light-contrast": "contrast(150%) invert(100%)",
            "high-saturation": "saturate(300%)",
            "low-saturation": "saturate(30%)",
        };

        nav.style.filter = filters[this.value];
        main.style.filter = filters[this.value];
        footer.style.filter = filters[this.value];

        if (this.value === "light-contrast") {
            main.classList.add("main--inverted");
        }
    })
});