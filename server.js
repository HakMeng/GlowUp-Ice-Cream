const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const publicDir = path.join(__dirname, 'public');
const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filePath = req.url === '/' ? '/index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);

        fs.readFile(fullPath, (err, content) => {
            if (err) {
                res.writehead(404);
                return res.end('File not found');
            }

            const ext = path.extname(fullPath);
            const contentType = ext === '.css' ? 'text/css' :
                                ext === '.js' ? 'text/javascript' :
                                ext === '.html' ? 'text/html' : 'text/plain';
            
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content);
        });

    } else if(req.method === 'POST' && req.url === '/contact') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const parsed = parse(body);
            const log = `Nama: ${parsed.name}, Email: ${parsed.email}, Pesan: ${parsed.message}\n`;
            fs.appendFileSync('./submissions/data.txt', log);
            res.writeHead(200, { 'Content-Type': 'text/plain'});
            res.end('Terima Kasih! Pesan  Anda telah Diterima.');
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');   
    }
});
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));