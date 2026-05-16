const { db } = require('./firebase-config');

const Database = {
    // --- Produtos ---
    async getProducts() {
        if (!db) return [];
        const snapshot = await db.collection('products').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async addProduct(product) {
        if (!db) return null;
        const res = await db.collection('products').add(product);
        return res.id;
    },

    async deleteProduct(id) {
        if (!db) return null;
        await db.collection('products').doc(id).delete();
        return true;
    },

    // --- Pedidos ---
    async createOrder(name, email, total, cart) {
        if (!db) return null;
        const orderRef = await db.collection('orders').add({
            customer_name: name,
            customer_email: email,
            total_price: total,
            status: 'PENDING',
            created_at: new Date().toISOString()
        });

        // Adicionar itens como subcoleção ou array (escolhendo subcoleção para melhor escalabilidade)
        const itemsPromises = cart.map(item => 
            db.collection('orders').doc(orderRef.id).collection('items').add(item)
        );
        await Promise.all(itemsPromises);

        return orderRef.id;
    },

    // --- Usuários ---
    async registerUser(userData) {
        if (!db) return null;
        // Verificar se e-mail já existe
        const userQuery = await db.collection('users').where('email', '==', userData.email).get();
        if (!userQuery.empty) throw new Error("E-mail já cadastrado!");

        const res = await db.collection('users').add({
            ...userData,
            created_at: new Date().toISOString()
        });
        return res.id;
    },

    async loginUser(email, password) {
        if (!db) return null;
        const snapshot = await db.collection('users')
            .where('email', '==', email)
            .where('password', '==', password)
            .get();

        if (snapshot.empty) return null;
        const userDoc = snapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    },

    async getUsers() {
        if (!db) return [];
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password; // Segurança: não retornar senha
            return { id: doc.id, ...data };
        });
    }
};

module.exports = Database;
