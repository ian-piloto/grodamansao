const http = require('http');

const data = JSON.stringify({
    name: "GORO TESTE",
    price: 99.99,
    description: "Um goro para testar a adicao",
    tag: "TESTE",
    glow_color: "#FFFFFF",
    image_url: "https://via.placeholder.com/150"
});

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    console.log('Status Adicionar:', res.statusCode);
    res.on('data', d => console.log('Response:', d.toString()));
});

req.on('error', e => console.error('Erro:', e));
req.write(data);
req.end();
