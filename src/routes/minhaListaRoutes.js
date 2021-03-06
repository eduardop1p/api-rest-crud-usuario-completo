import { Router } from 'express';

import minhaListaController from '../controllers/minhaListaController';
import loginRequired from '../middlewares/loginRequired';

const router = Router();

// router.get('/', minhaListaController.index);
router.post('/:id', loginRequired, minhaListaController.store);
// router.put('/:id', loginRequired, minhaListaController.update);
router.delete('/:id', loginRequired, minhaListaController.delete);

export default router;
