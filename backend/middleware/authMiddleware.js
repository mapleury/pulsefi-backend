const jwt = require('jsonwebtoken');
const SECRET = "PULSEFI_SECRET_KEY_2026"; 

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) return res.status(403).json({ error: "Silahkan login terlebih dahulu" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Sesi habis, silahkan login ulang" });
        req.userId = decoded.id; 
        next();
    });
};