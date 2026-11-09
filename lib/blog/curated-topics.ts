/**
 * Temas curados do blog: problemas reais de TI de escritórios de engenharia,
 * arquitetura e construtoras. Alimentam a tabela `topics` (npm run db:seed).
 * O pipeline escolhe o próximo tema da categoria menos publicada e, quando a
 * fila acaba, a etapa de pesquisa propõe temas novos.
 */
export interface CuratedTopic {
  title: string
  category: string
  /** Ângulo técnico que orienta a pesquisa e a redação. */
  angle: string
  keywords: string[]
}

export const CATEGORIES = [
  'Infraestrutura CAD/BIM',
  'Storage',
  'Redes e Conectividade',
  'Segurança',
  'Licenciamento e Software',
  'Acesso Remoto e Nuvem',
  'Estações de Trabalho',
] as const

export const curatedTopics: CuratedTopic[] = [
  // ── Infraestrutura CAD/BIM ────────────────────────────────────────────────
  {
    title: 'Por que o Revit demora para abrir o modelo central na rede e como resolver',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Worksharing, modelo central, latência de rede e disco; como medir o gargalo e o que ajustar primeiro.',
    keywords: ['revit lento', 'modelo central', 'worksharing', 'rede'],
  },
  {
    title: 'AutoCAD travando ao salvar arquivos na rede: causas e correções',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Protocolo SMB, antivírus escaneando arquivos DWG, caminhos longos e referências externas (xrefs).',
    keywords: ['autocad travando', 'salvar na rede', 'dwg', 'smb'],
  },
  {
    title: 'Como dimensionar o servidor de arquivos de um escritório de projetos',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Número de usuários simultâneos, tamanho médio dos modelos, tipo de disco e margem de crescimento.',
    keywords: ['servidor de arquivos', 'dimensionamento', 'escritório de projetos'],
  },
  {
    title: 'Navisworks e federação de modelos: o que a infraestrutura precisa ter',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Consumo de memória e disco na federação de modelos BIM e como a rede e o armazenamento influenciam.',
    keywords: ['navisworks', 'federação de modelos', 'bim', 'compatibilização'],
  },
  {
    title: 'Revit Server, Autodesk Docs ou servidor local: qual escolher para trabalho em equipe',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Comparação prática entre colaboração em nuvem, Revit Server e servidor de arquivos local para equipes pequenas e médias.',
    keywords: ['revit server', 'autodesk docs', 'colaboração bim'],
  },
  {
    title: 'Como organizar pastas e permissões de projetos no servidor do escritório',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Estrutura por projeto e disciplina, permissões por grupo, histórico de alterações e arquivamento de obras concluídas.',
    keywords: ['organização de pastas', 'permissões', 'projetos de engenharia'],
  },
  {
    title: 'Como acelerar o carregamento de nuvens de pontos e modelos 3D grandes',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Nuvens de pontos de escaneamento a laser e fotogrametria: armazenamento, rede e estação de trabalho.',
    keywords: ['nuvem de pontos', 'laser scanner', 'modelos 3d grandes'],
  },
  {
    title: 'Migração de servidor de arquivos sem parar o escritório: passo a passo',
    category: 'Infraestrutura CAD/BIM',
    angle: 'Planejamento, cópia incremental, validação de permissões, janela de corte e plano de volta.',
    keywords: ['migração de servidor', 'robocopy', 'sem parar'],
  },

  // ── Storage ───────────────────────────────────────────────────────────────
  {
    title: 'NAS ou servidor Windows para escritório de engenharia: qual escolher',
    category: 'Storage',
    angle: 'Critérios de decisão: usuários, domínio, permissões, aplicações no servidor, administração e custo total.',
    keywords: ['nas', 'servidor windows', 'escritório de engenharia'],
  },
  {
    title: 'RAID 5, RAID 6 ou RAID 10 para arquivos de projeto: o que muda na prática',
    category: 'Storage',
    angle: 'Desempenho, tolerância a falhas, tempo de reconstrução e por que RAID não substitui backup.',
    keywords: ['raid 5', 'raid 6', 'raid 10', 'tolerância a falhas'],
  },
  {
    title: 'SSD ou HD no storage de projetos: quando o SSD compensa',
    category: 'Storage',
    angle: 'Padrões de acesso de CAD e BIM, cache SSD, camadas de armazenamento e custo por terabyte.',
    keywords: ['ssd', 'hd', 'cache ssd', 'storage'],
  },
  {
    title: 'Quando o escritório precisa de rede de 10 GbE e quando 1 GbE basta',
    category: 'Storage',
    angle: 'Como saber se a rede é o gargalo, equipamentos necessários (placas, switch, cabeamento) e retorno do investimento.',
    keywords: ['10gbe', 'switch', 'gargalo de rede'],
  },
  {
    title: 'Como saber quando o storage do escritório está acabando e planejar a expansão',
    category: 'Storage',
    angle: 'Monitorar crescimento, limpar duplicatas, arquivar obras antigas e dimensionar a próxima expansão.',
    keywords: ['espaço em disco', 'expansão de storage', 'arquivamento'],
  },
  {
    title: 'Snapshots e versionamento: como voltar a uma versão anterior do projeto',
    category: 'Storage',
    angle: 'Snapshots do NAS e versões anteriores de arquivos como proteção contra exclusão e sobrescrita acidental.',
    keywords: ['snapshot', 'versões anteriores', 'recuperar arquivo'],
  },
  {
    title: 'Deduplicação e compressão em storage de projetos: vale a pena ativar',
    category: 'Storage',
    angle: 'Efeito em arquivos de CAD e BIM, consumo de processamento e riscos de ativar em volumes sensíveis.',
    keywords: ['deduplicação', 'compressão', 'storage'],
  },
  {
    title: 'Quanto armazenamento um escritório de arquitetura precisa por projeto',
    category: 'Storage',
    angle: 'Ordem de grandeza por tipo de projeto, renders, nuvens de pontos e histórico, com método para estimar.',
    keywords: ['quanto armazenamento', 'arquitetura', 'projeto'],
  },

  // ── Redes e Conectividade ─────────────────────────────────────────────────
  {
    title: 'Internet redundante em canteiro de obras: fibra, rádio e 4G/5G juntos',
    category: 'Redes e Conectividade',
    angle: 'Arquitetura com dois links, balanceamento e failover automático, e como testar a troca.',
    keywords: ['internet redundante', 'canteiro de obras', 'failover', '4g 5g'],
  },
  {
    title: 'Wi-Fi para canteiro de obras: como cobrir a área sem perder sinal a cada etapa',
    category: 'Redes e Conectividade',
    angle: 'Pontos de acesso externos, alcance, alimentação elétrica provisória e reposicionamento conforme a obra avança.',
    keywords: ['wi-fi canteiro', 'ponto de acesso externo', 'cobertura'],
  },
  {
    title: 'VPN entre obra e escritório: como acessar os projetos com segurança',
    category: 'Redes e Conectividade',
    angle: 'VPN site-to-site e de cliente, autenticação em dois fatores e desempenho em links móveis.',
    keywords: ['vpn', 'acesso remoto', 'obra e escritório'],
  },
  {
    title: 'Segmentação de rede em escritório de engenharia: VLANs que fazem diferença',
    category: 'Redes e Conectividade',
    angle: 'Separar servidores, estações, visitantes e câmeras; ganhos de segurança e de desempenho.',
    keywords: ['vlan', 'segmentação', 'rede de escritório'],
  },
  {
    title: 'Cabeamento estruturado em escritório de projetos: o que não pode faltar',
    category: 'Redes e Conectividade',
    angle: 'Categoria de cabo, pontos de rede por posto, rack, identificação e certificação do cabeamento.',
    keywords: ['cabeamento estruturado', 'cat6', 'rack'],
  },
  {
    title: 'Como escolher o plano de internet para um escritório de engenharia no Rio de Janeiro',
    category: 'Redes e Conectividade',
    angle: 'Link dedicado ou banda larga, upload para envio de projetos, SLA, IP fixo e segundo link de contingência.',
    keywords: ['link dedicado', 'banda larga', 'upload', 'rio de janeiro'],
  },
  {
    title: 'Upload lento de projetos para clientes e nuvem: causas e soluções',
    category: 'Redes e Conectividade',
    angle: 'Diferença entre download e upload, QoS, horários de envio e quando o link precisa ser trocado.',
    keywords: ['upload lento', 'envio de projetos', 'qos'],
  },
  {
    title: 'Câmeras e telemetria de obra: como não derrubar a rede do canteiro',
    category: 'Redes e Conectividade',
    angle: 'Consumo de banda de câmeras IP, armazenamento local, prioridade de tráfego e rede separada.',
    keywords: ['câmeras de obra', 'telemetria', 'banda'],
  },

  // ── Segurança ─────────────────────────────────────────────────────────────
  {
    title: 'Backup 3-2-1 para escritório de engenharia: como montar na prática',
    category: 'Segurança',
    angle: 'Três cópias, duas mídias e uma fora do local; o que cada cópia protege e como automatizar.',
    keywords: ['backup 3-2-1', 'escritório de engenharia', 'backup automático'],
  },
  {
    title: 'O que é backup imutável e por que ele protege contra ransomware',
    category: 'Segurança',
    angle: 'Imutabilidade (object lock/WORM), período de retenção e a diferença para backup comum.',
    keywords: ['backup imutável', 'ransomware', 'object lock'],
  },
  {
    title: 'Como saber se o seu backup realmente restaura: teste de restauração passo a passo',
    category: 'Segurança',
    angle: 'Plano de teste periódico, o que validar, tempo de recuperação e registro do resultado.',
    keywords: ['teste de restauração', 'backup', 'rto'],
  },
  {
    title: 'Ransomware em escritório de engenharia: o que fazer nas primeiras horas',
    category: 'Segurança',
    angle: 'Isolar equipamentos, preservar evidências, avaliar backups e comunicação; o que não fazer.',
    keywords: ['ransomware', 'resposta a incidente', 'primeiras horas'],
  },
  {
    title: 'Autenticação em dois fatores para equipes de projeto: onde ativar primeiro',
    category: 'Segurança',
    angle: 'E-mail, nuvem, VPN e administração; métodos de autenticação e adoção sem atrito.',
    keywords: ['2fa', 'autenticação em dois fatores', 'microsoft 365'],
  },
  {
    title: 'Phishing contra escritórios de arquitetura e engenharia: golpes mais comuns',
    category: 'Segurança',
    angle: 'Falsos boletos, pedidos de orçamento com link malicioso e como treinar a equipe a reconhecer.',
    keywords: ['phishing', 'golpe', 'e-mail falso'],
  },
  {
    title: 'LGPD para escritório de engenharia: o mínimo de TI que você precisa ter',
    category: 'Segurança',
    angle: 'Dados de clientes e funcionários, controle de acesso, backup e registro, em linguagem prática.',
    keywords: ['lgpd', 'dados pessoais', 'controle de acesso'],
  },
  {
    title: 'Antivírus ou EDR: qual a proteção adequada para estações de projeto',
    category: 'Segurança',
    angle: 'Diferença entre antivírus tradicional e EDR, impacto no desempenho do CAD e exclusões seguras.',
    keywords: ['antivírus', 'edr', 'estações de trabalho'],
  },

  // ── Licenciamento e Software ──────────────────────────────────────────────
  {
    title: 'Como controlar as licenças Autodesk e evitar pagar por assinaturas paradas',
    category: 'Licenciamento e Software',
    angle: 'Inventário de usuários, relatórios do portal, reatribuição de assentos e calendário de renovação.',
    keywords: ['licenças autodesk', 'assinaturas', 'custo'],
  },
  {
    title: 'Licença Autodesk expirou no meio da entrega: como evitar e o que fazer',
    category: 'Licenciamento e Software',
    angle: 'Alertas de vencimento, administração da conta, e passos de recuperação rápida do acesso.',
    keywords: ['licença expirada', 'autodesk', 'renovação'],
  },
  {
    title: 'Microsoft 365 para escritório de engenharia: planos, armazenamento e segurança',
    category: 'Licenciamento e Software',
    angle: 'Qual plano atende, OneDrive e SharePoint para arquivos de projeto e limites a considerar.',
    keywords: ['microsoft 365', 'sharepoint', 'onedrive'],
  },
  {
    title: 'Como padronizar versões de Revit e AutoCAD entre todas as estações',
    category: 'Licenciamento e Software',
    angle: 'Problemas de compatibilidade entre versões, política de atualização e implantação centralizada.',
    keywords: ['versões revit', 'padronização', 'atualização'],
  },
  {
    title: 'Software pirata em escritório de engenharia: riscos jurídicos e de segurança',
    category: 'Licenciamento e Software',
    angle: 'Riscos de multa e de malware, e caminhos para regularizar sem paralisar o escritório.',
    keywords: ['software pirata', 'regularização', 'conformidade'],
  },
  {
    title: 'Assinatura, licença perpétua ou nuvem: como decidir o modelo de software técnico',
    category: 'Licenciamento e Software',
    angle: 'Comparar custo total e flexibilidade nos modelos de licenciamento de software de projeto.',
    keywords: ['assinatura', 'licença perpétua', 'custo total'],
  },
  {
    title: 'Gestão de licenças de rede (servidor de licenças) em escritórios de projeto',
    category: 'Licenciamento e Software',
    angle: 'Como funciona o servidor de licenças, falhas comuns de conexão e boas práticas de configuração.',
    keywords: ['servidor de licenças', 'licença de rede', 'flexnet'],
  },
  {
    title: 'Inventário de software e hardware: como saber o que o escritório tem instalado',
    category: 'Licenciamento e Software',
    angle: 'Ferramentas de inventário, planilha mínima, ciclo de vida de equipamentos e renovação planejada.',
    keywords: ['inventário de ti', 'ativos', 'ciclo de vida'],
  },

  // ── Acesso Remoto e Nuvem ─────────────────────────────────────────────────
  {
    title: 'Trabalho remoto com Revit e AutoCAD: como acessar o escritório de casa',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Acesso remoto à estação, VPN com arquivos locais e estação virtual; vantagens e limites de cada um.',
    keywords: ['trabalho remoto', 'revit', 'acesso remoto'],
  },
  {
    title: 'Estação de trabalho virtual na nuvem para BIM: vale a pena',
    category: 'Acesso Remoto e Nuvem',
    angle: 'GPU na nuvem, latência, custo por hora e casos em que compensa frente a comprar máquinas.',
    keywords: ['estação virtual', 'gpu na nuvem', 'bim'],
  },
  {
    title: 'Backup em nuvem para arquivos de projeto: o que escolher e quanto custa',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Tipos de nuvem, custos de armazenamento e restauração, tempo de envio inicial e criptografia.',
    keywords: ['backup em nuvem', 'custo', 'armazenamento em nuvem'],
  },
  {
    title: 'Compartilhar projetos com clientes e consultores sem e-mail e pendrive',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Links com expiração, permissões, registro de acessos e plataformas de colaboração.',
    keywords: ['compartilhar projetos', 'link seguro', 'colaboração'],
  },
  {
    title: 'Sincronização de arquivos entre escritório e obra: como evitar versões conflitantes',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Fonte única da verdade, sincronização controlada, arquivos somente leitura na obra.',
    keywords: ['sincronização', 'versões conflitantes', 'obra'],
  },
  {
    title: 'Tablet e celular na obra: como acessar pranchas atualizadas com segurança',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Visualizadores de projeto, acesso offline, gestão de dispositivos e perda ou roubo do aparelho.',
    keywords: ['tablet na obra', 'pranchas', 'mdm'],
  },
  {
    title: 'Quanto custa a TI de um escritório de engenharia: como montar o orçamento',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Componentes do custo (equipamento, licenças, suporte, backup, conectividade) e como comparar propostas.',
    keywords: ['custo de ti', 'orçamento', 'suporte de ti'],
  },
  {
    title: 'Suporte de TI interno ou terceirizado em escritório de engenharia: como decidir',
    category: 'Acesso Remoto e Nuvem',
    angle: 'Tamanho da equipe, nível de conhecimento exigido, cobertura em horários críticos e custo.',
    keywords: ['ti terceirizada', 'suporte de ti', 'custo'],
  },

  // ── Estações de Trabalho ──────────────────────────────────────────────────
  {
    title: 'Configuração de computador para Revit e AutoCAD: processador, memória e placa de vídeo',
    category: 'Estações de Trabalho',
    angle: 'Onde cada componente pesa nos softwares de projeto e como evitar gastar no item errado.',
    keywords: ['computador para revit', 'configuração', 'placa de vídeo'],
  },
  {
    title: 'Notebook ou desktop para projetista: o que considerar na compra',
    category: 'Estações de Trabalho',
    angle: 'Desempenho sustentado, refrigeração, portabilidade, docks e custo ao longo da vida útil.',
    keywords: ['notebook para projetista', 'desktop', 'workstation'],
  },
  {
    title: 'Quando trocar as estações de trabalho do escritório: sinais e planejamento',
    category: 'Estações de Trabalho',
    angle: 'Ciclo de vida, sinais de que a máquina limita o trabalho e renovação escalonada.',
    keywords: ['trocar computadores', 'ciclo de vida', 'renovação'],
  },
  {
    title: 'Monitores para projeto: tamanho, resolução e calibração de cor',
    category: 'Estações de Trabalho',
    angle: 'Resolução e escala no CAD, painel IPS, calibração e ergonomia para jornadas longas.',
    keywords: ['monitor para cad', 'calibração', 'ergonomia'],
  },
  {
    title: 'Placa de vídeo profissional ou gamer para modelagem 3D e renderização',
    category: 'Estações de Trabalho',
    angle: 'Drivers certificados, estabilidade, VRAM e custo-benefício para modelagem e renderização.',
    keywords: ['placa de vídeo profissional', 'rtx', 'renderização'],
  },
  {
    title: 'Computador lento no escritório: checklist de diagnóstico antes de comprar outro',
    category: 'Estações de Trabalho',
    angle: 'Disco, memória, temperatura, drivers, software em segundo plano e o que realmente exige troca.',
    keywords: ['computador lento', 'diagnóstico', 'upgrade'],
  },
  {
    title: 'No-break e estabilizador para escritório e obra: como dimensionar a proteção elétrica',
    category: 'Estações de Trabalho',
    angle: 'Cargas críticas (servidor, storage, rede), autonomia, qualidade da energia e riscos de queda.',
    keywords: ['no-break', 'proteção elétrica', 'servidor'],
  },
  {
    title: 'Renderização local ou em nuvem: qual compensa para escritórios de arquitetura',
    category: 'Estações de Trabalho',
    angle: 'Custo por render, prazos, fila de máquinas, nuvem de renderização e planejamento de picos.',
    keywords: ['renderização em nuvem', 'render farm', 'arquitetura'],
  },
]
