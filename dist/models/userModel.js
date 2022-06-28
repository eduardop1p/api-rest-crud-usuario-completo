"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _validator = require('validator/validator');
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);
var _promises = require('fs/promises'); var _promises2 = _interopRequireDefault(_promises);
var _path = require('path');

/* eslint-disable */
var _fotoModel = require('./fotoModel');

const userSchema = new _mongoose2.default.Schema({
  nome: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  RepetPassword: { type: String, required: true },
  foto: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Foto' }],
  criadoEm: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = _mongoose2.default.model('User', userSchema);

exports. default = class {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async showAllUsers() {
    try {
      this.user = await userModel
        .find()
        .sort({ criadoEm: -1 })
        .select(['email', 'nome', 'foto']) // com o .select([]) vou passar um array com as chaves que quero pegar da minha colection
        .populate('foto', ['originalname', 'filename', 'url', 'user']);

      return this.user;
    } catch (e) {
      this.errors.push('Erro ao obter todos os usuários.');
    }
  }

  async deleteOneUser(id) {
    if (typeof id !== 'string' || !id) return;

    try {
      const allPhotosUser = await _fotoModel.fotoModel.find({ user: id });
      allPhotosUser.map(async (userPhoto) => {
        return await _promises2.default.rm(
          _path.resolve.call(void 0, 
            __dirname,
            '..',
            '..',
            'uploads',
            'images',
            userPhoto.filename
          ),
          { force: true }
        );
      });

      await _fotoModel.fotoModel.deleteMany({ user: id });
      this.user = await userModel.findByIdAndDelete(id);

      if (!this.user) return this.errors.push('Id não existe.');

      return this.user;
    } catch (e2) {
      this.errors.push('Erro ao deletar usuário.');
    }
  }

  async showOneUser(id) {
    if (typeof id !== 'string' || !id) return;

    try {
      this.user = await userModel
        .findById(id)
        .sort({ criadoEm: -1 })
        .select(['email', 'nome', 'foto'])
        .populate('foto', ['originalname', 'filename', 'url', 'user']);

      if (!this.user) return this.errors.push('Id não existe.');

      return this.user;
    } catch (e3) {
      this.errors.push('Erro ao obter usuário.');
    }
  }

  async updateOneUser(id) {
    if (typeof id !== 'string' || !id) return;

    this.valida();
    if (this.errors.length > 0) return;

    const saltPassoword = _bcryptjs2.default.genSaltSync();
    this.body.password = _bcryptjs2.default.hashSync(this.body.password, saltPassoword);
    this.body.RepetPassword = this.body.password;

    try {
      this.user = await userModel
        .findByIdAndUpdate(id, this.body, { new: true })
        .select(['nome', 'email', 'foto'])
        .populate('foto', ['originalname', 'filename', 'url', 'user']);

      if (!this.user) return this.errors.push('Id não existe.');

      return this.user;
    } catch (e4) {
      this.errors.push('Erro ao atualizar usuário.');
    }
  }

  async storeUser() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExist();
    if (this.errors.length > 0) return;

    const saltPassoword = _bcryptjs2.default.genSaltSync();
    this.body.password = _bcryptjs2.default.hashSync(this.body.password, saltPassoword);
    this.body.RepetPassword = this.body.password;

    this.user = await userModel.create(this.body);
    return this.user;
  }

  async userExist() {
    try {
      this.user = await userModel.findOne({ email: this.body.email });

      if (this.user)
        return this.errors.push('Já existe um usuário com este email.');
    } catch (e5) {
      this.errors.push('Erro ao procurar usuário.');
    }
  }

  valida() {
    this.clearUp();

    if (this.body.nome.length < 3 || this.body.nome.length > 9) {
      this.errors.push('Nome deve ter entre 3 e 9 caracteres.');
    }

    if (!_validator.isEmail.call(void 0, this.body.email)) this.errors.push('E-mail inválido.');

    if (this.body.password.length < 3 || this.body.password.length > 8) {
      this.errors.push('Senha deve ter entre 3 e 8 caracteres.');
    }

    if (this.body.password !== this.body.RepetPassword) {
      this.errors.push('As senhas não coincidem.');
    }
  }

  clearUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      password: this.body.password,
      RepetPassword: this.body.RepetPassword,
    };
  }
}

exports.userModel = userModel;
