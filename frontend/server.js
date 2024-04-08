const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './public/main.html';
    } else {
        filePath = './public' + req.url;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Если файл не найден, отправляем ошибку 404
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('Страница не найдена');
            } else {
                // В случае другой ошибки сервера, отправляем ошибку 500
                res.writeHead(500);
                res.end(`Ошибка сервера: ${err.code}`);
            }
        } else {
            // Определяем Content-Type на основе расширения файла
            res.writeHead(200, { 'Content-Type': contentType[extname] || 'application/octet-stream' });
            res.end(content);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен по url http://localhost:${PORT}/`);
});