require('dotenv').config();
const admin = require('firebase-admin');

if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn("⚠️  Variáveis de ambiente do Firebase não encontradas. O sistema não funcionará corretamente até que você preencha o arquivo .env.");
} else {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            })
        });
        console.log("🔥 Firebase Admin inicializado com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao inicializar Firebase:", error.message);
    }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = { db, admin };
