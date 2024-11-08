import cron from 'node-cron';
import db from '../database'; // Ajuste o caminho conforme necessário
import { getDaysToClose } from '../services/SettingServices/ConfiguraFechamentoTicketService';

// Função para fechar tickets pendentes
const closePendingTickets = async () => {
    try {
        // Obtém o número de dias para fechar os tickets
        const daysToClose = await getDaysToClose();
        
        // Cria a data limite para o fechamento dos tickets (cutoffDate)
        const now = new Date();
        const cutoffDate = new Date(now.setDate(now.getDate() - daysToClose)); // Subtrai os dias da data atual
        
        // Ajusta para o fuso horário de São Paulo (UTC-3)
        const timezoneOffset = -3 * 60; // UTC-3 em minutos
        cutoffDate.setMinutes(cutoffDate.getMinutes() + timezoneOffset);
        
        // Formata a data no formato 'YYYY-MM-DD HH:mm:ss.SSS Z'
        const formattedCutoffDate = cutoffDate.toISOString().slice(0, 23).replace('T', ' ') + ' -03:00';

        // Fecha tickets que estão pendentes ou abertos há mais do que o número de dias especificado
        await db.query(
            'UPDATE tickets SET status = $1 WHERE status IN ($2, $3) AND updatedAt < $4',
            {
                replacements: ['closed', 'pending', 'open', formattedCutoffDate],
            }
        );
        
        console.log(`Fechamento automático realizado para tickets pendentes e abertos há mais de ${daysToClose} dias.`);
    } catch (error) {
        console.error("Erro ao fechar tickets pendentes:", error);
    }
};

// Configura a tarefa agendada
const scheduleClosePendingTicketsJob = () => {
    cron.schedule('* * * * *', closePendingTickets); // Executa diariamente à meia-noite
};

export default scheduleClosePendingTicketsJob;

