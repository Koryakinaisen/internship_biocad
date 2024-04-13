const http = require('http');
const fs = require('fs');
const path = require('path');

const devices = require('./json/devices.json')
const {getDeviceHTML, getDeviceAnalyticsHTML, getDeviceWorksHTML, getDate} = require("./js/html_functions");

const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.svg': 'image/svg+xml'
};

function readFile(res, filePath, extname) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Если файл не найден, отправляем ошибку 404
                readFile(res, './public/error.html', String(path.extname('./public/error.html')).toLowerCase())
            } else {
                // В случае другой ошибки сервера, отправляем ошибку 500
                res.writeHead(500)
                res.end(`Ошибка сервера: ${err.code}`)
            }
        } else {
            // Определяем Content-Type на основе расширения файла
            res.writeHead(200, {'Content-Type': contentType[extname] || 'application/octet-stream'})
            res.end(content)
        }
    });
}

const main = http.createServer((req, res) => {
    let filePath = ''
    let regexPattern = /\/get-works\?time-interval=\d+/ // Регулярное выражения для проверки url

    if (req.url === '/') {
        filePath = './public/main.html'
    } else if (req.url === '/analytics') {
        filePath = './public/analytics.html'
    } else if (req.url === '/favorite-devices') {
        let html = ''
        devices.forEach(function (device) {
            html += getDeviceHTML(device)
        })
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
        return
    } else if (req.url === '/change-notification') {
        let body = ''

        req.on('data', chunk => {
            body += chunk.toString() // Получаем тело запроса
        });

        req.on('end', () => {
            const receivedParams = JSON.parse(body);
            let device
            for (let i = 0; i < devices.length; i++) {
                if (devices[i].id === receivedParams.device_id) {
                    device = devices[i]
                    break
                }
            }
            device.notification = !device.notification
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end('Параметры получены!')
        });
        return
    } else if (req.url === '/change-status') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Получаем тело запроса
        });

        req.on('end', () => {
            const receivedParams = JSON.parse(body);
            devices[receivedParams.device_id].status = receivedParams.status
            res.writeHead(200, {'Content-Type': 'text/plain'})
            res.end('Параметры получены!')
        });
        return
    } else if (req.url === '/device-analytics') {
        const device = devices[0]
        const html = getDeviceAnalyticsHTML(device)
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
        return
    } else if (regexPattern.test(req.url)) {
        const daysInterval = req.url.match(/time-interval=(\d+)/)[1]
        const device = devices[0]
        const html = getDeviceWorksHTML(device, daysInterval)
        const pastDate = new Date()
        pastDate.setDate(pastDate.getDate() - daysInterval)
        const dateText = getDate(pastDate)
        res.writeHead(200, {'Content-Type': 'text/html'})
        const json = JSON.stringify({
            'html': html,
            'date_text': dateText
        })
        res.end(json)
        return
    } else {
        filePath = './public' + req.url
    }

    const extname = String(path.extname(filePath)).toLowerCase()
    readFile(res, filePath, extname)
});

const PORT = 3000;
main.listen(PORT, () => {
    console.log(`Сервер запущен по url http://localhost:${PORT}/`);
});