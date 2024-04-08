import express from 'express';
import pool from '../../dbcon.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
      // console.log(req.body)
      const password = req.body.password;
      // console.log(password)
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = {
        text: 'INSERT INTO public."users" (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)',
        values: [req.body.fname, req.body.lname, req.body.email, hashedPassword]
      }
      const newUser = await pool.query(query);

      const query1 = {
        text: 'SELECT id from public."users" WHERE email = $1',
        values: [req.body.email]
      }
      const newUserDetails = await pool.query(query1);

      res.json({status : "True" , id : newUserDetails.rows[0].id});
    } catch (error) {
      res.status(500).json({error: error.message, msg: "loginAPI"});
    }
});

export default router;