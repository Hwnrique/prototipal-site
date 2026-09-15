// Edite estes dados para substituir o catálogo demonstrativo pelo catálogo real.
// As imagens são ilustrativas. Não representam especificações ou certificações.
export const categories = [
  "Todos os produtos",
  "Infusão e conexões",
  "Nutrição enteral",
  "Acesso vascular",
  "Cirurgia e drenagem",
  "Urologia",
  "Oncologia",
  "Hemodinâmica",
];
export const products = [
  {
    id: 1,
    name: "Equipo de infusão",
    category: "Infusão e conexões",
    description:
      "Conheça as opções de equipos para compor a rotina de atendimento da sua instituição.",
    kind: "infusion",
    tag: "Linha hospitalar",
  },
  {
    id: 2,
    name: "Conector valvulado",
    category: "Infusão e conexões",
    description:
      "Uma linha de conexões para complementar os sistemas utilizados pela sua equipe.",
    kind: "connector",
    tag: "Conexões",
  },
  {
    id: 3,
    name: "Equipo de nutrição enteral",
    category: "Nutrição enteral",
    description:
      "Explore a linha de dispositivos para os processos de nutrição enteral.",
    kind: "enteral",
    tag: "Nutrição",
  },
  {
    id: 4,
    name: "Cateter intravenoso",
    category: "Acesso vascular",
    description:
      "Consulte a equipe sobre os modelos e as apresentações disponíveis para acesso vascular.",
    kind: "catheter",
    tag: "Acesso vascular",
  },
  {
    id: 5,
    name: "Dreno cirúrgico",
    category: "Cirurgia e drenagem",
    description:
      "Conheça as opções da linha de drenagem e solicite informações à equipe.",
    kind: "infusion",
    tag: "Cirurgia",
  },
  {
    id: 6,
    name: "Sonda urológica",
    category: "Urologia",
    description:
      "Consulte as apresentações da linha de urologia para sua instituição.",
    kind: "enteral",
    tag: "Urologia",
  },
  {
    id: 7,
    name: "Sistema fechado de infusão",
    category: "Oncologia",
    description:
      "Saiba mais sobre a proposta de sistemas de infusão do nosso catálogo demonstrativo.",
    kind: "infusion",
    tag: "Oncologia",
  },
  {
    id: 8,
    name: "Torneira de três vias",
    category: "Hemodinâmica",
    description:
      "Explore os acessórios de conexão para complementar sua linha hospitalar.",
    kind: "connector",
    tag: "Hemodinâmica",
  },
];
export type Product = (typeof products)[number];
export const articles = [
  {
    title: "O cuidado começa na escolha de cada detalhe.",
    category: "Cuidado e qualidade",
    image: "photo-1576091160399-112ba8d25d1d",
    text: "Cada instituição tem uma rotina própria. Ouvir as equipes e compreender suas necessidades é o primeiro passo para construir um relacionamento de confiança. Este espaço editorial poderá receber os conteúdos oficiais da Shalom Med.",
  },
  {
    title: "Mais proximidade com quem está na linha de frente.",
    category: "Conexões que importam",
    image: "photo-1559839734-2b71ea197ec2",
    text: "Uma boa parceria começa com uma conversa. Nosso propósito é aproximar pessoas e facilitar o acesso às informações sobre o portfólio. Aqui você poderá publicar novidades, entrevistas e histórias da sua equipe.",
  },
  {
    title: "Uma nova perspectiva para a rotina hospitalar.",
    category: "Universo hospitalar",
    image: "photo-1516549655169-df83a0774514",
    text: "Organização, comunicação e atenção aos detalhes fazem parte do cotidiano de uma instituição de saúde. Use esta área para compartilhar notícias da empresa e conteúdos revisados pelos profissionais responsáveis.",
  },
];
