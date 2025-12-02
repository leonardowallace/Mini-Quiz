// game.js — versão final
// Requisitos: Firebase compat + window.FSDB + perguntas.js

const POINTS_PER_CORRECT = 10; // pontos por acerto
const NICK_MAX_LENGTH = 16;    // limite do nome no ranking

let nickname = null;
let correctCount = 0;
let incorrectCount = 0;
let perguntaIndex = 0;

/* ---------------------------------------------------------
   Sanitização e limite do apelido
--------------------------------------------------------- */
function sanitizeAndLimitName(n) {
  if (!n) return "Anônimo";
  const cleaned = n.trim().replace(/[^\p{L}\p{N}\s_-]/gu, ""); // remove símbolos estranhos
  const collapsed = cleaned.replace(/\s+/g, " ");             // remove múltiplos espaços
  return collapsed.substring(0, NICK_MAX_LENGTH);
}

/* ---------------------------------------------------------
   Apelido obrigatório (loop até digitar)
--------------------------------------------------------- */
function askNicknameBlocking() {
  while (true) {
    const n = prompt(`Digite seu nome (máx ${NICK_MAX_LENGTH} chars):`);
    if (n && n.trim()) {
      nickname = sanitizeAndLimitName(n);
      break;
    }
    alert("Apelido obrigatório para jogar.");
  }
  return nickname;
}

/* ---------------------------------------------------------
   Estilo + animação suave dos botões Phaser
--------------------------------------------------------- */
function stylePhaserButton(btn) {
  btn.setInteractive({ useHandCursor: true });
  const baseScaleX = btn.scaleX || 1;
  const baseScaleY = btn.scaleY || 1;

  btn.on("pointerover", () => {
    try { btn.setStyle({ backgroundColor: "#7ABF49" }); } catch (e) {}
    btn.scene.tweens.killTweensOf(btn);
    btn.scene.tweens.add({
      targets: btn,
      scaleX: baseScaleX * 1.08,
      scaleY: baseScaleY * 1.08,
      ease: "Sine.easeOut",
      duration: 220
    });
  });

  btn.on("pointerout", () => {
    try { btn.setStyle({ backgroundColor: "#324031" }); } catch (e) {}
    btn.scene.tweens.killTweensOf(btn);
    btn.scene.tweens.add({
      targets: btn,
      scaleX: baseScaleX,
      scaleY: baseScaleY,
      ease: "Sine.easeOut",
      duration: 220
    });
  });

  btn.on("pointerdown", () => {
    btn.scene.tweens.killTweensOf(btn);
    btn.scene.tweens.add({
      targets: btn,
      scaleX: baseScaleX * 0.98,
      scaleY: baseScaleY * 0.98,
      ease: "Quad.easeInOut",
      duration: 120,
      yoyo: true
    });
  });
}

/* ---------------------------------------------------------
   Tela de Menu
--------------------------------------------------------- */
class TelaMenu extends Phaser.Scene {
  constructor() { super("menu"); }

  create() {
    this.add.text(410, 90, "Mini-Game de\nBoas Práticas de TI", {
      fontSize: "34px",
      color: "#0D0D0D",
      align: "center"
    }).setOrigin(0.5);

    this.add.text(410, 170, `Jogador: ${nickname ? nickname : "— (clique iniciar)"}`, {
      fontSize: "16px",
      color: "#324031"
    }).setOrigin(0.5);

    const btnStart = this.add.text(410, 300, "Iniciar Jogo", {
      fontSize: "24px",
      backgroundColor: "#324031",
      color: "#ffffff",
      padding: 14
    }).setOrigin(0.5);
    stylePhaserButton(btnStart);

    btnStart.on("pointerdown", () => {
      if (!nickname) askNicknameBlocking();
      correctCount = 0;
      incorrectCount = 0;
      perguntaIndex = 0;
      this.scene.start("quiz");
    });

    const btnEdit = this.add.text(410, 360, "Editar apelido", {
      fontSize: "16px",
      backgroundColor: "#7ABF49",
      color: "#0D0D0D",
      padding: 10
    }).setOrigin(0.5);
    stylePhaserButton(btnEdit);

    btnEdit.on("pointerdown", () => {
      const n = prompt(`Digite seu apelido (máx ${NICK_MAX_LENGTH} chars):`, nickname || "");
      if (n && n.trim()) nickname = sanitizeAndLimitName(n);
      this.scene.restart();
    });
  }
}

/* ---------------------------------------------------------
   Tela de Quiz
--------------------------------------------------------- */
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

    this.add.text(410, 60, `Pergunta ${perguntaIndex + 1} de ${PERGUNTAS.length}`, {
      fontSize: "16px",
      color: "#324031"
    }).setOrigin(0.5);

    this.add.text(410, 120, p.pergunta, {
      fontSize: "24px",
      color: "#0D0D0D",
      wordWrap: { width: 740, useAdvancedWrap: true }
    }).setOrigin(0.5);

    p.opcoes.forEach((op, i) => {
      const y = 220 + i * 68;
      const btn = this.add.text(410, y, op, {
        fontSize: "20px",
        backgroundColor: "#3A403B",
        color: "#ffffff",
        padding: 12
      }).setOrigin(0.5);

      stylePhaserButton(btn);
      btn.on("pointerdown", () => this.verificarResposta(i));
    });
  }

  verificarResposta(i) {
    const p = PERGUNTAS[perguntaIndex];

    if (i === p.correta) {
      correctCount++;
      this.add.text(410, 520, "Correto! 👍", {
        fontSize: "18px",
        color: "#7ABF49"
      }).setOrigin(0.5);
    } else {
      incorrectCount++;
      this.add.text(410, 520, `Errado. Correto: ${p.opcoes[p.correta]}`, {
        fontSize: "16px",
        color: "#d32f2f"
      }).setOrigin(0.5);
    }

    perguntaIndex++;
    this.time.delayedCall(900, () => this.mostrarPergunta());
  }
}

/* ---------------------------------------------------------
   Tela de Resultado
--------------------------------------------------------- */
class TelaResultado extends Phaser.Scene {
  constructor() { super("resultado"); }

  create() {
    this.children.removeAll();

    const score = correctCount * POINTS_PER_CORRECT;

    this.add.text(410, 48, "Resultado Final", {
      fontSize: "32px",
      color: "#0D0D0D"
    }).setOrigin(0.5);

    this.add.text(410, 120, `Acertos: ${correctCount}`, {
      fontSize: "20px",
      color: "#324031"
    }).setOrigin(0.5);

    this.add.text(410, 156, `Erros: ${incorrectCount}`, {
      fontSize: "20px",
      color: "#324031"
    }).setOrigin(0.5);

    this.add.text(410, 210, `Pontuação: ${score}`, {
      fontSize: "18px",
      color: "#7ABF49"
    }).setOrigin(0.5);

    const btnPlay = this.add.text(290, 320, "Jogar Novamente", {
      fontSize: "16px",
      backgroundColor: "#3A403B",
      color: "#ffffff",
      padding: 12
    }).setOrigin(0.5);
    stylePhaserButton(btnPlay);
    btnPlay.on("pointerdown", () => this.scene.start("menu"));

    const btnShow = this.add.text(530, 320, "Ver Leaderboard", {
      fontSize: "16px",
      backgroundColor: "#7ABF49",
      color: "#0D0D0D",
      padding: 12
    }).setOrigin(0.5);
    stylePhaserButton(btnShow);
    btnShow.on("pointerdown", () => {
      document.getElementById("leaderboard").style.display = "block";
      this.carregarLeaderboard();
    });

    this.salvarScoreFirestore({ nickname, score, correct: correctCount, incorrect: incorrectCount });
  }

  async salvarScoreFirestore(payload) {
    try {
      payload.nickname = sanitizeAndLimitName(payload.nickname);
      payload.timestamp = firebase.firestore.FieldValue.serverTimestamp();

      await window.FSDB.collection("scores").add(payload);

      console.log("Score salvo:", payload);
      this.carregarLeaderboard();
    } catch (err) {
      console.error("Erro ao salvar score:", err);
      const list = document.getElementById("lbList");
      if (list) {
        list.innerHTML = `<li style="color:red">Erro ao salvar score: ${err.message}</li>`;
        document.getElementById("leaderboard").style.display = "block";
      }
    }
  }

  async carregarLeaderboard() {
    try {
      const q = await window.FSDB.collection("scores")
        .orderBy("score", "desc")
        .limit(10)
        .get();

      const list = document.getElementById("lbList");
      if (!list) return;

      list.innerHTML = "";

      q.forEach(doc => {
        const d = doc.data();
        const name = sanitizeAndLimitName(d.nickname || "—");
        const score = d.score || 0;

        const li = document.createElement("li");
        li.textContent = name;

        const span = document.createElement("span");
        span.textContent = `${score} pts`;

        li.appendChild(span);
        list.appendChild(li);
      });

      document.getElementById("leaderboard").style.display = "block";
    } catch (err) {
      console.error("Erro leaderboard:", err);
    }
  }
}

/* ---------------------------------------------------------
   Configuração Phaser
--------------------------------------------------------- */
const config = {
  type: Phaser.AUTO,
  width: 820,
  height: 560,
  backgroundColor: "#ffffff",
  scene: [TelaMenu, TelaQuiz, TelaResultado]
};

/* ---------------------------------------------------------
   Inicia Phaser após fonte carregar
--------------------------------------------------------- */
function startPhaserWhenFontsLoaded(cfg) {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setTimeout(() => new Phaser.Game(cfg), 80);
    }).catch(() => {
      setTimeout(() => new Phaser.Game(cfg), 80);
    });
  } else {
    setTimeout(() => new Phaser.Game(cfg), 80);
  }
}

startPhaserWhenFontsLoaded(config);
