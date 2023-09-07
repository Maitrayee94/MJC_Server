const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password in the database
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { email, password, referedBy } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            referedBy,
        });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
