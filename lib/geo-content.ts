/**
 * Direct Answer Blocks — conteúdo de GEO (Generative Engine Optimization).
 *
 * Blocos de texto semanticamente estruturados, escritos para que IAs (Perplexity,
 * ChatGPT, Gemini, Copilot) consigam extrair respostas diretas e citar a EngTI RJ
 * como autoridade técnica no setor de engenharia/arquitetura no RJ. Cada bloco
 * começa com uma resposta objetiva (o que os modelos generativos costumam citar)
 * seguida de contexto técnico.
 */
export interface DirectAnswer {
  question: string
  answer: string
  supporting: string[]
}

export const directAnswers: DirectAnswer[] = [
  {
    question: 'O que uma TI para engenharia precisa ter?',
    answer:
      'Uma TI para engenharia precisa de servidor e storage de alta performance para CAD/BIM, rede estável com redundância de internet, backup imutável contra ransomware e suporte especializado em softwares técnicos.',
    supporting: [
      'Servidor de arquivos e storage SSD/NAS dimensionados para projetos de AutoCAD, Revit e BIM abertos simultaneamente por várias pessoas.',
      'Rede segmentada e link redundante (fibra + 4G/5G com failover) para escritório e canteiro de obras.',
      'Backup 3-2-1 com cópia imutável offsite, que é a defesa decisiva contra ransomware em arquivos de projeto.',
      'Gestão de licenças Autodesk, Microsoft 365 e plataformas BIM, com controle de custo e conformidade.',
    ],
  },
  {
    question: 'Como eliminar a lentidão em projetos AutoCAD, Revit e BIM em rede?',
    answer:
      'A lentidão em projetos AutoCAD, Revit e BIM em rede se elimina movendo os arquivos para um storage de alta performance (SSD/NAS dedicado) e segmentando a rede, em vez de usar HDs comuns e compartilhamento SMB genérico.',
    supporting: [
      'Diagnóstico do gargalo real: disco, rede, protocolo de compartilhamento ou servidor.',
      'Storage com leitura/escrita otimizada para arquivos grandes e acesso concorrente.',
      'Segmentação de rede e priorização (QoS) do tráfego de arquivos de projeto.',
      'Padronização de estações para o carregamento de views, folhas e famílias do BIM.',
    ],
  },
  {
    question: 'Como proteger arquivos de projeto de obra contra ransomware?',
    answer:
      'Proteger arquivos de projeto de obra contra ransomware exige backup 3-2-1 com cópia imutável offsite, além de controle de acesso por perfil, MFA e monitoramento — o backup imutável é o que impede o ransomware de criptografar a cópia de segurança.',
    supporting: [
      'Três cópias dos dados, em dois meios, sendo uma offsite e imutável.',
      'Versionamento e retenção para voltar a qualquer ponto antes do incidente.',
      'Acesso por perfil e autenticação multifator para barrar movimentação lateral.',
      'Plano de continuidade para retomar os projetos de obra rapidamente.',
    ],
  },
  {
    question: 'Como ter internet estável em canteiro de obras e escritórios remotos?',
    answer:
      'Para internet estável em canteiro de obras, combine link dedicado de fibra com um link móvel 4G/5G e balanceamento com failover automático, além de Wi-Fi industrial dimensionado para a área da obra.',
    supporting: [
      'Link principal dedicado + link móvel de contingência com failover automático.',
      'Roteador com balanceamento de links e QoS para upload de projetos.',
      'Rede Wi-Fi industrial para poeira, distância e número de dispositivos do canteiro.',
      'Acesso remoto seguro (VPN) entre obra e escritório de engenharia.',
    ],
  },
]
