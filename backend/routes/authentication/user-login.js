import express from 'express';
import pool from '../../dbcon.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {jwtTokens} from '../../utils/jwt-helpers.js';

const router = express.Router();

router.post('/', async (req, res) => {
    // Find user with email
    try {
      const query = {
        text: 'SELECT * FROM public."users" WHERE email = $1',
        values: [req.body.email]
      }
      const user = await pool.query(query);
      if (user.rows.length === 0) {
        return res.status(404).json({error: 'User not found'});
      }

      // Check password
      const match = await bcrypt.compare(req.body.password, user.rows[0].password);
      if (!match) {
        return res.status(401).json({error: 'Incorrect password'});
      }

      // Generate tokens
      const userLoginAttri = { user_id: user.rows[0].id, user_name: user.rows[0].firstname, user_email: user.rows[0].email};
      const tokens = jwtTokens(userLoginAttri);
      res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
      res.cookie('access_token', tokens.accessToken, {httpOnly: true});
      res.json({tokens});
    } catch (error) {
      res.status(500).json({error: error.message});
    }
});

export default router;