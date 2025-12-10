import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async(req, res) => {
    try {
        const {name, email, password, avatar} = req.body;

        if(!name || !email || !password) return res.status(400).json({error: 'Name, email & password required'});

        const userExists = await User.findOne({email});

        if(userExists) return res.status(400).json({error: 'Email already registered'});

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashed,
            avatar: avatar || null,
        });

        return res.status(201).json({message: 'User registered successfully', user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }, token: generateToken(user._id)});

    } catch (err) {
        console.error('Register error: ', err);
        res.status(500).json({error: 'Server error during registration'});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({error: 'email & password required'});

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({error: 'Invalid credentials'});

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) return res.status(400).json({error: 'Invalid credentials'});

        return res.status(200).json({message: 'Login successful', user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }, token: generateToken(user._id)});

    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({error: 'Server error during login'});
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if(!user) return res.status(404).json({error: 'User not found'});

        return res.status(200).json({user});
    } catch (err) {
        console.error('GetMe error: ', err);
        res.status(500).json({error: 'Server error'});
    }
}