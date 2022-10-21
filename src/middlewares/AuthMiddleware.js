const jwt = require('jsonwebtoken');

class AuthMiddleware {
    static async isAuth(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];

            try {
                const token = await jwt.verify(bearerToken, process.env.TOKEN_SECRET);

                req.user = token;

                next();
            } catch (error) {
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
        } else {
            res.status(403).json({ success: false, message: 'Forbidden' });
        }
    }
}

module.exports = AuthMiddleware;