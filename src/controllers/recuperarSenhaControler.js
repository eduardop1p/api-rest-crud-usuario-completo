import RecuperarSenhaModel from '../models/recuperarSenhaModel';
import nodemailerConfig from '../config/nodemailerConfig';

class RecuperarSenhaControler {
  async userExistEmail(req, res) {
    const recuperarSenha = new RecuperarSenhaModel(req.body);

    const user = await recuperarSenha.userExistModelEmail();

    if (recuperarSenha.errors.length > 0)
      return res.status(400).json({ errors: recuperarSenha.errors });

    const { _id, email } = user;

    await nodemailerConfig.sendEmailRecoveryPassword(_id, email);
    return res.json({
      recuperarSenha: [`Enviamos um email para ${email}`],
    });
  }

  async userExistId(req, res) {
    const { id } = req.params;
    if (!id) return res.send();

    const recuperarSenha = new RecuperarSenhaModel();

    await recuperarSenha.showUserExistModelId(id);

    if (recuperarSenha.errors.length > 0)
      return res.status(400).json({ errors: recuperarSenha.errors });

    return res.json({
      userExist: ['Usuário existe na base de dados'],
    });
  }

  async updatePasswordUser(req, res) {
    const { id } = req.params;
    if (!id) return res.send();

    const recuperarSenha = new RecuperarSenhaModel(req.body);

    await recuperarSenha.updateUserPasswordModel(id);

    if (recuperarSenha.errors.length > 0)
      return res.status(400).json({ errors: recuperarSenha.errors });

    return res.json({
      recuperarSenha: ['Nova senha criada com sucesso.'],
    });
  }
}

export default new RecuperarSenhaControler();
