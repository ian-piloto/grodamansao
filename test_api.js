const sqlite3 = require('sqlite3').verbose();
const http = require('http');

// Função para fazer o POST via HTTP nativo do Node
const testOrder = () => {
    const data = JSON.stringify({
        name: "Teste Automatizado",
        email: "auto@teste.com",
        total: 49.00,
        cart: [{ id: 1, name: "TRADITIONAL WATERMELON", price: 49, quantity: 1 }]
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Resposta da API:', body);
            checkDatabase();
        });
    });

    req.on('error', (error) => {
        console.error('Erro no teste:', error);
    });

    req.write(data);
    req.end();
};

// Função para verificar o banco de dados
const checkDatabase = () => {
    const db = new sqlite3.Database('./database.sqlite');
    console.log('\n--- VERIFICANDO BANCO DE DADOS ---');
    
    db.all("SELECT * FROM orders", (err, rows) => {
        if (err) throw err;
        console.log('Pedidos (Orders):', rows);
        
        db.all("SELECT * FROM order_items", (err, items) => {
            if (err) throw err;
            console.log('Itens dos Pedidos (Order Items):', items);
            db.close();
        });
    });
};

testOrder();
