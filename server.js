const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database-firestore'); // Troca SQLite por Firestore

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./'));

// Rota para listar produtos
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.getProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para adicionar um produto (Admin)
app.post('/api/products', async (req, res) => {
    try {
        const id = await db.addProduct(req.body);
        res.json({ message: "Produto adicionado!", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para deletar um produto (Admin)
app.delete('/api/products/:id', async (req, res) => {
    try {
        await db.deleteProduct(req.params.id);
        res.json({ message: "Produto removido!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um pedido
app.post('/api/orders', async (req, res) => {
    const { name, email, cart, total } = req.body;
    try {
        const orderId = await db.createOrder(name, email, total, cart);
        res.json({ message: "Pedido realizado com sucesso!", orderId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota de Cadastro de Usuário
app.post('/api/register', async (req, res) => {
    try {
        const userId = await db.registerUser(req.body);
        res.json({ message: "Usuário cadastrado com sucesso!", userId });
    } catch (err) {
        if (err.message.includes('cadastrado')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.loginUser(email, password);
        if (!user) return res.status(401).json({ error: "Credenciais inválidas!" });
        res.json({ message: "Login realizado!", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para listar usuários (Admin)
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;

