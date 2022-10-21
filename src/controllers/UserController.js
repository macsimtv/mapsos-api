const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

class UserController {
    static async register(req, res) {
        const { username, email, password } = req.body;

        const userEmailExist = await User.findOne({ email });
        if (userEmailExist) return res.status(400).json({ success: false, message: 'Email already exist' });

        const usernameExist = await User.findOne({ username });
        if (usernameExist) return res.status(400).json({ success: false, message: 'Username already taken' });
        
        if (username.length < 3 || username.length > 20) return res.status(400).json({ success: false, message: 'Username must be between 3 and 20 characters' });
        if (password.length < 6 || password.length > 20) return res.status(400).json({ success: false, message: 'Password must be between 6 and 20 characters' });

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Invalid email' });

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            encryptedPassword,
        });

        try {
            await user.save();

            res.status(201).json({ success: true, message: 'User created' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    static async login(req, res) {
        // Login
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // Verify password
        const validPassword = await bcrypt.compare(password, user.encryptedPassword);

        if (!validPassword) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        res.status(200).json({ success: true, message: 'Logged in', token });
    }

    static async me(req, res) {
        try {
            const { user } = req;

            const userData = await User.findById(user._id);

            res.status(200).json({ success: true, message: 'User found', userData });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

module.exports = UserController;