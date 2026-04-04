var path = require('path');
var express = require('express');
var helmet = require('helmet');
var compression = require('compression');

// Load .env if present
var envPath = path.join(__dirname, '..', '.env');
try {
  var envContent = require('fs').readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(function (line) {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    var idx = line.indexOf('=');
    if (idx === -1) return;
    var key = line.slice(0, idx).trim();
    var val = line.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
} catch (e) { /* no .env file, use defaults */ }

var app = express();
var PORT = process.env.PORT || 3000;

// Gzip compression
app.use(compression());

// Security headers (permissive CSP for Google Maps iframe)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      frameSrc: ["https://www.google.com"],
      connectSrc: ["'self'"]
    }
  }
}));

// Parse JSON body
app.use(express.json());

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..'), {
  extensions: ['html'],
  maxAge: '7d',
  immutable: true,
  setHeaders: function (res, filePath) {
    // HTML pages: no cache (always fresh)
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));

// Start server
app.listen(PORT, function () {
  console.log('');
  console.log('  Pepite Rouge server running');
  console.log('  http://localhost:' + PORT);
  console.log('');
});
