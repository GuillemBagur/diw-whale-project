import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  collection,
  doc,
  getFirestore,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  where,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCchzPqD0YgLjz_eNV0iv745OUgrquoUs0",
  authDomain: "diw-whale.firebaseapp.com",
  projectId: "diw-whale",
  storageBucket: "diw-whale.firebasestorage.app",
  messagingSenderId: "208534224250",
  appId: "1:208534224250:web:bb0d6b45e80cc6bc02eac3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

function formatDoc(doc) {
  return {id: doc.id, ...doc.data()};
}

export async function fsGetUsers() {
  let users = [];

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((user) => users.push(formatDoc(user)));

  return users;
}

export async function fsUserGetById(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));

  return formatDoc(userDoc);
}

export async function fsUserGetWhere(condition) {
  const q = query(collection(db, "users"), where(condition));
  const userDoc = (await getDocs(q).limit(1))[0];

  return formatDoc(userDoc);
}

export async function fsUserAdd(user) {
  await addDoc(collection(db, "users"), user);
}

export async function fsUserUpdate(userId, userNewData) {
  await setDoc(doc(db, "users", userId), userNewData);
}

export async function fsUserDelete(userId) {
  await deleteDoc(doc(db, "users", userId));
}

export async function fsArticleUpdate(articleId, articleNewData) {
  await setDoc(doc(db, "articles", articleId), articleNewData);
}

export async function fsArticlesGet() {
  let articles = [];

  const querySnapshot = await getDocs(collection(db, "articles"));
  querySnapshot.forEach((article) => articles.push(formatDoc(article)));

  return articles;
}

export async function fsArticleDelete(articleId) {
  await deleteDoc(doc(db, "articles", articleId));
}


export async function fsArticleAdd(article) {
  await addDoc(collection(db, "articles"), article);
}
