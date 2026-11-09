import { Server, Wifi, ShieldCheck, KeyRound, type LucideIcon } from 'lucide-react'
import type { ServiceIcon } from '@/lib/site'

/** Ícone lucide de cada serviço, indexado por `site.services[].icon`. */
export const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  server: Server,
  wifi: Wifi,
  shield: ShieldCheck,
  key: KeyRound,
}
