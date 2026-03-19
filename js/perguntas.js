// perguntas.js
// Agora a resposta correta é definida por TEXTO (campo `correta` contém a string correta).
// As opções são embaralhadas em runtime e o índice da resposta correta é recalculado
// automaticamente (PERGUNTAS resultante mantém {pergunta, opcoes, correta} onde correta é o índice).

const PERGUNTAS_ORIGINAIS = [
  {
    pergunta: "Qual atalho bloqueia imediatamente o computador no Windows?",
    opcoes: ["Ctrl + Esc", "Alt + F4", "Win + L", "Ctrl + Alt + Del", "Shift + F1"],
    correta: "Win + L",
    pontos: 3 // Básico
  },
  {
    pergunta: "Você encontra um pendrive na sala. O que deve fazer antes de conectar no seu PC corporativo?",
    opcoes: ["Conectar para ver o conteúdo rapidamente", "Formatar o pendrive e usar", "Entregar ao time de TI para análise", "Abrir em máquina virtual sem avisar TI", "Colocar na sua pasta pessoal na rede"],
    correta: "Entregar ao time de TI para análise",
    pontos: 5 // Médio
  },
  {
    pergunta: "Ao receber um e-mail urgente pedindo para validar seus dados e com um link estranho, a melhor ação é:",
    opcoes: ["Clicar no link e preencher para resolver rápido", "Encaminhar o e-mail para todos no time", "Responder pedindo mais detalhes", "Não clicar; reportar para TI e verificar com o remetente por outro canal", "Abrir o link em outro navegador sem logar"],
    correta: "Não clicar; reportar para TI e verificar com o remetente por outro canal",
    pontos: 5 // Médio
  },
  {
    pergunta: "Qual é a vantagem principal de usar Autenticação Multifator (MFA)?",
    opcoes: ["Substitui a necessidade de senha por completo", "Permite compartilhar contas com segurança", "Adiciona uma camada extra além da senha, dificultando acesso não autorizado", "Evita atualizações do sistema", "Garante acesso automático em redes públicas"],
    correta: "Adiciona uma camada extra além da senha, dificultando acesso não autorizado",
    pontos: 5 // Médio
  },
  {
    pergunta: "Onde você deve armazenar arquivos de trabalho para garantir backup e conformidade?",
    opcoes: ["Em pastas locais do desktop do seu PC", "Em serviços/pastas corporativas autorizadas (OneDrive, servidor da empresa)", "Em um e-mail pessoal", "No celular pessoal sem sincronizar", "Em um serviço de nuvem gratuito sem autorização da TI"],
    correta: "Em serviços/pastas corporativas autorizadas (OneDrive, servidor da empresa)",
    pontos: 3 // Básico
  },
  {
    pergunta: "Você precisa usar um software não listado pela TI para uma tarefa. O que fazer?",
    opcoes: ["Instalar imediatamente para não perder tempo", "Procurar o mesmo software em qualquer site pirata", "Solicitar aprovação à TI e usar a versão aprovada pela empresa", "Desativar antivírus e instalar", "Instalar numa máquina de um colega"],
    correta: "Solicitar aprovação à TI e usar a versão aprovada pela empresa",
    pontos: 5 // Médio
  },
  {
    pergunta: "Qual prática ajuda mais a reduzir risco devido a vulnerabilidades de software?",
    opcoes: ["Postergar atualizações por comodidade", "Instalar apenas atualizações visuais", "Manter sistema e aplicativos atualizados e reiniciar quando solicitado", "Desativar módulo de segurança do sistema", "Usar contas sem senha"],
    correta: "Manter sistema e aplicativos atualizados e reiniciar quando solicitado",
    pontos: 3 // Básico
  },
  {
    pergunta: "Cenário: Um colega pede seu login para terminar uma tarefa urgente porque \"só falta você\". O procedimento correto é:",
    opcoes: ["Informar a senha e permitir o acesso para agilizar", "Negar e pedir que o colega abra chamado para TI ou faça com a própria conta", "Trocar a senha depois que ele terminar", "Criar uma conta compartilhada para todos usarem", "Enviar sua sessão via TeamViewer sem supervisão"],
    correta: "Negar e pedir que o colega abra chamado para TI ou faça com a própria conta",
    pontos: 5 // Médio
  },
  {
    pergunta: "Antes de coletar ou armazenar dados pessoais de clientes em uma planilha, você deve:",
    opcoes: ["Coletar livremente e depois buscar autorização", "Verificar a necessidade, obter consentimento quando aplicável e seguir a política da empresa", "Compartilhar com qualquer colega que peça", "Publicar em drive público para facilitar acesso", "Armazenar apenas no seu e-mail pessoal"],
    correta: "Verificar a necessidade, obter consentimento quando aplicável e seguir a política da empresa",
    pontos: 10 // Difícil
  },
  {
    pergunta: "Segurança avançada: um colega sugere desativar o antivírus para instalar um programa. A ação correta é:",
    opcoes: ["Desativar o antivírus temporariamente e instalar", "Instalar com conta de administrador sem avisar", "Baixar o instalador de qualquer site que aparecer", "Recusar e encaminhar à TI para validar o software em ambiente seguro", "Instalar em máquina principal da empresa"],
    correta: "Recusar e encaminhar à TI para validar o software em ambiente seguro",
    pontos: 5 // Médio
  },
  {
    pergunta: "Ao notar um comportamento estranho no PC (janelas abrindo sozinhas ou lentidão extrema), o usuário deve:",
    opcoes: ["Tentar consertar sozinho deletando arquivos", "Desconectar da rede e avisar imediatamente o suporte de TI", "Esperar o dia terminar para ver se melhora", "Pedir ajuda para um colega que entende de PC", "Reiniciar 10 vezes seguidas"],
    correta: "Desconectar da rede e avisar imediatamente o suporte de TI",
    pontos: 3 // Básico
  },
  {
    pergunta: "Qual a importância de reiniciar o computador pelo menos uma vez por semana?",
    opcoes: ["Serve apenas para gastar mais energia", "Limpa a memória, aplica atualizações críticas e corrige falhas temporárias", "Aumenta a velocidade da internet", "Muda o papel de parede automaticamente", "Não tem importância nenhuma"],
    correta: "Limpa a memória, aplica atualizações críticas e corrige falhas temporárias",
    pontos: 3 // Básico
  },
  {
    pergunta: "Por que é proibido carregar o celular pessoal na porta USB do computador da empresa?",
    opcoes: ["Para economizar a bateria do PC", "Para evitar transferência acidental de vírus ou roubo de dados via cabo", "Porque o celular carrega muito devagar", "Porque a TI quer controlar o uso de bateria", "Não existe proibição real, é apenas um mito"],
    correta: "Para evitar transferência acidental de vírus ou roubo de dados via cabo",
    pontos: 3 // Básico
  },
  {
    pergunta: "O que caracteriza um ataque de Engenharia Social via telefone (Vishing)?",
    opcoes: ["Um erro no sinal da operadora", "O uso de persuasão e manipulação por voz para obter dados confidenciais", "Uma mensagem automática de parabéns", "O bloqueio do chip do celular", "Uma atualização de software do aparelho"],
    correta: "O uso de persuasão e manipulação por voz para obter dados confidenciais",
    pontos: 10 // Difícil
  },
  {
    pergunta: "Como identificar visualmente que a conexão com um site é criptografada e mais segura?",
    opcoes: ["Pela cor de fundo da página", "Pela presença do protocolo HTTPS e do ícone de cadeado no navegador", "Se o site carregar muito rápido", "Se não houver anúncios na página", "Pelo tamanho das letras no texto"],
    correta: "Pela presença do protocolo HTTPS e do ícone de cadeado no navegador",
    pontos: 3 // Básico
  },
  {
    pergunta: "Para que serve a VPN (Virtual Private Network) corporativa?",
    opcoes: ["Para acessar redes sociais bloqueadas", "Para criar um túnel seguro de conexão entre o seu PC e a rede interna da empresa", "Para aumentar a velocidade do Wi-Fi de casa", "Para monitorar a câmera do usuário", "Para traduzir sites estrangeiros"],
    correta: "Para criar um túnel seguro de conexão entre o seu PC e a rede interna da empresa",
    pontos: 3 // Básico
  },
  {
    pergunta: "Quem deve ser o primeiro a saber em caso de perda ou roubo de um notebook corporativo?",
    opcoes: ["A polícia local apenas", "O seu gestor e o departamento de TI imediatamente", "Os colegas de equipe para eles avisarem", "Ninguém, deve-se tentar rastrear sozinho", "O RH da empresa no dia seguinte"],
    correta: "O seu gestor e o departamento de TI imediatamente",
    pontos: 3 // Básico
  },
  {
    pergunta: "Como agir em caso de suspeita de Ransomware (sequestro de dados) no seu setor?",
    opcoes: ["Pagar o resgate rapidamente com dinheiro próprio", "Desconectar o cabo de rede/desligar o Wi-Fi e avisar o Plantão de TI", "Deletar os arquivos criptografados", "Formatar o computador por conta própria", "Ignorar as mensagens na tela"],
    correta: "Desconectar o cabo de rede/desligar o Wi-Fi e avisar o Plantão de TI",
    pontos: 10 // Difícil
  },
  {
    pergunta: "O que significa GxP no contexto da indústria farmacêutica e TI?",
    opcoes: ["Um modelo de computador potente", "Um conjunto de Boas Práticas (Fabricação, Laboratório, etc.) que devem ser seguidas e validadas em sistemas", "Uma linguagem de programação de relatórios", "Um protocolo de e-mail seguro", "A marca de um sistema de gestão"],
    correta: "Um conjunto de Boas Práticas (Fabricação, Laboratório, etc.) que devem ser seguidas e validadas em sistemas",
    pontos: 10 // Difícil
  },
  {
    pergunta: "Qual a forma mais segura de compartilhar uma senha temporária com um colega autorizado?",
    opcoes: ["Gritar pela sala", "Anotar em um papel e deixar na mesa dele", "Utilizar um gerenciador de senhas corporativo ou canal oficial seguro", "Mandar por SMS pessoal", "Postar no grupo de avisos geral"],
    correta: "Utilizar um gerenciador de senhas corporativo ou canal oficial seguro",
    pontos: 3 // Básico
  }
];

/* ---------- Funções utilitárias ---------- */

// cópia profunda simples (objetos pequenos)
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Fisher-Yates shuffle (in-place)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// normaliza texto para comparação (remove espaços extras, minúsculas)
function normalizeText(s) {
  if (typeof s !== 'string') return String(s);
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
}

/* ---------- Gera PERGUNTAS embaralhadas mantendo correta por texto ---------- */

const PERGUNTAS = PERGUNTAS_ORIGINAIS.map(orig => {
  const q = clone(orig);
  // embaralhar as opções e recomputar o índice da correta baseado no texto
  const optionsWithIndex = q.opcoes.map((opt, idx) => ({ text: opt, originalIndex: idx }));
  shuffleArray(optionsWithIndex);
  const shuffledOptions = optionsWithIndex.map(o => o.text);

  // encontra a posição da opção cujo texto corresponde ao texto 'correta' original
  const targetNormalized = normalizeText(q.correta);
  const corretaIndex = optionsWithIndex.findIndex(o => normalizeText(o.text) === targetNormalized);

  // fallback seguro: se não encontrar (por algum motivo), tenta encontrar pelo índice original,
  // ou marca 0
  let finalIndex = corretaIndex;
  if (finalIndex === -1) {
    // tenta comparar pela originalIndex com base na string original (caso 'correta' seja texto, não índice)
    // aqui só garantimos que sempre teremos um índice válido
    const fallback = optionsWithIndex.findIndex(o => normalizeText(o.text) === normalizeText(q.opcoes[q.opcoes.indexOf(q.correta)]));
    finalIndex = (fallback !== -1) ? fallback : 0;
  }

  return {
    pergunta: q.pergunta,
    opcoes: shuffledOptions,
    correta: finalIndex,
    pontos: q.pontos
  };
});

// export (se ambiente suporta módulos o código pode ser adaptado; aqui usamos variável global PERGUNTAS)
