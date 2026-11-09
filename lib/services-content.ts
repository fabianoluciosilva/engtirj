/**
 * Conteúdo das páginas /servicos/[slug]. Texto original, com recorte regional
 * (RJ) e sem números de desempenho inventados. Os slugs devem existir em
 * `site.services`.
 */
export interface ServiceContent {
  h1: string
  metaTitle: string
  metaDescription: string
  intro: string
  problems: { title: string; text: string }[]
  deliverables: string[]
  howWeWork: { title: string; text: string }[]
  faq: { question: string; answer: string }[]
  /** Categoria do blog usada para listar artigos relacionados. */
  relatedCategories: string[]
  whatsappTopic: string
}

export const servicesContent: Record<string, ServiceContent> = {
  'servidores-storage-cad-bim': {
    h1: 'Servidores e storage para AutoCAD, Revit e BIM no Rio de Janeiro',
    metaTitle: 'Servidor e storage para AutoCAD, Revit e BIM no RJ',
    metaDescription:
      'Servidor de arquivos e storage NAS/SSD para escritórios de engenharia e arquitetura no Rio de Janeiro: modelos de Revit, AutoCAD e BIM abrindo e salvando sem fila.',
    intro:
      'Quando o modelo de Revit leva minutos para abrir e o AutoCAD congela ao salvar, o problema quase nunca é o computador do projetista. Está no lugar onde os arquivos ficam: um servidor antigo, um HD compartilhado ou uma rede que trata o arquivo de projeto como qualquer planilha. Dimensionamos o servidor e o storage a partir do que o seu escritório realmente usa: quantas pessoas, quais softwares, qual o tamanho dos modelos.',
    problems: [
      {
        title: 'Modelos que demoram a abrir e a sincronizar',
        text: 'Vários usuários puxam o mesmo modelo central ao mesmo tempo. Se o disco ou a rede não acompanham, cada abertura vira uma fila.',
      },
      {
        title: 'Arquivos espalhados em máquinas e HDs externos',
        text: 'Sem um repositório central, a versão certa do projeto depende de quem lembra onde salvou. O risco de retrabalho e de perda é permanente.',
      },
      {
        title: 'Servidor que cresceu sem planejamento',
        text: 'Pastas sem padrão, permissões soltas e nenhum controle de espaço. Ninguém sabe o que pode ser arquivado nem quem tem acesso a quê.',
      },
    ],
    deliverables: [
      'Diagnóstico do gargalo real: disco, protocolo de compartilhamento, rede ou estação de trabalho.',
      'Servidor de arquivos ou storage NAS com SSD, RAID e expansão prevista para os próximos anos de projeto.',
      'Rede segmentada, com prioridade para o tráfego de arquivos de projeto e conexão de 10 GbE onde o volume justificar.',
      'Estrutura de pastas e permissões por projeto, com histórico de quem alterou o quê.',
      'Integração com o backup em nuvem e com o acesso remoto seguro para quem trabalha fora do escritório.',
    ],
    howWeWork: [
      {
        title: 'Medimos antes de comprar',
        text: 'Observamos como o escritório trabalha e medimos onde o tempo é perdido. Só então indicamos equipamento.',
      },
      {
        title: 'Implantamos sem parar o escritório',
        text: 'A migração dos projetos é planejada para fins de semana ou fora do horário, com os arquivos antigos mantidos até a validação.',
      },
      {
        title: 'Acompanhamos depois da entrega',
        text: 'Monitoramos espaço, saúde dos discos e desempenho, e avisamos antes de o problema chegar na equipe.',
      },
    ],
    faq: [
      {
        question: 'Preciso trocar todos os computadores para o Revit parar de travar?',
        answer:
          'Normalmente não. Na maioria dos casos o gargalo está no armazenamento e na rede, não na estação. Medimos primeiro; se alguma estação estiver abaixo do necessário, indicamos exatamente qual.',
      },
      {
        question: 'Qual a diferença entre NAS e servidor de arquivos para projetos?',
        answer:
          'O NAS é um equipamento dedicado a armazenar e compartilhar arquivos, simples de administrar e bom para a maioria dos escritórios. O servidor de arquivos roda um sistema completo (como o Windows Server) e faz sentido quando há necessidade de domínio, políticas de acesso avançadas ou outros serviços no mesmo equipamento.',
      },
      {
        question: 'Dá para usar a nuvem em vez de servidor local?',
        answer:
          'Dá em alguns casos, como o uso do Autodesk Docs para colaboração. Mas modelos grandes costumam trabalhar melhor com armazenamento local, e a nuvem entra como complemento e como backup. Avaliamos o seu caso no diagnóstico.',
      },
    ],
    relatedCategories: ['Infraestrutura CAD/BIM', 'Storage'],
    whatsappTopic: 'servidores e storage para CAD e BIM',
  },

  'redes-canteiros-obras': {
    h1: 'Redes e internet para canteiros de obras no Rio de Janeiro',
    metaTitle: 'Internet e rede para canteiro de obras no RJ',
    metaDescription:
      'Cabeamento, Wi-Fi para obra e internet redundante (fibra + 4G/5G) para canteiros de obras e escritórios de engenharia no estado do Rio de Janeiro.',
    intro:
      'O canteiro depende de conexão para receber a prancha atualizada, enviar o diário de obra e falar com o escritório. Só que a obra muda de forma toda semana, tem poeira, chuva e, muitas vezes, uma única linha de internet. Montamos a rede pensando nessas condições: link duplo com troca automática, Wi-Fi dimensionado para a área e acesso seguro aos arquivos do escritório.',
    problems: [
      {
        title: 'Internet que cai e para a obra',
        text: 'Com um único link, qualquer falha da operadora deixa o canteiro sem projetos, sem e-mail e sem como registrar o andamento.',
      },
      {
        title: 'Wi-Fi que não alcança onde a equipe trabalha',
        text: 'Um roteador doméstico no contêiner não cobre o terreno. Pavimentos, paredes e a própria estrutura da obra bloqueiam o sinal.',
      },
      {
        title: 'Acesso aos projetos sem segurança',
        text: 'Arquivos enviados por mensageiro ou pendrive ficam desatualizados e fora de qualquer controle.',
      },
    ],
    deliverables: [
      'Levantamento do local e projeto da rede, com pontos de acesso posicionados para a área real de trabalho.',
      'Dois links de internet (fibra ou rádio, mais 4G/5G) com roteador que faz a troca automática em caso de queda.',
      'Wi-Fi para áreas externas e internas, com equipamentos próprios para poeira e umidade.',
      'VPN entre o canteiro e o escritório, para acessar os projetos atualizados com segurança.',
      'Kit de instalação rápida para obras que mudam de endereço, com documentação do que foi configurado.',
    ],
    howWeWork: [
      {
        title: 'Visitamos o canteiro',
        text: 'Vamos ao local, avaliamos as fases da obra e definimos onde a rede precisa estar em cada etapa.',
      },
      {
        title: 'Instalamos e testamos em campo',
        text: 'Medimos a cobertura com a obra funcionando e simulamos a queda de um link para confirmar a troca automática.',
      },
      {
        title: 'Damos suporte remoto à obra',
        text: 'O responsável pelo canteiro chama no WhatsApp e resolvemos pela internet; quando precisa, vamos até lá.',
      },
    ],
    faq: [
      {
        question: 'Quanto tempo leva para colocar internet em um canteiro novo?',
        answer:
          'Depende da disponibilidade de fibra no endereço e do prazo da operadora. O link móvel 4G/5G costuma ser a opção mais rápida para começar a obra conectada, enquanto a fibra é contratada.',
      },
      {
        question: 'O 4G/5G dá conta sozinho de uma obra?',
        answer:
          'Para equipes pequenas, sim, como solução provisória. Para uso contínuo, o ideal é o 4G/5G como segundo link, para continuar funcionando quando o link principal cair.',
      },
      {
        question: 'Vocês atendem obras fora da capital?',
        answer:
          'Sim, em todo o estado do Rio de Janeiro. A cobertura de operadoras varia por região, e verificamos isso antes de definir a solução.',
      },
    ],
    relatedCategories: ['Redes e Conectividade'],
    whatsappTopic: 'rede e internet para canteiro de obras',
  },

  'backup-ransomware': {
    h1: 'Backup em nuvem e proteção contra ransomware para engenharia no RJ',
    metaTitle: 'Backup e proteção contra ransomware para engenharia no RJ',
    metaDescription:
      'Backup 3-2-1 com cópia imutável e proteção contra ransomware para escritórios de engenharia e construtoras no Rio de Janeiro. Recupere pranchas e modelos.',
    intro:
      'Um HD queimado ou um ransomware pode apagar anos de projetos em minutos. Em escritórios de engenharia, o que se perde costuma ser justamente o que não se refaz: modelos revisados, memoriais, pranchas já aprovadas. Montamos um backup que funciona mesmo no pior cenário, com uma cópia que o próprio invasor não consegue alterar.',
    problems: [
      {
        title: 'Backup que ninguém testou',
        text: 'O HD externo rodando às sextas pode estar corrompido há meses. Só se descobre quando é preciso restaurar.',
      },
      {
        title: 'Cópia na mesma rede do ataque',
        text: 'Ransomware criptografa tudo o que alcança, inclusive o backup que está conectado ao servidor.',
      },
      {
        title: 'Sem plano para retomar o trabalho',
        text: 'Mesmo com a cópia em mãos, sem um roteiro de recuperação a equipe fica parada por dias.',
      },
    ],
    deliverables: [
      'Backup 3-2-1: três cópias, em dois tipos de mídia, uma delas fora do escritório.',
      'Cópia imutável na nuvem, que não pode ser alterada nem apagada durante o período de retenção.',
      'Versionamento, para voltar ao arquivo de antes do incidente, não só à última cópia.',
      'Teste de restauração periódico, com relatório do que foi recuperado.',
      'Controle de acesso por perfil, autenticação em dois fatores e antivírus gerenciado nas estações.',
      'Plano de continuidade: quem faz o quê, em que ordem, para a equipe voltar a trabalhar.',
    ],
    howWeWork: [
      {
        title: 'Mapeamos o que não pode ser perdido',
        text: 'Definimos com você quais pastas e sistemas são críticos e por quanto tempo precisam ser guardados.',
      },
      {
        title: 'Automatizamos e monitoramos',
        text: 'O backup roda sozinho e recebemos o alerta quando uma execução falha, sem depender de alguém lembrar.',
      },
      {
        title: 'Testamos a restauração',
        text: 'De tempos em tempos recuperamos arquivos de verdade para provar que a cópia funciona.',
      },
    ],
    faq: [
      {
        question: 'O que é backup imutável?',
        answer:
          'É uma cópia gravada de forma que não pode ser modificada nem apagada por um período definido, nem por quem tem acesso administrativo. Por isso o ransomware não consegue criptografá-la.',
      },
      {
        question: 'Backup em nuvem é seguro para projetos de clientes?',
        answer:
          'Sim, desde que os dados sejam criptografados antes do envio e o acesso tenha autenticação em dois fatores. Configuramos esses controles e documentamos onde os dados ficam armazenados.',
      },
      {
        question: 'E se o escritório já foi atacado por ransomware?',
        answer:
          'Chame-nos o quanto antes e não pague nem reinicie os equipamentos antes de conversar. Avaliamos o que ainda pode ser recuperado e, depois, reforçamos a proteção para evitar um novo ataque.',
      },
    ],
    relatedCategories: ['Segurança'],
    whatsappTopic: 'backup e proteção contra ransomware',
  },

  'licenciamento-softwares-tecnicos': {
    h1: 'Gestão de licenças Autodesk e software técnico para engenharia no RJ',
    metaTitle: 'Gestão de licenças Autodesk e Microsoft 365 para engenharia',
    metaDescription:
      'Controle de licenças Autodesk (Revit, AutoCAD, Civil 3D), Microsoft 365 e plataformas BIM para empresas de engenharia no Rio de Janeiro: custo e conformidade.',
    intro:
      'Licença de software técnico é um dos maiores custos fixos de um escritório de engenharia, e também um dos menos acompanhados. Assinaturas que vencem sem aviso, usuários que saíram da empresa mas continuam com acesso, versões diferentes entre as máquinas. Centralizamos o controle para a empresa pagar só pelo que usa e ficar em dia.',
    problems: [
      {
        title: 'Assinaturas vencendo sem aviso',
        text: 'A licença expira no meio de uma entrega e o projetista fica sem poder abrir o Revit.',
      },
      {
        title: 'Pagar por licença que ninguém usa',
        text: 'Ex-funcionários e estagiários que saíram continuam consumindo assinatura, mês após mês.',
      },
      {
        title: 'Versões diferentes entre as máquinas',
        text: 'Um arquivo salvo numa versão mais nova não abre na outra, e o time perde tempo convertendo.',
      },
    ],
    deliverables: [
      'Inventário de todas as licenças em uso: quem tem o quê, em qual versão e até quando.',
      'Painel de renovações, com aviso antes do vencimento.',
      'Revisão de uso para cancelar ou realocar o que está parado.',
      'Padronização de versões de Revit, AutoCAD e Civil 3D entre as estações.',
      'Gestão de contas Microsoft 365: usuários, e-mail, armazenamento e segurança.',
    ],
    howWeWork: [
      {
        title: 'Levantamos tudo',
        text: 'Reunimos contratos, contas e instalações para montar o retrato real do que a empresa tem.',
      },
      {
        title: 'Propomos o ajuste',
        text: 'Mostramos onde dá para economizar e o que precisa ser regularizado, antes de qualquer mudança.',
      },
      {
        title: 'Mantemos atualizado',
        text: 'Quando entra ou sai alguém, ajustamos o acesso e mantemos o inventário em dia.',
      },
    ],
    faq: [
      {
        question: 'Vocês vendem as licenças Autodesk?',
        answer:
          'Cuidamos da gestão e da regularização. Quando a compra é necessária, orientamos a empresa sobre o plano mais adequado e o processo de contratação.',
      },
      {
        question: 'Como evitar que a licença expire no meio de um projeto?',
        answer:
          'Mantendo um calendário de renovações com aviso antecipado. Nós acompanhamos as datas e avisamos o responsável antes do vencimento.',
      },
      {
        question: 'Dá para reduzir o custo com licenças?',
        answer:
          'Em geral sim. A revisão de uso costuma encontrar assinaturas paradas, planos acima do necessário e usuários que já saíram da empresa.',
      },
    ],
    relatedCategories: [],
    whatsappTopic: 'gestão de licenças de software técnico',
  },
}
