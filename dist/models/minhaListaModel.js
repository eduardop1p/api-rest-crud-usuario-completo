"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

/* eslint-disable */
var _userModel = require('./userModel');

const minhaListaSchema = new _mongoose2.default.Schema({
  id: { type: String, require: true },
  midiaType: { type: String, default: '' },
  user: { type: _mongoose2.default.Types.ObjectId },
  criadoEm: {
    type: Date,
    default: Date.now(),
  },
});

const minhaListaModel = _mongoose2.default.model('Minha lista', minhaListaSchema);

exports. default = class {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.minhaLista = null;
  }

  async showAllList() {
    try {
      this.minhaLista = await minhaListaModel
        .find()
        .sort({ criadoEm: -1 })
        .select(['id', 'midiaType', 'user']);

      return this.minhaLista;
    } catch (e) {
      this.errors.push('Erro ao pegar todos os itens de minha lista.');
    }
  }

  async storeMyList() {
    try {
      const { user } = this.body;

      const existUser = await _userModel.userModel.findById(user);
      if (!existUser) return this.errors.push('Id não existe.');

      this.minhaLista = await minhaListaModel.create(this.body);

      const allMyListUser = await minhaListaModel.find({ user });
      await _userModel.userModel.findByIdAndUpdate(user, { minhaLista: allMyListUser });

      return this.minhaLista;
    } catch (e2) {
      this.errors.push('Erro ao adcionar item a minha lista.');
    }
  }

  async updateMyList(id) {
    if (typeof id !== 'string' || !id) return;

    try {
      this.minhaLista = await minhaListaModel.findByIdAndUpdate(id, this.body, {
        new: true,
      });

      if (!this.minhaLista) return this.errors.push('Id não existe.');

      return this.minhaLista;
    } catch (e3) {
      this.errors.push('Erro ao atualizar item da minha lista.');
    }
  }

  async deleteOneMyList(id) {
    if (typeof id !== 'string' || !id) return;

    try {
      this.minhaLista = await minhaListaModel.findByIdAndDelete(id);

      if (!this.minhaLista) return this.errors.push('Id não existe.');

      return this.minhaLista;
    } catch (e4) {
      this.errors.push('Erro ao deletar item da minha lista.');
    }
  }
}
