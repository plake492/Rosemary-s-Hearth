import { createFileRoute } from '@tanstack/react-router';
import IngredientsTable from '@/components/AdminDash/Ingredients/IngredientsTable';
import DashContentWrapper from '@/components/AdminDash/DashContentWrapper';

export const Route = createFileRoute('/_dashboard/ingredients')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DashContentWrapper>
        <h1 className="mb-4">Ingredients</h1>
        <IngredientsTable />
      </DashContentWrapper>
    </div>
  );
}
