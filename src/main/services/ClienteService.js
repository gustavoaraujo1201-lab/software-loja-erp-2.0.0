/**
 * Serviço de Clientes
 * Gerencia todas operações relacionadas a clientes
 */

const { getDatabase } = require('../main');

class ClienteService {
  /**
   * Lista clientes com filtros
   */
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = 'SELECT * FROM clientes WHERE 1=1';
      const params = [];

      if (filtros.busca) {
        sql += ` AND (nome LIKE ? OR cpf_cnpj LIKE ? OR email LIKE ?)`;
        const termo = `%${filtros.busca}%`;
        params.push(termo, termo, termo);
      }

      if (filtros.ativo !== undefined) {
        sql += ` AND ativo = ?`;
        params.push(filtros.ativo);
      }

      sql += ` ORDER BY nome ASC`;

      const clientes = await db.all(sql, params);
      return clientes;
    } catch (error) {
      console.error('❌ Erro ao listar clientes:', error);
      throw error;
    }
  }

  /**
   * Obtém um cliente por ID
   */
  static async obter(id) {
    try {
      const db = getDatabase();
      const cliente = await db.get('SELECT * FROM clientes WHERE id = ?', [id]);
      
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      return cliente;
    } catch (error) {
      console.error('❌ Erro ao obter cliente:', error);
      throw error;
    }
  }

  /**
   * Cria um novo cliente
   */
  static async criar(dados) {
    try {
      const db = getDatabase();

      const result = await db.run(`
        INSERT INTO clientes (
          tipo_pessoa, cpf_cnpj, nome, razao_social, email, telefone, celular,
          cep, logradouro, numero, complemento, bairro, cidade, uf,
          data_nascimento, observacoes, ativo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        dados.tipo_pessoa || 'F',
        dados.cpf_cnpj || null,
        dados.nome,
        dados.razao_social || null,
        dados.email || null,
        dados.telefone || null,
        dados.celular || null,
        dados.cep || null,
        dados.logradouro || null,
        dados.numero || null,
        dados.complemento || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.uf || null,
        dados.data_nascimento || null,
        dados.observacoes || null,
        dados.ativo !== undefined ? dados.ativo : 1
      ]);

      return await this.obter(result.lastID);
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      throw error;
    }
  }

  /**
   * Atualiza um cliente
   */
  static async atualizar(id, dados) {
    try {
      const db = getDatabase();
      await this.obter(id); // Verificar se existe

      const campos = [];
      const valores = [];

      Object.keys(dados).forEach(key => {
        if (dados[key] !== undefined && key !== 'id') {
          campos.push(`${key} = ?`);
          valores.push(dados[key]);
        }
      });

      campos.push('updated_at = CURRENT_TIMESTAMP');
      valores.push(id);

      await db.run(`
        UPDATE clientes SET ${campos.join(', ')} WHERE id = ?
      `, valores);

      return await this.obter(id);
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  /**
   * Deleta um cliente
   */
  static async deletar(id) {
    try {
      const db = getDatabase();
      await this.obter(id);

      // Verificar se há vendas
      const vendas = await db.get('SELECT COUNT(*) as count FROM vendas WHERE cliente_id = ?', [id]);
      
      if (vendas.count > 0) {
        // Se há vendas, apenas desativar
        await db.run('UPDATE clientes SET ativo = 0 WHERE id = ?', [id]);
      } else {
        // Se não há vendas, pode deletar
        await db.run('DELETE FROM clientes WHERE id = ?', [id]);
      }

      return { sucesso: true };
    } catch (error) {
      console.error('❌ Erro ao deletar cliente:', error);
      throw error;
    }
  }
}

module.exports = ClienteService;
