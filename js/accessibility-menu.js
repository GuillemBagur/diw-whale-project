const accMenu = document.getElementById("acc-menu");
const accMenuContainer = document.getElementById("acc-menu-foreground");
const accToggle = document.getElementById("acc-toggle");
const accReset = document.getElementById("acc-reset");

const nav = document.querySelector("body nav");
const main = document.querySelector("body main");
const footer = document.querySelector("body footer");

const accSetFilter = document.getElementById("acc-set-filter");

const accDecFontSize = document.getElementById("acc-dec-font-size");
const accIncFontSize = document.getElementById("acc-inc-font-size");

const accDecLineHeight = document.getElementById("acc-dec-line-height");
const accIncLineHeight = document.getElementById("acc-inc-line-height");

const accDecWordSpacing = document.getElementById("acc-dec-word-spacing");
const accIncWordSpacing = document.getElementById("acc-inc-word-spacing");

const accDecLetterSpacing = document.getElementById("acc-dec-letter-spacing");
const accIncLetterSpacing = document.getElementById("acc-inc-letter-spacing");

const filters = {
    default: "none",
    grayscale: "grayscale(100%)",
    "dark-contrast": "invert(0%)",
    "light-contrast": "contrast(150%) invert(100%)",
    "high-saturation": "saturate(300%)",
    "low-saturation": "saturate(30%)",
};


let accDefaultConf = {
    fontSize: 0,
    lineHeight: 0,
    wordSpacing: 0,
    letterSpacing: 0,
    filter: "default",
}

const ACC_CONSTRAINTS = {
    fontSize: {
        min: -15,
        max: 30,
    },

    lineHeight: {
        min: 0,
        max: 85,
    },

    wordSpacing: {
        min: 0,
        max: 250,
    },

    letterSpacing: {
        min: 0,
        max: 150,
    },
}

let accStoredValues = loadSelection();
applyValues(accStoredValues)

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

function setSelectFilterValue(filterName) {
    const filterId = Object.keys(filters).indexOf(filterName);
    accSetFilter.selectedIndex = filterId;
}

function applyValues(accStoredValues) {
    changeStyle("fontSize", accStoredValues.fontSize);
    changeStyle("lineHeight", accStoredValues.lineHeight);
    changeStyle("wordSpacing", accStoredValues.wordSpacing);
    changeStyle("letterSpacing", accStoredValues.letterSpacing);

    console.log(accStoredValues);
    applyFilter(accStoredValues.filter);
}

function clearUnitsFromStyle(style) {
    return style.replace(/(r?em|px)$/, "");
}

function checkCurrentValueCanIncrease(style, currentValue) {
    return ACC_CONSTRAINTS[style].max > currentValue;
}

function checkCurrentValueCanDecrease(style, currentValue) {
    return ACC_CONSTRAINTS[style].min < currentValue;
}

function checkVariationIsValid(style, currentValue, variation) {
    if (variation > 0) {
        return checkCurrentValueCanIncrease(style, currentValue);
    }

    if (variation < 0) {
        return checkCurrentValueCanDecrease(style, currentValue);
    }

    return true;
}

function convertPxToRem(value) {
    return +value / 16 + "rem";
}

function changeStyle(style, variation) {
    const allTextElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, label");

    for (let i = 0; i < allTextElements.length; i++) {
        const currentValue = Number(clearUnitsFromStyle(window.getComputedStyle(allTextElements[i])[style]));

        if (currentValue) {
            allTextElements[i].style[style] = convertPxToRem(currentValue + (currentValue * variation / 100));
        }
    }

    return true;
}

function changeStyleWithValidation(style, variation) {
    if (!checkVariationIsValid(style, accStoredValues[style], variation)) {
        return false;
    }

    changeStyle(style, variation);

    return true;
}

function updateStoredValues(variation, style) {
    if (!accStoredValues?.[style]) {
        accStoredValues[style] = 0;
    }

    accStoredValues[style] += variation;
}

function resetAccValues() {
    accStoredValues = accDefaultConf;
    saveSelection();
    window.location.reload();
}

function changeStyleAndUpdate(style, variation) {
    if (!changeStyleWithValidation(style, variation)) {
        return;
    }

    updateStoredValues(variation, style);
    saveSelection();
}

function applyFilter(filter) {
    setSelectFilterValue(filter);

    nav.style.filter = filters[filter];
    main.style.filter = filters[filter];
    footer.style.filter = filters[filter];

    if (filter == "light-contrast") {
        main.classList.add("main--inverted");
    }
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

    accSetFilter.addEventListener("change", function () {
        applyFilter(this.value);
        accStoredValues.filter = this.value;
        saveSelection();
    })


    accReset.addEventListener("click", resetAccValues);
});