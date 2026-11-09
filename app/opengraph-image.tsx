import { OG_SIZE, renderOgImage } from '@/lib/og'

export const alt = 'EngTI RJ — TI para engenharia, arquitetura e construção civil no Rio de Janeiro'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return renderOgImage({
    title: 'TI para engenharia no Rio de Janeiro',
    subtitle: 'Servidores, redes de canteiro, backup e licenças para quem projeta e constrói.',
  })
}
