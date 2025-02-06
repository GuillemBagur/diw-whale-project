import { fsGetUsers, fsUserGetById, fsUserDelete, fsUserAdd, fsUserUpdate } from "./firebase.js";

const USERS_LOCAL_STORAGE = "whale-users";

const randLen = 16384
var randomId = randLen
var randomArray = new Uint32Array(randLen);

export async function findUser(condition) {
    const users = await getUsers();

    return users.find(condition);
}

export function random32() {
    if (randomId == randLen) {
        randomId = 0
        return crypto.getRandomValues(randomArray)[randomId++] * 2.3283064365386963e-10
    }
    return randomArray[randomId++] * 2.3283064365386963e-10
}

export function setSessionUser(user) {
    localStorage.setItem("whale-session", JSON.stringify(user));
}

export function getSessionUser(failAuthRedirectUrl = "/diw-whale-project/views/index.html") {
    const user = JSON.parse(localStorage.getItem("whale-session"));

    if(user) {
        return user;
    }

    window.location.href = failAuthRedirectUrl;
}

export function logout() {
    localStorage.removeItem("whale-session");
}

export async function getDefaultUser() {
    return await $.getJSON("/diw-whale-project/json/keys.json");
}

export function generateSalt() {
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

export async function seedUsers() {
    const users = await getUsers();
    if(!users.length) {
        addUser(await getDefaultUser())
    }
}

export function hash(string, salt) {
    string += salt;
    return CryptoJS.SHA256(string).toString();
}

export function checkUserPassword(password, user) {
    password = hash(password, user.salt);

    console.log(password, user.password);
    
    return password == user.password;
}

export async function getUsers() {
    let users = await fsGetUsers();

    return users.filter(user => user.active == 1)
}

export function saveUsers(users) {
    localStorage.setItem(USERS_LOCAL_STORAGE, JSON.stringify(users));
}

export async function addUser(userData) {
    await fsUserAdd(generateUser(userData));
}

export async function deleteUser(userId, callback = () => {}) {
    await fsUserDelete(userId);
    callback();
}

export function generateUser(userData) {
    const user = {...userData};
    user.active = 1;
    user.salt = generateSalt();
    user.password = hash(user.password, user.salt);
    user.is_first_login = true;

    return user;
}

/**
 * Totally replaces the data of a user by its id
 * It doesnt make any modification on the password nor other field
 * @param {string} userId The user id
 * @param {object} userNewData All the data that the new object will contain
 */
export async function updateUser(userId, userNewData) {
    await fsUserUpdate(userId, userNewData)
}

export function isMainUser(user) {
    return user.email == "desenvolupador@iesjoanramis.org";
}


$(document).ready(function () {
    seedUsers();
})

