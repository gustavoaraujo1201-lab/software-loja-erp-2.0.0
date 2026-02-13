/**
 * Serviço de Fornecedores
 */

const { getDatabase } = require('../main');

class FornecedorService {
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = 'SELECT * FROM fornecedores WHERE 1=1';
      const params = [];

      if (filtros.busca) {
        sql += ` AND (razao_social LIKE ? OR nome_fantasia LIKE ? OR cnpj LIKE ?)`;
        const termo = `%${filtros.busca}%`;
        params.push(termo, termo, termo);
      }

      if (filtros.ativo !== undefined) {
        sql += ` AND ativo = ?`;
        params.push(filtros.ativo);
      }

      sql += ` ORDER BY razao_social ASC`;

      return await db.all(sql, params);
    } catch (error) {
      console.error('❌ Erro ao listar fornecedores:', error);
      throw error;
    }
  }

  static async obter(id) {
    try {
      const db = getDatabase();
      const fornecedor = await db.get('SELECT * FROM fornecedores WHERE id = ?', [id]);
      
      if (!fornecedor) {
        throw new Error('Fornecedor não encontrado');
      }

      return fornecedor;
    } catch (error) {
      console.error('❌ Erro ao obter fornecedor:', error);
      throw error;
    }
  }

  static async criar(dados) {
    try {
      const db = getDatabase();

      const result = await db.run(`
        INSERT INTO fornecedores (
          cnpj, razao_social, nome_fantasia, email, telefone,
          cep, logradouro, numero, complemento, bairro, cidade, uf, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        dados.cnpj || null,
        dados.razao_social,
        dados.nome_fantasia || null,
        dados.email || null,
        dados.telefone || null,
        dados.cep || null,
        dados.logradouro || null,
        dados.numero || null,
        dados.complemento || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.uf || null,
        dados.observacoes || null
      ]);

      return await this.obter(result.lastID);
    } catch (error) {
      console.error('❌ Erro ao criar fornecedor:', error);
      throw error;
    }
  }

  static async atualizar(id, dados) {
    try {
      const db = getDatabase();
      await this.obter(id);

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

      await db.run(`UPDATE fornecedores SET ${campos.join(', ')} WHERE id = ?`, valores);

      return await this.obter(id);
    } catch (error) {
      console.error('❌ Erro ao atualizar fornecedor:', error);
      throw error;
    }
  }

  static async deletar(id) {
    try {
      const db = getDatabase();
      await this.obter(id);

      const compras = await db.get('SELECT COUNT(*) as count FROM compras WHERE fornecedor_id = ?', [id]);
      
      if (compras.count > 0) {
        await db.run('UPDATE fornecedores SET ativo = 0 WHERE id = ?', [id]);
      } else {
        await db.run('DELETE FROM fornecedores WHERE id = ?', [id]);
      }

      return { sucesso: true };
    } catch (error) {
      console.error('❌ Erro ao deletar fornecedor:', error);
      throw error;
    }
  }
}

module.exports = FornecedorService;
