import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try{
    const token = req.headers['authorization'];
    if (token == null) {
        return res.status(401).json({error: 'Access denied. Null token.'});
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({error: 'TokenExpiredError'});
            return;
        }
        return res.status(403).json({error: 'Invalid token.'});
      }
      res.status(200).json({status: 'True'})
    })
  } catch (error){
    res.status(400).json({error: 'Invalid token'});
  }
});

export default router;