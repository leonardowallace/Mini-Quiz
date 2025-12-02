// game.js — versão final funcional (usa DOM para perguntas/opções)
// Mantém nickname obrigatório, pontuação, Firestore, leaderboard.

const POINTS_PER_CORRECT = 10;
const NICK_MAX_LENGTH = 16;

let nickname = null;
let correctCount = 0;
let incorrectCount = 0;
let perguntaIndex = 0;
let game = null;

/* ---------- Nome utils ---------- */
function sanitizeAndLimitName(n) {
  if (!n) return "Anônimo";
  const cleaned = n.trim().replace(/[^\p{L}\p{N}\s_-]/gu, "");
  const collapsed = cleaned.replace(/\s+/g, " ");
  return collapsed.substring(0, NICK_MAX_LENGTH);
}

function askNicknameBlocking() {
  while (true) {
    const n = prompt(`Digite seu nome (máx ${NICK_MAX_LENGTH} chars):`);
    if (n && n.trim()) {
      nickname = sanitizeAndLimitName(n);
      updatePlayerNameUI();
      break;
    }
    alert("Apelido obrigatório para jogar.");
  }
  return nickname;
}

/* ---------- UI DOM helpers ---------- */
function updatePlayerNameUI() {
  const el = document.getElementById('playerName');
  if (el) el.textContent = `Jogador: ${nickname || '—'}`;
}

function setProgressUI(current, total) {
  const el = document.getElementById('progress');
  if (el) el.textContent = `Pergunta ${current} / ${total}`;
}

function showQuestionUI(qObj, idx, total) {
  const qText = document.getElementById('questionText');
  const opts = document.getElementById('options');
  if (!qText || !opts) return;

  qText.textContent = qObj.pergunta;
  setProgressUI(idx + 1, total);

  opts.innerHTML = '';
  qObj.opcoes.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'option-btn';
    b.textContent = opt;
    b.dataset.index = i;
    b.addEventListener('click', () => handleOptionClick(b, i));
    opts.appendChild(b);
  });
}

function handleOptionClick(buttonEl, chosenIndex) {
  const optButtons = Array.from(document.querySelectorAll('.option-btn'));
  optButtons.forEach(b => b.disabled = true);

  const p = PERGUNTAS[perguntaIndex];
  const correctIdx = p.correta;

  optButtons.forEach(btn => {
    const idx = parseInt(btn.dataset.index, 10);
    if (idx === correctIdx) btn.classList.add('correct');
    if (idx === chosenIndex && idx !== correctIdx) btn.classList.add('wrong');
  });

  if (chosenIndex === correctIdx) correctCount++;
  else incorrectCount++;

  setTimeout(() => {
    perguntaIndex++;
    if (perguntaIndex >= PERGUNTAS.length) {
      if (game && game.scene) game.scene.start('resultado');
    } else {
      showQuestionUI(PERGUNTAS[perguntaIndex], perguntaIndex, PERGUNTAS.length);
    }
  }, 800);
}

/* ---------- Leaderboard UI ---------- */
async function carregarLeaderboardUI() {
  try {
    const q = await window.FSDB.collection('scores').orderBy('score', 'desc').limit(10).get();
    const list = document.getElementById('lbList');
    if (!list) return;
    list.innerHTML = '';
    q.forEach(doc => {
      const d = doc.data();
      const li = document.createElement('li');
      li.textContent = sanitizeAndLimitName(d.nickname || '—');
      const span = document.createElement('span');
      span.textContent = `${d.score} pts`;
      li.appendChild(span);
      list.appendChild(li);
    });
    document.getElementById('leaderboard').style.display = 'block';
  } catch (err) {
    console.error('Erro leaderboard:', err);
  }
}

/* ---------- Phaser Scenes (fluxo) ---------- */
class TelaMenu extends Phaser.Scene {
  constructor() { super('menu'); }
  create() {
    updatePlayerNameUI();
    // bind Enter para iniciar também
    this.input.keyboard.once('keydown-ENTER', () => {
      document.getElementById('btnStart').click();
    });
  }
}

class TelaQuiz extends Phaser.Scene {
  constructor() { super('quiz'); }
  create() {
    const rb = document.getElementById('resultBar');
    if (rb) rb.style.display = 'none';
    perguntaIndex = 0;
    setTimeout(() => showQuestionUI(PERGUNTAS[perguntaIndex], perguntaIndex, PERGUNTAS.length), 60);
  }
}

class TelaResultado extends Phaser.Scene {
  constructor() { super('resultado'); }
  create() {
    const summary = document.getElementById('resultSummary');
    const bar = document.getElementById('resultBar');
    if (summary && bar) {
      const score = correctCount * POINTS_PER_CORRECT;
      summary.textContent = `Acertos: ${correctCount} • Erros: ${incorrectCount} • Pontuação: ${score}`;
      bar.style.display = 'block';
    }

    // salva no Firestore
    const payload = {
      nickname: sanitizeAndLimitName(nickname),
      score: correctCount * POINTS_PER_CORRECT,
      correct: correctCount,
      incorrect: incorrectCount,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    window.FSDB.collection('scores').add(payload)
      .then(() => carregarLeaderboardUI())
      .catch(err => {
        console.error('Erro ao salvar score', err);
        const list = document.getElementById('lbList');
        if (list) list.innerHTML = `<li style="color:red">Erro ao salvar score: ${err.message}</li>`;
        document.getElementById('leaderboard').style.display = 'block';
      });

    // bind botões
    const replay = document.getElementById('btnReplay');
    const showBoard = document.getElementById('btnShowBoard');
    if (replay) replay.onclick = () => { document.getElementById('resultBar').style.display = 'none'; this.scene.start('menu'); };
    if (showBoard) showBoard.onclick = () => carregarLeaderboardUI();
  }
}

/* ---------- Phaser config & start after fonts load ---------- */
const config = {
  type: Phaser.AUTO,
  width: 820,
  height: 560,
  backgroundColor: '#ffffff',
  parent: 'gameHolder',
  scene: [TelaMenu, TelaQuiz, TelaResultado]
};

function startPhaserWhenFontsLoaded() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { game = new Phaser.Game(config); }).catch(() => { game = new Phaser.Game(config); });
  } else {
    game = new Phaser.Game(config);
  }
}
startPhaserWhenFontsLoaded();

/* ---------- DOM wiring: buttons visíveis ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Start button
  const btnStart = document.getElementById('btnStart');
  const btnEdit = document.getElementById('btnEdit');

  btnStart.addEventListener('click', () => {
    if (!nickname) askNicknameBlocking();
    correctCount = 0; incorrectCount = 0; perguntaIndex = 0;

    // garante que phaser já existe
    if (!game) {
      // esperar criação do game
      const waitGame = setInterval(() => {
        if (game && game.scene) {
          clearInterval(waitGame);
          game.scene.start('quiz');
        }
      }, 100);
    } else {
      game.scene.start('quiz');
    }
  });

  btnEdit.addEventListener('click', () => {
    const n = prompt(`Digite seu apelido (máx ${NICK_MAX_LENGTH} chars):`, nickname || "");
    if (n && n.trim()) {
      nickname = sanitizeAndLimitName(n);
      updatePlayerNameUI();
    }
  });

  // Enter key starts if focused anywhere
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnStart.click();
    }
  });

  // Inicializa HUD text & preview state
  updatePlayerNameUI();
  if (typeof PERGUNTAS !== 'undefined' && PERGUNTAS.length > 0) {
    const qText = document.getElementById('questionText');
    const opts = document.getElementById('options');
    if (qText) qText.textContent = "Clique em Iniciar Jogo para começar.";
    if (opts) opts.innerHTML = '<div class="small">Opções aparecerão aqui ao iniciar o jogo.</div>';
    setProgressUI(0, PERGUNTAS.length);
  }
});
