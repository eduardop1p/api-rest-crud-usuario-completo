"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _minhaListaModel = require('../models/minhaListaModel'); var _minhaListaModel2 = _interopRequireDefault(_minhaListaModel);

/* eslint-disable */

class MinhaListaController {
  async index(req, res) {
    const { userId } = req.params;
    if (!userId) return res.send();

    const minhaListaIndex = new (0, _minhaListaModel2.default)();
    const minhaLista = await minhaListaIndex.showAllList(userId);

    if (minhaListaIndex.errors.length > 0)
      return res.json({ errors: minhaListaIndex.errors });

    res.json(minhaLista);
  }

  async show(req, res) {
    const { userId, id, midiaType } = req.params;
    if (!userId || !id || !midiaType) return res.send();

    const myListShow = new (0, _minhaListaModel2.default)();
    const myList = await myListShow.showOneList(userId, id, midiaType);

    if (myListShow.errors.length > 0)
      return res.json({ errors: myListShow.errors });

    res.json(myList);
  }

  async store(req, res) {
    const { userId } = req.params;
    if (!userId) return res.send();
    const user = userId;

    const minhaListaStore = new (0, _minhaListaModel2.default)({
      id: req.body.id,
      midiaType: req.body.midiaType,
      user,
    });

    await minhaListaStore.storeMyList();

    if (minhaListaStore.errors.length > 0)
      return res.status(400).json({ errors: minhaListaStore.errors });

    return res.json({ minhaLista: 'Item adcionado a lista com sucesso.' });
  }

  async update(req, res) {
    const { id } = req.params;
    if (!id) return res.send();
    const { user } = req.session;

    const minhaListaUpdate = new (0, _minhaListaModel2.default)({
      id: req.body.id,
      midiaType: req.body.midiaType,
      user: user._id,
    });

    await minhaListaUpdate.updateMyList(id);

    if (minhaListaUpdate.errors.length > 0)
      return res.status(400).json({ errors: minhaListaUpdate.errors });

    return res.json({ minhaLista: 'Item atualizado com sucesso.' });
  }

  async delete(req, res) {
    const { userId } = req.params;
    let { ids } = req.query;
    if (!userId || (typeof ids !== 'undefined' && !ids)) return res.send();
    if (ids) ids = ids.split(',');

    const minhaListaDelete = new (0, _minhaListaModel2.default)();

    await minhaListaDelete.deleteMyList(ids, userId);

    if (minhaListaDelete.errors.length > 0)
      return res.status(400).json({ errors: minhaListaDelete.errors });

    return res.json({
      minhaLista: 'Items deletados com sucesso.',
    });
  }
}

exports. default = new MinhaListaController();
