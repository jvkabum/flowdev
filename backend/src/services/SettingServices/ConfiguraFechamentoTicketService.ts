import db from "../../database"; // Importe sua conexão com o banco de dados

// Definir interface para o resultado
interface ConfigResult {
  value: string;
}

export const getDaysToClose = async (): Promise<number> => {
  try {
    const result = await db.query<ConfigResult[]>(
      'SELECT value FROM settings WHERE key = $1',
      {
        bind: ['DAYS_TO_CLOSE_TICKET'], // Use bind para Sequelize no raw query
        type: db.QueryTypes.SELECT // Define o tipo para retornar um array de resultados
      }
    );

    // Verificar o retorno correto do resultado
    if (result && result.length > 0) {
      return parseInt(result[0].value) || 0;
    } else {
      // Caso o resultado não seja encontrado, retorne 0 por padrão
      return 0;
    }
  } catch (error) {
    // Tratar erro de consulta
    console.error('Erro ao recuperar a configuração DAYS_TO_CLOSE_TICKET:', error);
    return 0; // Caso haja erro, retorne 0 como fallback
  }
};

export const setDaysToClose = async (days: number): Promise<void> => {
  try {
    await db.query(
      'UPDATE settings SET value = $1 WHERE key = $2',
      {
        bind: [days.toString(), 'DAYS_TO_CLOSE_TICKET'], // Convertendo days para string
        type: db.QueryTypes.UPDATE // Define o tipo para uma operação de atualização
      }
    );
  } catch (error) {
    // Tratar erro de atualização
    console.error('Erro ao atualizar DAYS_TO_CLOSE_TICKET:', error);
  }
};

