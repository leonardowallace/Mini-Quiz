// game.js — substitua todo o arquivo atual por este

const POINTS_PER_CORRECT = 50; // 50 pontos por acerto (ajuste aqui se quiser)

let nickname = null;
let correctCount = 0;
let incorrectCount = 0;
let perguntaIndex = 0;

function askNickname() {
  // pede nickname uma única vez (pode substituir por um form depois)
  if (!nickname) {
    const n = prompt("Digite seu nome (apenas um apelido) para o ranking:");
    nickname = (n && n.trim()) ? n.trim().substring(0, 30) : "Anônimo";
  }
  return nickname;
}

class TelaMenu extends Phaser.Scene {
  constructor() { super("menu"); }
  create() {
    this.add.text(400, 120, "Mini-Game de\nBoas Práticas de TI", { fontSize: "36px", color: "#000", align: "center" }).setOrigin(0.5);

    // Mostrar nickname atual
    this.add.text(400, 200, `Jogador: ${nickname || "—"}`, { fontSize: "18px" }).setOrigin(0.5);

    const btnStart = this.add.text(400, 320, "Iniciar Jogo", {
      fontSize: "28px", backgroundColor: "#4CAF50", color: "#fff", padding: 18
    }).setOrigin(0.5).setInteractive();

    btnStart.on("pointerdown", () => {
      askNickname();
      correctCount = 0;
      incorrectCount = 0;
      perguntaIndex = 0;
      this.scene.start("quiz");
    });
  }
}

class TelaQuiz extends Phaser.Scene {
  constructor() { super("quiz"); }
  create() {
    this.mostrarPergunta();
  }

  mostrarPergunta() {
    this.children.removeAll();

    if (perguntaIndex >= PERGUNTAS.length) {
      this.scene.start("resultado");
      return;
    }

    const p = PERGUNTAS[perguntaIndex];

    this.add.text(400, 70, `Pergunta ${perguntaIndex + 1} de ${PERGUNTAS.length}`, { fontSize: "18px" }).setOrigin(0.5);
    this.add.text(400, 130, p.pergunta, { fontSize: "26px", color:"#000", wordWrap: { width: 760 } }).setOrigin(0.5);

    p.opcoes.forEach((op, i) => {
      const btn = this.add.text(400, 220 + (i * 70), op, {
        fontSize: "22px", backgroundColor: "#2196F3", color: "#fff", padding: 12
      }).setOrigin(0.5).setInteractive();

      btn.on("pointerdown", () => this.verificarResposta(i));
    });
  }

  verificarResposta(opcaoEscolhida) {
    const p = PERGUNTAS[perguntaIndex];

    if (opcaoEscolhida === p.correta) {
      correctCount++;
      // feedback rápido
      const t = this.add.text(400, 520, "Correto! 👍", { fontSize: "20px", color: "#2e7d32" }).setOrigin(0.5);
    } else {
      incorrectCount++;
      const t = this.add.text(400, 520, `Errado. Resposta correta: ${p.opcoes[p.correta]}`, { fontSize: "18px", color: "#c62828" }).setOrigin(0.5);
    }

    perguntaIndex++;
    // pequena pausa antes da próxima
    this.time.delayedCall(900, () => this.mostrarPergunta(), [], this);
  }
}

class TelaResultado extends Phaser.Scene {
  constructor() { super("resultado"); }
  create() {
    this.children.removeAll();

    const total = PERGUNTAS.length;
    const score = correctCount * POINTS_PER_CORRECT;

    this.add.text(400, 60, "Resultado Final", { fontSize: "36px" }).setOrigin(0.5);
    this.add.text(400, 140, `Acertos: ${correctCount}`, { fontSize: "22px" }).setOrigin(0.5);
    this.add.text(400, 180, `Erros: ${incorrectCount}`, { fontSize: "22px" }).setOrigin(0.5);
    this.add.text(400, 230, `Pontuação: ${score}  ( ${correctCount} × ${POINTS_PER_CORRECT} )`, { fontSize: "20px", color:"#2e7d32" }).setOrigin(0.5);

    const btnPlay = this.add.text(260, 340, "Jogar Novamente", { fontSize:"18px", backgroundColor:"#1976D2", color:"#fff", padding:12 }).setInteractive();
    btnPlay.on("pointerdown", () => this.scene.start("menu"));

    const btnShow = this.add.text(520, 340, "Ver Leaderboard", { fontSize:"18px", backgroundColor:"#ff9800", color:"#fff", padding:12 }).setInteractive();
    btnShow.on("pointerdown", () => {
      // força carregar e mostrar painel
      document.getElementById('leaderboard').style.display = 'block';
      this.carregarLeaderboard();
    });

    // salvar score no Firestore (cumprir regras: score == correct * 50 e timestamp)
    this.salvarScoreFirestore({ nickname, score, correct: correctCount, incorrect: incorrectCount });
  }

  async salvarScoreFirestore(payload) {
    try {
      // adiciona timestamp server-side
      payload.timestamp = firebase.firestore.FieldValue.serverTimestamp();

      // grava na collection 'scores'
      await window.FSDB.collection('scores').add(payload);

      console.log("Score salvo:", payload);
      this.carregarLeaderboard();
    } catch (err) {
      console.error("Erro ao salvar score:", err);
      // se permissão negada, logamos para diagnóstico
      const list = document.getElementById('lbList');
      list.innerHTML = `<li style="color:red">Erro ao salvar score: ${err.message}</li>`;
      document.getElementById('leaderboard').style.display = 'block';
    }
  }

  async carregarLeaderboard() {
    try {
      const q = await window.FSDB.collection('scores').orderBy('score', 'desc').limit(10).get();
      const list = document.getElementById('lbList');
      list.innerHTML = "";
      q.forEach(doc => {
        const d = doc.data();
        const time = d.timestamp && d.timestamp.toDate ? d.timestamp.toDate().toLocaleString() : '';
        const li = document.createElement('li');
        li.textContent = `${d.nickname} — ${d.score} pts${time ? ' — ' + time : ''}`;
        list.appendChild(li);
      });
      document.getElementById('leaderboard').style.display = 'block';
    } catch (err) {
      console.error("Erro leaderboard:", err);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 620,
  backgroundColor: "#ffffff",
  scene: [TelaMenu, TelaQuiz, TelaResultado]
};

new Phaser.Game(config);
