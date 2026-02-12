const http = require('http');
const fs = require('fs');
const path = require('path');

// 1. Получаем порт от хостинга (или ставим 8080 для теста)
const port = process.env.SERVER_PORT || process.env.PORT || 8080;

// 2. Список типов файлов, чтобы браузер понимал, что есть что
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

http.createServer(function (request, response) {
    // Убираем параметры после ? в адресе, если есть
    let safeUrl = request.url.split('?')[0];
    
    // Формируем путь к файлу
    let filePath = '.' + safeUrl;
    
    // Если попросили корень сайта '/', отдаем index.html
    if (filePath == './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                // Ошибка 404: Файл не найден
                // Можно попробовать отдать 404.html, если он есть
                fs.readFile('./404.html', function(error404, content404) {
                    if (error404) {
                        response.writeHead(404);
                        response.end('Error 404: File Not Found (' + filePath + ')');
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(content404, 'utf-8');
                    }
                });
            } else {
                // Ошибка 500: Серверная ошибка
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            // Успех: отдаем файл
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);

console.log(`Сервер запущен! Порт: ${port}`);
console.log(`Открой сайт по ссылке (смотри IP и Порт в панели)`);