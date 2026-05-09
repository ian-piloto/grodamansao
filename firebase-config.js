// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Substitua as informações abaixo pelas chaves do seu projeto no Firebase Console
// Configurações do Projeto > Geral > Seus aplicativos > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYCHv3WzTc8a9yS3ufqCtb-2JFSKXVHRc",
  authDomain: "gorodamansao.firebaseapp.com",
  projectId: "gorodamansao",
  storageBucket: "gorodamansao.appspot.com",
  messagingSenderId: "1055555555555", // Valor temporário (seria ideal o real)
  appId: "1:1055555555555:web:abcdef123456" // Valor temporário (seria ideal o real)
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
