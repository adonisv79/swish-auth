import { Router } from 'express';
import { testSuccess, testError } from '../controllers/testController';

const r = Router();

r.post('/success', testSuccess);
r.post('/err', testError);

export default r;
