const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // Tabela de Produtos
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image_url TEXT,
        tag TEXT,
        glow_color TEXT
    )`);

    // Tabela de Pedidos
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        customer_email TEXT,
        total_price REAL,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de Itens do Pedido
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price REAL,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

    // Tabela de Usuários/Clientes
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Popular produtos se estiver vazio
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO products (name, price, description, tag, glow_color, image_url) VALUES (?, ?, ?, ?, ?, ?)");
            
            stmt.run(
                "TRADITIONAL WATERMELON", 
                49.00, 
                "Redução de danos com o frescor absoluto da melancia. Ideal para o sunrise after party.", 
                "BEST SELLER", 
                "#ff2e7e",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ejDNPIiit_dtSNJjjb-zBFV-06Qqi-4wGFs_QxGv2IxotUEmFiHji22mQqf4nbVGpOjEYo6t79uScsoxMU4ZcubZJI0o6snV5otQ0a6YQAXOwBQUZcdOpMvtIZ3rAiXYxj7uhKpJLKcvTlBTn7k-OjTyVdqMaiYb3CpLbF04lv2Wr4Lz-uXLLrvTgtey64FP9MqRrCOKiuesSaIjoMWdFxi0Lm7m_08ZIjA09kIeol1h7N4jthaxMAHCX8RI2rCC-zNZbp_GEg"
            );
            
            stmt.run(
                "TROPICAL FRUITS", 
                55.00, 
                "Blend exótico de mangas e maracujá. Investindo no projeto de uma noite imparável.", 
                "LIMITED", 
                "#ff8c00",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBCRR7BUHKP_Z71y9q9MFMUIeZWyZTZf-uO81TwNtm-X0r0E79Zg3wxsWdV8SXVVyhkQmx-VXpk98FG00OtNXajLOlKbZhcXwpKNru7PQfv_QzrONvFXPUbIUaVzWo9WJfoqnecEol2eHXiY2d3KcHFhq-YXiv9uVjLfRYH6dpzkC-d9SzxjihhU9UZSqnxaoJk226K1ShP8YrzZdqxbpV-GUCI2MbgbARVDg9BvN2Nv26zM3BwZWPyGyUl9uCLhMkSLzYLeHEOaQ"
            );
            
            stmt.run(
                "GREEN APPLE ICE", 
                52.00, 
                "A maçã verde elevada ao extremo gelo. Foco total para quem não dorme cedo.", 
                "ICE COLD", 
                "#32ff7e",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCW6HqcLlk4ROP2WWXSZMfYrQmfhUfTgzjNhxcvOPdlHusW7R9g1Q5NT4icYraRKAOHkreFTZFe-g1iJCgoKgIW6tlRJZ4YJOOnafdCLIcO7AVcM96sE1pNpWCdyCVAQUT1l6zX4XhgFa5szVMsclc2On83-KXsOZbjWsi8M01eq8IDrImyCdzh6uag51EZ1C-8YDp05EXrdWOnV3NpjrtVuDOX5hL2rhSTetFsWyuZmzJEM9uHh51pktc7-uWc9wLfd6h1zCEaJw"
            );
            
            stmt.run(
                "GRAPE & BERRY", 
                58.00, 
                "Antocianinas naturais para uma performance cerebral prolongada. O sabor da elite.", 
                "SIGNATURE", 
                "#8a2be2",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCQmm1qDmQ-3f9pU-bmYYR98VB8_dIGQkh6QTo9EtIpi0dLq01G9spmfeK2wadRN82U1z6doowcH48YUcbz-bBa0qdVbSSkB3Su6TmCtBVijWu0f0fBOE9cWSLnXjM13t0XKab5GJIK62d0XGbbrxV1j99cz3910P8UpDIKBa5LpbWieiexUgaVcQ-JkGFj8KBlcFe0i6aLsGUfYL2u2a3_zgtx2J2aPY2-ZzbyPiPqvRy-bBuc6PE1ubU6ULAsub_3xgrZs7BYtA"
            );

            stmt.finalize();
            console.log("Banco de dados inicializado com sucesso.");
        }
    });
});

module.exports = db;
