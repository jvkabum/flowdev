import Ticket from '../../models/Ticket';

class CloseTicketService {
  async execute(ticketId: string): Promise<Ticket | null> {
    // Verifica se o ticket existe
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      throw new Error('Ticket não encontrado');
    }

    // Verifica se o ticket já está fechado
    if (ticket.status === 'closed') {
      throw new Error('O ticket já está fechado');
    }

    // Verifica se a última interação permite o fechamento do ticket
    const canClose = this.canCloseTicket(ticket.updatedAt);

    if (!canClose) {
      throw new Error('Não é possível fechar o ticket, pois existem interações recentes.');
    }

    // Atualiza o status do ticket para fechado
    ticket.status = 'closed';
    await ticket.save();

    return ticket;
  }

  private canCloseTicket(lastInteraction: Date): boolean {
    // Permite o fechamento se a última interação foi há mais de 24 horas
    const now = new Date();
    const diffInHours = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);
    return diffInHours > 24;
  }
}

export { CloseTicketService };
	