import { Router } from 'express';
import { createUser } from '../controllers/users/createUser';
import { retrieveUser } from '../controllers/users/retrieveUser';
import { createUserEmail } from '../controllers/users/createUserEmail';

const r = Router();

r.get('/:userId', retrieveUser);
r.post('/', createUser);
r.post('/:userId/emails', createUserEmail);

export default r;
