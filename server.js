const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve os arquivos estáticos (HTML, etc)

// Rota para listar produtos
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Rota para adicionar um produto (Admin)
app.post('/api/products', (req, res) => {
    const { name, price, description, tag, glow_color, image_url } = req.body;
    db.run(
        "INSERT INTO products (name, price, description, tag, glow_color, image_url) VALUES (?, ?, ?, ?, ?, ?)",
        [name, price, description, tag, glow_color, image_url],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produto adicionado!", id: this.lastID });
        }
    );
});

// Rota para deletar um produto (Admin)
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM products WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Produto removido!" });
    });
});

// Rota para criar um pedido
app.post('/api/orders', (req, res) => {
    const { name, email, cart, total } = req.body;
    
    db.run(
        "INSERT INTO orders (customer_name, customer_email, total_price) VALUES (?, ?, ?)",
        [name, email, total],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            const orderId = this.lastID;
            const stmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            
            cart.forEach(item => {
                stmt.run(orderId, item.id, item.quantity, item.price);
            });
            
            stmt.finalize();
            res.json({ message: "Pedido realizado com sucesso!", orderId });
        }
    );
});

// Rota de Cadastro de Usuário
app.post('/api/register', (req, res) => {
    const { name, email, password, phone } = req.body;
    db.run(
        "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
        [name, email, password, phone],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ error: "E-mail já cadastrado!" });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Usuário cadastrado com sucesso!", userId: this.lastID });
        }
    );
});

// Rota de Login (Simplificada para este exemplo)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: "Credenciais inválidas!" });
            res.json({ message: "Login realizado!", user: { id: row.id, name: row.name, email: row.email } });
        }
    );
});

// Rota para listar usuários (Admin)
app.get('/api/users', (req, res) => {
    db.all("SELECT id, name, email, phone, created_at FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
