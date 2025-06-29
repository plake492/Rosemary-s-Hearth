import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/superSecretRoute')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/superSecretRoute"!</div>
}
