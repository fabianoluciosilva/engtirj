/**
 * FAQ da EngTI RJ — fonte única para:
 *  1. A seção de FAQ da landing (Server Component).
 *  2. O JSON-LD FAQPage (rich snippet do Google).
 *  3. Os direct-answer blocks de GEO (Perplexity, ChatGPT, Gemini, Copilot).
 *
 * As respostas são escritas em estilo "direct answer": primeira frase já
 * responde objetivamente, com termos de nicho e recorte regional (RJ).
 */
export interface FaqItem {
  question: string
  answer: string
}

export const faq: FaqItem[] = [
  {
    question: 'O que uma TI para engenharia precisa ter?',
    answer:
      'Uma TI para engenharia precisa ter, no mínimo, quatro pilares: (1) servidor e storage de alta performance para abrir e salvar projetos pesados de AutoCAD, Revit e BIM em rede sem travamentos; (2) rede estável e link redundante, inclusive em canteiros de obras; (3) backup automático em nuvem com cópia imutável e offsite contra ransomware; e (4) suporte técnico especializado nos softwares técnicos (Autodesk, BIM, Microsoft 365). A EngTI RJ estrutura esses quatro pilares especificamente para empresas de engenharia, arquitetura e construção civil no Rio de Janeiro.',
  },
  {
    question: 'Por que os projetos de AutoCAD, Revit e BIM travam na rede?',
    answer:
      'Projetos de AutoCAD, Revit e BIM travam na rede porque a maioria das empresas usa compartilhamento simples (SMB) em servidores comuns ou HDs sem otimização para leitura/escrita intensiva de arquivos grandes. O resultado são arquivos de projeto de centenas de MB sendo puxados por vários usuários ao mesmo tempo em disco lento e rede sem QoS. A EngTI RJ dimensiona servidores de arquivos e storage SSD/NAS dedicados e segmenta a rede para entregar leitura e escrita contínuas, eliminando os travamentos no dia a dia de projetos pesados.',
  },
  {
    question: 'Como proteger arquivos de projetos de obra contra ransomware?',
    answer:
      'A proteção contra ransomware para arquivos de projetos de obra exige backup 3-2-1: três cópias, em dois meios diferentes, sendo uma offsite/imutável. A cópia imutável é a que impede que o ransomware criptografe o próprio backup. Além disso é preciso controle de acesso por perfil, MFA e monitoramento de exfiltração. A EngTI RJ implanta backup em nuvem com versionamento e cópia imutável específico para arquivos de projetos de obras e escritórios de engenharia no Rio de Janeiro.',
  },
  {
    question: 'Como ter internet estável em canteiro de obra?',
    answer:
      'Para ter internet estável em canteiro de obra o caminho é combinar um link dedicado (fibra) com um link redundante móvel (4G/5G) e um equipamento de balanceamento de links que faça failover automático, além de uma rede Wi-Fi industrial dimensionada para a área. Assim, quando a fibra cair, a obra continua conectada. A EngTI RJ projeta essa conectividade redundante e a rede dos canteiros de obras e escritórios remotos de engenharia no estado do Rio de Janeiro.',
  },
  {
    question: 'A EngTI RJ atende empresas de arquitetura e construção civil?',
    answer:
      'Sim. A EngTI RJ atende exclusivamente empresas de engenharia, arquitetura e construção civil no estado do Rio de Janeiro — o que significa que a infraestrutura, as soluções e o suporte são desenhados em torno das dores reais desses escritórios: projetos pesados, pranchas, BIM, canteiros de obras e softwares técnicos.',
  },
  {
    question: 'Vocês configuram NAS ou SAN para escritório de engenharia?',
    answer:
      'Sim. A EngTI RJ configura storages NAS e SAN de alta performance para escritórios de engenharia civil e elétrica, dimensionados para leitura/escrita intensiva de projetos 3D, com RAID, compartilhamento otimizado, controle de acesso por projeto e integração com backup em nuvem.',
  },
]
