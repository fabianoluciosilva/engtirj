/**
 * FAQ da EngTI RJ — fonte única para:
 *  1. A seção de FAQ da home (Server Component).
 *  2. O JSON-LD FAQPage (rich snippet do Google).
 *  3. O /llms.txt (resumo para IAs generativas).
 *
 * Cada resposta começa com a resposta objetiva (formato "direct answer"),
 * seguida do contexto. Sem números de desempenho inventados.
 */
export interface FaqItem {
  question: string
  answer: string
}

export const faq: FaqItem[] = [
  {
    question: 'O que uma TI para engenharia precisa ter?',
    answer:
      'Uma TI para engenharia precisa de quatro coisas: servidor e storage dimensionados para abrir e salvar modelos de AutoCAD, Revit e BIM em rede; rede estável, com internet redundante, inclusive no canteiro; backup com cópia imutável fora do escritório; e um time de suporte que conheça Autodesk e a rotina de obra. A EngTI RJ monta esses quatro pontos para escritórios e construtoras do Rio de Janeiro.',
  },
  {
    question: 'Por que o Revit, o AutoCAD e o BIM travam na rede?',
    answer:
      'Travam porque o arquivo de projeto, que pode ter centenas de MB, fica num servidor ou HD comum, compartilhado por vários usuários ao mesmo tempo numa rede sem priorização. O gargalo costuma estar no disco, no protocolo de compartilhamento ou na rede, e só um diagnóstico mostra qual. A solução típica é um storage NAS com SSD e uma rede segmentada para o tráfego de arquivos de projeto.',
  },
  {
    question: 'Como proteger os arquivos de obra contra ransomware?',
    answer:
      'Com backup 3-2-1: três cópias, em dois tipos de mídia, e uma delas fora do escritório e imutável. A cópia imutável é a que o ransomware não consegue criptografar nem apagar. Complementam o controle de acesso por perfil, autenticação em dois fatores e versionamento, para voltar ao estado de antes do ataque.',
  },
  {
    question: 'Como ter internet estável em um canteiro de obras?',
    answer:
      'Combinando um link de fibra com um link móvel 4G/5G e um roteador que troca de um para o outro sozinho quando a fibra cai. Em obras grandes, soma-se Wi-Fi para uso externo dimensionado para a área e uma VPN para o canteiro acessar os arquivos do escritório com segurança.',
  },
  {
    question: 'Vocês configuram NAS ou SAN para escritório de engenharia?',
    answer:
      'Sim. Configuramos storage NAS e SAN com RAID, compartilhamento ajustado para arquivos grandes, permissões por projeto e integração com o backup em nuvem. A escolha entre NAS e SAN depende do número de usuários e do tamanho dos modelos, e é definida no diagnóstico.',
  },
  {
    question: 'Como funciona o diagnóstico gratuito?',
    answer:
      'Você chama no WhatsApp, descreve o que está travando e agendamos uma conversa. Analisamos servidor, rede, backup e licenças e entregamos uma lista de prioridades com o que corrigir primeiro. O diagnóstico não tem custo nem compromisso de contratação.',
  },
  {
    question: 'A EngTI RJ atende fora da capital?',
    answer:
      'Sim. Atendemos todo o estado do Rio de Janeiro, incluindo Niterói, Baixada Fluminense, Região Serrana, Região dos Lagos, Sul Fluminense e o interior. A maior parte do suporte é remota; quando o problema exige, vamos até o escritório ou ao canteiro.',
  },
  {
    question: 'Vocês cuidam das licenças Autodesk e Microsoft 365?',
    answer:
      'Sim. Controlamos quem usa cada licença de Revit, AutoCAD, Civil 3D e Microsoft 365, avisamos as renovações antes do vencimento e reduzimos custo cancelando o que não está em uso. Assim a empresa evita tanto pagar a mais quanto ficar fora de conformidade.',
  },
]
