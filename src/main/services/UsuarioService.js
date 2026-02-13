/**
 * Serviço de Usuários e Autenticação
 */
const { getDatabase } = require('../main');
const bcrypt = require('bcryptjs');

class UsuarioService {
  static async autenticar(email, senha) {
    const db = getDatabase();
    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ? AND ativo = 1', [email]);
    
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    delete usuario.senha;
    return usuario;
  }

  static async listar() {
    const db = getDatabase();
    return await db.all('SELECT id, nome, email, tipo, ativo FROM usuarios');
  }

  static async criar(dados) {
    const db = getDatabase();
    const senhaHash = bcrypt.hashSync(dados.senha, 10);
    
    const result = await db.run(`
      INSERT INTO usuarios (nome, email, senha, tipo, ativo)
      VALUES (?, ?, ?, ?, ?)
    `, [dados.nome, dados.email, senhaHash, dados.tipo || 'operador', 1]);

    return { id: result.lastID, nome: dados.nome, email: dados.email, tipo: dados.tipo };
  }
}

module.exports = UsuarioService;
