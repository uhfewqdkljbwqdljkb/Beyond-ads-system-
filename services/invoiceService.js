import { supabase, handleError, paginate } from './api.js';

export const invoiceService = {
  async getInvoices({ status, clientId, deal_id, page = 1, limit = 20 } = {}) {
    try {
      let query = supabase.from('invoices').select('*, clients(company_name), users(first_name, last_name)', { count: 'exact' });
      
      if (status) query = query.eq('status', status);
      if (clientId) query = query.eq('client_id', clientId);
      if (deal_id) query = query.eq('deal_id', deal_id);

      query = paginate(query, page, limit);
      query = query.order('issue_date', { ascending: false });

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error);
    }
  },

  async getInvoiceById(id) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *, 
          clients(*), 
          deals(name), 
          invoice_line_items(*), 
          users(first_name, last_name), 
          invoice_payments(*, users(first_name, last_name))
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async createInvoice(invoiceData, lineItems) {
    try {
      const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
      
      if (invError) throw invError;

      const itemsToInsert = lineItems.map((item, idx) => ({
        ...item,
        invoice_id: invoice.id,
        display_order: idx,
        total_price: Number(item.quantity) * Number(item.unit_price)
      }));

      const { error: itemsError } = await supabase.from('invoice_line_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      return invoice;
    } catch (error) {
      handleError(error);
    }
  },

  async updateInvoiceStatus(id, status) {
    try {
      const { data, error } = await supabase.from('invoices').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async recordPayment(invoiceId, paymentData) {
    try {
      const { error: payError } = await supabase.from('invoice_payments').insert([{
        invoice_id: invoiceId,
        ...paymentData
      }]);
      if (payError) throw payError;

      const { data: invoice } = await supabase.from('invoices').select('total_amount, amount_paid').eq('id', invoiceId).single();
      const newPaid = Number(invoice.amount_paid) + Number(paymentData.amount);
      const newStatus = newPaid >= Number(invoice.total_amount) ? 'paid' : 'partially_paid';

      const { data, error } = await supabase.from('invoices').update({ 
        amount_paid: newPaid,
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date() : null
      }).eq('id', invoiceId).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error);
    }
  }
};