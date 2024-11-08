import Ticket from '../../models/Ticket';
import { getDaysToClose } from './ConfiguraFechamentoTicketService';
import { Op } from 'sequelize';

export class ClosePendingTicketsService {
    async execute() {
        const daysToClose = await getDaysToClose(); // Busca o valor configurado
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - daysToClose);

        // Busca tickets com status "pending" que têm a última interação antes da data limite
        const ticketsPendentes = await Ticket.findAll({
            where: {
                status: 'pending', // Corrigido para "pending"
                updatedAt: { [Op.lt]: dataLimite } // Verificação de interação pela coluna "updatedAt"
            }
        });

        for (const ticket of ticketsPendentes) {
            ticket.status = 'closed'; // Atualiza o status para "closed"
            await ticket.save();
            console.log(`Ticket ${ticket.id} fechado automaticamente.`);
        }
    }
}

