const sqlite3 = require('sqlite3').verbose();
const dbSQLite = new sqlite3.Database('./database.sqlite');
const DatabaseFirestore = require('../database-firestore');
const { db } = require('../firebase-config');

async function migrate() {
    if (!db) {
        console.error("❌ Firebase não configurado. Abortando migração.");
        return;
    }

    console.log("🚀 Iniciando migração de dados...");

    // 1. Migrar Produtos
    dbSQLite.all("SELECT * FROM products", [], async (err, rows) => {
        if (err) throw err;
        console.log(`📦 Migrando ${rows.length} produtos...`);
        for (const row of rows) {
            const { id, ...data } = row; // Remove ID do SQLite para deixar o Firestore gerar um
            await DatabaseFirestore.addProduct(data);
        }
        console.log("✅ Produtos migrados.");
    });

    // 2. Migrar Usuários
    dbSQLite.all("SELECT * FROM users", [], async (err, rows) => {
        if (err) throw err;
        console.log(`👤 Migrando ${rows.length} usuários...`);
        for (const row of rows) {
            const { id, ...data } = row;
            try {
                await DatabaseFirestore.registerUser(data);
            } catch (e) {
                console.warn(`⚠️  Usuário ${data.email} já existe ou erro: ${e.message}`);
            }
        }
        console.log("✅ Usuários migrados.");
    });

    // Nota: Migrar Pedidos é mais complexo devido às chaves estrangeiras.
    // Como os IDs mudam no Firestore, os relacionamentos order_id precisam ser mapeados.
    // Para simplificar esta primeira versão, vamos migrar os produtos e usuários primeiro.
}

migrate().catch(console.error);
