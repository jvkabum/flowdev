import Ticket from '../../models/Ticket';
import { getDaysToClose } from './ConfiguraFechamentoTicketService';
import { Op } from 'sequelize';

export class ClosePendingTicketsService {
    async execute() {
        const daysToClose = await getDaysToClose(); // Busca o valor configurado
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - daysToClose);

        // Atualiza todos os tickets pendentes que estão antes da data limite
        const [numTicketsFechados] = await Ticket.update(
            { status: 'fechado' },
            {
                where: {
                    status: { [Op.in]: ['pending', 'open'] }, // Fechar tickets `pendente` e `open`
                    updatedAt: { [Op.lt]: dataLimite }          // Usando updatedAt como última interação
                }
            }
        );

        console.log(`${numTicketsFechados} tickets foram fechados automaticamente.`);
    }
}

