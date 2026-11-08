/**
 * Temas e prompts do blog automático (1 artigo por semana).
 * Cada tema é uma "dor" real de engenharia; o prompt pede um artigo técnico,
 * em Markdown, com SEO/GEO (resposta direta no topo) e recorte regional (RJ).
 */
export interface BlogTopic {
  slug: string
  title: string
  category: string
  metaDescription: string
  /** Ângulo técnico que orienta o modelo na geração do conteúdo. */
  angle: string
}

export const blogTopics: BlogTopic[] = [
  {
    slug: 'lentidao-autocad-revit-bim-rede',
    title: 'Soluções para lentidão no carregamento de projetos pesados de AutoCAD, Revit e BIM em rede local',
    category: 'Infraestrutura CAD/BIM',
    metaDescription:
      'Por que projetos de AutoCAD, Revit e BIM travam na rede local e como resolver com servidores e storages de alta performance, rede segmentada e boas práticas para escritórios de engenharia no Rio de Janeiro.',
    angle:
      'Explicar os gargalos reais (disco, protocolo SMB, rede, workstation), como diagnosticar e a arquitetura de storage/rede que elimina os travamentos de projetos CAD/BIM.',
  },
  {
    slug: 'backup-protecao-ransomware-projetos-obras',
    title: 'Estratégias de backup e proteção contra ransomware para arquivos de projetos de obras',
    category: 'Segurança',
    metaDescription:
      'Como proteger arquivos de projetos de obras contra ransomware: backup 3-2-1, cópia imutável offsite, versionamento e controle de acesso para escritórios de engenharia no Rio de Janeiro.',
    angle:
      'Backup imutável, regra 3-2-1, versionamento, MFA e plano de continuidade aplicados a arquivos de projeto de engenharia e construção civil.',
  },
  {
    slug: 'internet-estavel-canteiro-obras',
    title: 'Infraestrutura de rede e internet estável para canteiros de obras e escritórios remotos',
    category: 'Redes e Conectividade',
    metaDescription:
      'Como montar internet estável em canteiro de obras: link dedicado + 4G/5G com failover, Wi-Fi industrial e acesso remoto seguro entre obra e escritório de engenharia no Rio de Janeiro.',
    angle:
      'Conectividade redundante com failover, balanceamento de links, Wi-Fi industrial para canteiro e VPN entre obra e escritório.',
  },
  {
    slug: 'storage-nas-san-escritorio-engenharia',
    title: 'Como configurar storages NAS/SAN de alta performance para escritórios de engenharia civil e elétrica',
    category: 'Storage',
    metaDescription:
      'Guia para configurar storages NAS e SAN de alta performance para escritórios de engenharia civil e elétrica: RAID, SSD, protocolos, acesso concorrente e integração com backup em nuvem.',
    angle:
      'Dimensionamento de NAS/SAN para leitura/escrita intensiva de projetos 3D, RAID, SSD cache, protocolos (SMB/NFS) e backup integrado.',
  },
]

/** Próximo tema ainda não publicado. Se todos já existem, cicla pelo mais antigo. */
export function pickNextTopic(publishedSlugs: string[]): BlogTopic {
  const set = new Set(publishedSlugs)
  const pending = blogTopics.find((t) => !set.has(t.slug))
  return pending ?? blogTopics[publishedSlugs.length % blogTopics.length]
}
