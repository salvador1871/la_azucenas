const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DATA_DIR = __dirname;

// Helper: read JSON file safely
function readJSON(filename) {
    try {
        const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
        return JSON.parse(raw);
    } catch { return null; }
}

// Helper: write JSON file
function writeJSON(filename, data) {
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8');
}

// Helper: parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch { reject(new Error('Invalid JSON')); }
        });
        req.on('error', reject);
    });
}

// Helper: send JSON response
function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const urlPath = url.pathname;

    // ═══ API ROUTES ═══

    // GET /api/data — return site data
    if (req.method === 'GET' && urlPath === '/api/data') {
        const data = readJSON('data.json');
        return sendJSON(res, 200, data || {});
    }

    // POST /api/data — save site data
    if (req.method === 'POST' && urlPath === '/api/data') {
        try {
            const body = await parseBody(req);
            writeJSON('data.json', body);
            return sendJSON(res, 200, { ok: true, message: 'Data saved' });
        } catch (e) {
            return sendJSON(res, 400, { ok: false, error: e.message });
        }
    }

    // GET /api/orders — return orders
    if (req.method === 'GET' && urlPath === '/api/orders') {
        const orders = readJSON('orders.json');
        return sendJSON(res, 200, orders || []);
    }

    // POST /api/orders — save orders
    if (req.method === 'POST' && urlPath === '/api/orders') {
        try {
            const body = await parseBody(req);
            writeJSON('orders.json', body);
            return sendJSON(res, 200, { ok: true, message: 'Orders saved' });
        } catch (e) {
            return sendJSON(res, 400, { ok: false, error: e.message });
        }
    }

    // GET /api/analytics — return analytics
    if (req.method === 'GET' && urlPath === '/api/analytics') {
        const analytics = readJSON('analytics.json');
        return sendJSON(res, 200, analytics || {});
    }

    // POST /api/analytics — save analytics
    if (req.method === 'POST' && urlPath === '/api/analytics') {
        try {
            const body = await parseBody(req);
            writeJSON('analytics.json', body);
            return sendJSON(res, 200, { ok: true, message: 'Analytics saved' });
        } catch (e) {
            return sendJSON(res, 400, { ok: false, error: e.message });
        }
    }

    // POST /api/login — validate admin credentials
    if (req.method === 'POST' && urlPath === '/api/login') {
        try {
            const body = await parseBody(req);
            const admins = readJSON('admin.json');
            const users = (admins && admins.users) || [];
            const match = users.find(u => u.username === body.username && u.password === body.password);
            if (match) {
                return sendJSON(res, 200, { ok: true, user: { username: match.username, name: match.name, role: match.role } });
            } else {
                return sendJSON(res, 401, { ok: false, error: 'Invalid credentials' });
            }
        } catch (e) {
            return sendJSON(res, 400, { ok: false, error: e.message });
        }
    }

    // ═══ STATIC FILES ═══
    let filePath = urlPath === '/' ? '/index.html' : urlPath;
    filePath = path.join(DATA_DIR, filePath);
    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); return res.end('Not Found'); }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🌸 Flores & Arte server running on http://localhost:${PORT}`);
    console.log(`   API endpoints:`);
    console.log(`   GET  /api/data       — Read site data`);
    console.log(`   POST /api/data       — Save site data`);
    console.log(`   GET  /api/orders     — Read orders`);
    console.log(`   POST /api/orders     — Save orders`);
    console.log(`   GET  /api/analytics  — Read analytics`);
    console.log(`   POST /api/analytics  — Save analytics`);
    console.log(`   POST /api/login      — Admin login`);
});
