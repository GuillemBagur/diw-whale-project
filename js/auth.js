const USERS_LOCAL_STORAGE = "whale-users";

const randLen = 16384
var randomId = randLen
var randomArray = new Uint32Array(randLen);

function findUser(condition) {
    const users = getUsers();

    return users.find(condition);
}

function random32() {
    if (randomId == randLen) {
        randomId = 0
        return crypto.getRandomValues(randomArray)[randomId++] * 2.3283064365386963e-10
    }
    return randomArray[randomId++] * 2.3283064365386963e-10
}

function setSessionUser(user) {
    localStorage.setItem("whale-session", JSON.stringify(user));
}

function getSessionUser(failAuthRedirectUrl = "/diw-whale-project/views/index.html") {
    const user = JSON.parse(localStorage.getItem("whale-session"));

    if(user) {
        console.log(user);
        return user;
    }

    window.location.href = failAuthRedirectUrl;
}

function logout() {
    localStorage.removeItem("whale-session");
}

async function getDefaultUser() {
    return await $.getJSON("/diw-whale-project/json/keys.json");
}

async function addDefaultUserToLocalStorage() {
    const user = generateUser(await getDefaultUser());
    addUser(user);
}

function generateSalt() {
    const SALT_LEN = 16;
    const STARTING_VALID_ASCII_CHARS = 33;
    const ENDING_VALID_ASCII_CHARS = 126;
    let salt = "";

    for (let i = 0; i < SALT_LEN; i++) {
        const charNum = Math.floor(STARTING_VALID_ASCII_CHARS + random32() * (ENDING_VALID_ASCII_CHARS - STARTING_VALID_ASCII_CHARS));
        let char = String.fromCharCode(charNum);
        salt += char;
    }

    return salt;
}

function seedUsers() {
    if(!getUsers().length) {
        addDefaultUserToLocalStorage();
    }
}

function hash(string, salt) {
    string += salt;
    return CryptoJS.SHA256(string).toString();
}

function checkUserPassword(password, user) {
    console.log(password);
    password = hash(password, user.salt);

    console.log(password, user.password, user.salt);

    return password == user.password;
}

function getUsers() {
    let users = localStorage.getItem(USERS_LOCAL_STORAGE);

    return JSON.parse(users) ?? [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_LOCAL_STORAGE, JSON.stringify(users));
}

function addUser(user) {
    let users = getUsers();

    
    // Assign ID to that user
    let lastId = users[users.length -1]?.id ?? 0;
    user.id = Number(lastId) + 1;

    users.push(user);
    
    if(user.is_first_login == undefined) {
        user.is_first_login = true;
    }

    saveUsers(users);
}

function deleteUser(userId, callback = () => {}) {
    const users = getUsers();

    const userIndex = users.findIndex(user => user.id == userId);

    users.splice(userIndex, 1);

    saveUsers(users);
    callback();
}

function generateUser(userData) {
    const user = {...userData};
    user.salt = generateSalt();
    console.log(userData);
    user.password = hash(user.password, user.salt);

    console.log(user);
    return user;
}

function updateUser(userId, userNewData) {
    const users = getUsers();
    
    const userIndex = users.findIndex(user => user.id == userId);
    
    if(userNewData.password) {
        userNewData.password = hash(userNewData.password, users[userIndex].salt);
    }

    users[userIndex] = userNewData;

    saveUsers(users);
}

function isMainUser(user) {
    return user.id == 1;
}


$(document).ready(function () {
    seedUsers();
})

