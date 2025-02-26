import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export class AuthController {
  static register: RequestHandler = async (req, res, next) => {
    try {
      const { email, password, name, avatar_url } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ message: 'Email, password and name are required' });
        return;
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user with optional avatar_url
      const user = await UserModel.create({
        email,
        password_hash,
        name,
        avatar_url: avatar_url || null
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url
        }
      });
    } catch (error) {
      next(error);
    }
  };

  static login: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url
        }
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserProfile: RequestHandler = async (req, res, next) => {
    try {
      const userId = (req as any).user.id;
      const user = await UserModel.findById(userId);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      const { password_hash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  };
  
}