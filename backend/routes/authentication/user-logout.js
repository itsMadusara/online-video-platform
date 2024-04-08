import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        return res.status(200).json({message:'Refresh token deleted.'});
    } catch (error) {
        res.status(401).json({error: error.message});
    }
});

export default router;