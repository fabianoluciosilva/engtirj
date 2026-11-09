import { redirect } from 'next/navigation'

// Não há índice de serviços: a lista fica na home.
export default function ServicosIndex() {
  redirect('/#servicos')
}
