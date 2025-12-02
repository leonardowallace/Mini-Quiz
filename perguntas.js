// perguntas.js — 10 perguntas, 5 opções cada, respostas embaralhadas

const PERGUNTAS = [
  {
    pergunta: "Qual atalho bloqueia imediatamente o computador no Windows?",
    opcoes: ["Ctrl + Esc", "Alt + F4", "Win + L", "Ctrl + Alt + Del", "Shift + F1"],
    correta: 2
  },
  {
    pergunta: "Você encontra um pendrive na sala. O que deve fazer antes de conectar no seu PC corporativo?",
    opcoes: [
      "Conectar para ver o conteúdo rapidamente",
      "Formatar o pendrive e usar",
      "Entregar ao time de TI para análise",
      "Abrir em máquina virtual sem avisar TI",
      "Colocar na sua pasta pessoal na rede"
    ],
    correta: 2
  },
  {
    pergunta: "Ao receber um e-mail urgente pedindo para validar seus dados e com um link estranho, a melhor ação é:",
    opcoes: [
      "Clicar no link e preencher para resolver rápido",
      "Encaminhar o e-mail para todos no time",
      "Responder pedindo mais detalhes",
      "Não clicar; reportar para TI e verificar com o remetente por outro canal",
      "Abrir o link em outro navegador sem logar"
    ],
    correta: 3
  },
  {
    pergunta: "Qual é a vantagem principal de usar Autenticação Multifator (MFA)?",
    opcoes: [
      "Substitui a necessidade de senha por completo",
      "Permite compartilhar contas com segurança",
      "Adiciona uma camada extra além da senha, dificultando acesso não autorizado",
      "Evita atualizações do sistema",
      "Garante acesso automático em redes públicas"
    ],
    correta: 2
  },
  {
    pergunta: "Onde você deve armazenar arquivos de trabalho para garantir backup e conformidade?",
    opcoes: [
      "Em pastas locais do desktop do seu PC",
      "Em serviços/pastas corporativas autorizadas (OneDrive, servidor da empresa)",
      "Em um e-mail pessoal",
      "No celular pessoal sem sincronizar",
      "Em um serviço de nuvem gratuito sem autorização da TI"
    ],
    correta: 1
  },
  {
    pergunta: "Você precisa usar um software não listado pela TI para uma tarefa. O que fazer?",
    opcoes: [
      "Instalar imediatamente para não perder tempo",
      "Procurar o mesmo software em qualquer site pirata",
      "Solicitar aprovação à TI e usar a versão aprovada pela empresa",
      "Desativar antivírus e instalar",
      "Instalar numa máquina de um colega"
    ],
    correta: 2
  },
  {
    pergunta: "Qual prática ajuda mais a reduzir risco devido a vulnerabilidades de software?",
    opcoes: [
      "Postergar atualizações por comodidade",
      "Instalar apenas atualizações visuais",
      "Manter sistema e aplicativos atualizados e reiniciar quando solicitado",
      "Desativar módulo de segurança do sistema",
      "Usar contas sem senha"
    ],
    correta: 2
  },
  {
    pergunta: "Cenário: Um colega pede seu login para terminar uma tarefa urgente porque \"só falta você\". O procedimento correto é:",
    opcoes: [
      "Informar a senha e permitir o acesso para agilizar",
      "Negar e pedir que o colega abra chamado para TI ou faça com a própria conta",
      "Trocar a senha depois que ele terminar",
      "Criar uma conta compartilhada para todos usarem",
      "Enviar sua sessão via TeamViewer sem supervisão"
    ],
    correta: 1
  },
  {
    pergunta: "Antes de coletar ou armazenar dados pessoais de clientes em uma planilha, você deve:",
    opcoes: [
      "Coletar livremente e depois buscar autorização",
      "Verificar a necessidade, obter consentimento quando aplicável e seguir a política da empresa",
      "Compartilhar com qualquer colega que peça",
      "Publicar em drive público para facilitar acesso",
      "Armazenar apenas no seu e-mail pessoal"
    ],
    correta: 1
  },
  {
    pergunta: "Segurança avançada: um colega sugere desativar o antivírus para instalar um programa. A ação correta é:",
    opcoes: [
      "Desativar o antivírus temporariamente e instalar",
      "Instalar com conta de administrador sem avisar",
      "Baixar o instalador de qualquer site que aparecer",
      "Recusar e encaminhar à TI para validar o software em ambiente seguro",
      "Instalar em máquina principal da empresa"
    ],
    correta: 3
  }
];
