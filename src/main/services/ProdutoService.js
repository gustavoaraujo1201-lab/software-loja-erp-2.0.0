/**
 * Serviço de Produtos
 * Gerencia todas operações relacionadas a produtos
 */

const { getDatabase } = require('../main');

class ProdutoService {
  /**
   * Lista produtos com filtros opcionais
   */
  static async listar(filtros = {}) {
    try {
      const db = getDatabase();
      let sql = `
        SELECT p.*, c.nome as categoria_nome,
               e.quantidade as estoque_quantidade,
               e.disponivel as estoque_disponivel
        FROM produtos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN estoque e ON p.id = e.produto_id
        WHERE 1=1
      `;
      const params = [];

      if (filtros.busca) {
        sql += ` AND (p.nome LIKE ? OR p.codigo_barras LIKE ?)`;
        params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
      }

      if (filtros.categoria_id) {
        sql += ` AND p.categoria_id = ?`;
        params.push(filtros.categoria_id);
      }

      if (filtros.ativo !== undefined) {
        sql += ` AND p.ativo = ?`;
        params.push(filtros.ativo);
      }

      sql += ` ORDER BY p.nome ASC`;

      if (filtros.limite) {
        sql += ` LIMIT ?`;
        params.push(filtros.limite);
      }

      const produtos = await db.all(sql, params);
      return produtos;
    } catch (error) {
      console.error('❌ Erro ao listar produtos:', error);
      throw error;
    }
  }

  /**
   * Obtém um produto por ID
   */
  static async obter(id) {
    try {
      const db = getDatabase();
      const produto = await db.get(`
        SELECT p.*, c.nome as categoria_nome,
               e.quantidade as estoque_quantidade,
               e.disponivel as estoque_disponivel
        FROM produtos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN estoque e ON p.id = e.produto_id
        WHERE p.id = ?
      `, [id]);

      if (!produto) {
        throw new Error('Produto não encontrado');
      }

      return produto;
    } catch (error) {
      console.error('❌ Erro ao obter produto:', error);
      throw error;
    }
  }

  /**
   * Busca produto por código de barras
   */
  static async buscarPorCodigoBarras(codigo) {
    try {
      const db = getDatabase();
      const produto = await db.get(`
        SELECT p.*, c.nome as categoria_nome,
               e.quantidade as estoque_quantidade,
               e.disponivel as estoque_disponivel
        FROM produtos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN estoque e ON p.id = e.produto_id
        WHERE p.codigo_barras = ? AND p.ativo = 1
      `, [codigo]);

      return produto;
    } catch (error) {
      console.error('❌ Erro ao buscar produto por código de barras:', error);
      throw error;
    }
  }

  /**
   * Cria um novo produto
   */
  static async criar(dados) {
    try {
      const db = getDatabase();

      // Calcular margem de lucro se não informada
      if (!dados.margem_lucro && dados.preco_custo && dados.preco_venda) {
        dados.margem_lucro = ((dados.preco_venda - dados.preco_custo) / dados.preco_custo * 100).toFixed(2);
      }

      const result = await db.run(`
        INSERT INTO produtos (
          codigo_barras, nome, descricao, categoria_id,
          preco_custo, preco_venda, margem_lucro, unidade,
          estoque_minimo, estoque_maximo, ncm, cest, cfop,
          cst_icms, cst_pis, cst_cofins, imagem, ativo, ecommerce_ativo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        dados.codigo_barras || null,
        dados.nome,
        dados.descricao || null,
        dados.categoria_id || null,
        dados.preco_custo || 0,
        dados.preco_venda || 0,
        dados.margem_lucro || 0,
        dados.unidade || 'UN',
        dados.estoque_minimo || 0,
        dados.estoque_maximo || 0,
        dados.ncm || null,
        dados.cest || null,
        dados.cfop || null,
        dados.cst_icms || null,
        dados.cst_pis || null,
        dados.cst_cofins || null,
        dados.imagem || null,
        dados.ativo !== undefined ? dados.ativo : 1,
        dados.ecommerce_ativo || 0
      ]);

      // Criar registro de estoque inicial
      await db.run(`
        INSERT INTO estoque (produto_id, quantidade, reservado, disponivel)
        VALUES (?, 0, 0, 0)
      `, [result.lastID]);

      // Registrar log
      await this.registrarLog('CREATE', result.lastID, dados);

      return await this.obter(result.lastID);
    } catch (error) {
      console.error('❌ Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza um produto
   */
  static async atualizar(id, dados) {
    try {
      const db = getDatabase();

      // Verificar se produto existe
      const produtoExistente = await this.obter(id);

      // Calcular margem de lucro se preços foram alterados
      if (dados.preco_custo || dados.preco_venda) {
        const precoCusto = dados.preco_custo || produtoExistente.preco_custo;
        const precoVenda = dados.preco_venda || produtoExistente.preco_venda;
        dados.margem_lucro = ((precoVenda - precoCusto) / precoCusto * 100).toFixed(2);
      }

      const campos = [];
      const valores = [];

      Object.keys(dados).forEach(key => {
        if (dados[key] !== undefined && key !== 'id') {
          campos.push(`${key} = ?`);
          valores.push(dados[key]);
        }
      });

      if (campos.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }

      campos.push('updated_at = CURRENT_TIMESTAMP');
      valores.push(id);

      await db.run(`
        UPDATE produtos
        SET ${campos.join(', ')}
        WHERE id = ?
      `, valores);

      // Registrar log
      await this.registrarLog('UPDATE', id, dados);

      return await this.obter(id);
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      throw error;
    }
  }

  /**
   * Deleta um produto (soft delete)
   */
  static async deletar(id) {
    try {
      const db = getDatabase();

      // Verificar se produto existe
      await this.obter(id);

      // Verificar se há movimentações
      const movimentacoes = await db.get(`
        SELECT COUNT(*) as count FROM vendas_itens WHERE produto_id = ?
        UNION ALL
        SELECT COUNT(*) as count FROM compras_itens WHERE produto_id = ?
      `, [id, id]);

      if (movimentacoes && movimentacoes.count > 0) {
        // Se há movimentações, apenas desativar
        await db.run('UPDATE produtos SET ativo = 0 WHERE id = ?', [id]);
      } else {
        // Se não há movimentações, pode deletar
        await db.run('DELETE FROM estoque WHERE produto_id = ?', [id]);
        await db.run('DELETE FROM produtos WHERE id = ?', [id]);
      }

      // Registrar log
      await this.registrarLog('DELETE', id, {});

      return { sucesso: true };
    } catch (error) {
      console.error('❌ Erro ao deletar produto:', error);
      throw error;
    }
  }

  /**
   * Registra log de operação
   */
  static async registrarLog(acao, produtoId, dados) {
    try {
      const db = getDatabase();
      await db.run(`
        INSERT INTO logs_sistema (nivel, categoria, mensagem, detalhes)
        VALUES ('INFO', 'PRODUTO', ?, ?)
      `, [
        `${acao} produto ID ${produtoId}`,
        JSON.stringify(dados)
      ]);
    } catch (error) {
      console.error('⚠️ Erro ao registrar log:', error);
    }
  }
}

module.exports = ProdutoService;
