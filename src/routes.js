// Controllers
const UserController = require('./controllers/UserController');
const MarkerController = require('./controllers/MarkerController');

// Middleware
const AuthMiddleware = require('./middlewares/AuthMiddleware');

module.exports = function(app) {
    // User routes
    app.post('/auth/register', UserController.register);
    app.post('/auth/login', UserController.login);
    app.post('/auth/me', AuthMiddleware.isAuth, UserController.me);

    // Marker routes
    app.get('/markers', AuthMiddleware.isAuth, MarkerController.index);
    app.get('/markers/:id', AuthMiddleware.isAuth, MarkerController.show);
    app.post('/markers', AuthMiddleware.isAuth, MarkerController.store);
    app.put('/markers/:id', AuthMiddleware.isAuth, MarkerController.update);
    app.delete('/markers/:id', AuthMiddleware.isAuth, MarkerController.destroy);

    // Default route
    app.get('*', (req, res) => {
        res.status(404).json({ success: false, message: 'Not Found' });
    });
};