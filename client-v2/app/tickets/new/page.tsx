import { fetchCategories } from '@/lib/server-actions';
import { NewTicketForm } from './new-ticket-form';

export const metadata = {
  title: 'Create a Ticket - GitTix',
};

export default async function NewTicketPage() {
  const categories = await fetchCategories();
  return <NewTicketForm categories={categories} />;
}
