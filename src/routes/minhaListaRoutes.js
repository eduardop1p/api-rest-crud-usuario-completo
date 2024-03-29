import { Router } from 'express';

import minhaListaController from '../controllers/minhaListaController';
import loginRequired from '../middlewares/loginRequired';

const router = Router();

router.get('/:userId', loginRequired, minhaListaController.index);
router.get('/:userId/:id/:midiaType', loginRequired, minhaListaController.show);
router.post('/:userId', loginRequired, minhaListaController.store);
// router.put('/:id', loginRequired, minhaListaController.update);
router.delete('/:userId', loginRequired, minhaListaController.delete);

export default router;
