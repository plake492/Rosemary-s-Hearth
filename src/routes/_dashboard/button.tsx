import { createFileRoute } from '@tanstack/react-router';
import ButtonDemo from '@/components/ButtonDemo';

export const Route = createFileRoute('/_dashboard/button')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ButtonDemo />;
}
