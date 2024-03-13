import express from 'express';

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello' });
  });

  return router;
}

export const routes = getRouter();