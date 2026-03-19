// js/game.js
// Lógica reescrita em Vanilla JS (motor DOM puro), removendo o peso do Phaser.

const NICK_MAX_LENGTH = 16;

let nickname = null;
let totalScore = 0;
let correctCount = 0;
let incorrectCount = 0;
let perguntaIndex = 0;

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

  if (chosenIndex === correctIdx) {
    correctCount++;
    totalScore += p.pontos;
  } else {
    incorrectCount++;
  }

  setTimeout(() => {
    perguntaIndex++;
    if (perguntaIndex >= PERGUNTAS.length) {
      showResultScreen();
    } else {
      showQuestionUI(PERGUNTAS[perguntaIndex], perguntaIndex, PERGUNTAS.length);
    }
  }, 800);
}

/* ---------- Leaderboard UI ---------- */
async function carregarLeaderboardUI() {
  const list = document.getElementById('lbList');
  if (!list) return;

  try {
    const snapshot = await window.FSDB.collection('scores').orderBy('score', 'desc').limit(10).get();
    list.innerHTML = '';
    
    if (snapshot.empty) {
      list.innerHTML = '<li>Nenhum score ainda.</li>';
      return;
    }

    snapshot.forEach(doc => {
      const d = doc.data();
      const li = document.createElement('li');
      
      const strong = document.createElement('strong');
      strong.textContent = sanitizeAndLimitName(d.nickname || '—');
      li.appendChild(strong);
      
      const span = document.createElement('span');
      span.style.float = 'right';
      span.textContent = `${d.score} pts`;
      li.appendChild(span);
      
      list.appendChild(li);
    });
    document.getElementById('leaderboard').style.display = 'block';
  } catch (err) {
    console.error('Erro ao buscar leaderboard:', err);
    list.innerHTML = `<li style="color:red; font-size:12px">Erro ao carregar ranking online. Verifique conexão e chaves.</li>`;
  }
}

/* ---------- Telas do Jogo ---------- */
function initGame() {
  const rb = document.getElementById('resultBar');
  if (rb) rb.style.display = 'none';
  
  totalScore = 0;
  correctCount = 0; 
  incorrectCount = 0; 
  perguntaIndex = 0;
  
  if (PERGUNTAS && PERGUNTAS.length > 0) {
    showQuestionUI(PERGUNTAS[perguntaIndex], perguntaIndex, PERGUNTAS.length);
  } else {
    alert("Erro: Banco de perguntas não carregado.");
  }
}

function showResultScreen() {
  const qText = document.getElementById('questionText');
  const opts = document.getElementById('options');
  const summary = document.getElementById('resultSummary');
  const bar = document.getElementById('resultBar');
  
  if (qText) qText.textContent = "Fim do Jogo!";
  if (opts) opts.innerHTML = '';

  if (summary && bar) {
    summary.textContent = `Acertos: ${correctCount} • Erros: ${incorrectCount} • Pontuação Total: ${totalScore} / 100`;
    bar.style.display = 'block';

    saveScore(totalScore);
  }
}

async function saveScore(score) {
  try {
    const payload = {
      nickname: sanitizeAndLimitName(nickname),
      score: score,
      correct: correctCount,
      incorrect: incorrectCount,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    await window.FSDB.collection('scores').add(payload);
    carregarLeaderboardUI();
  } catch (err) {
    console.error('Erro ao salvar score no Firestore:', err);
    const list = document.getElementById('lbList');
    if (list) {
      const errInfo = document.createElement('li');
      errInfo.style.color = "red";
      errInfo.style.fontSize = "12px";
      errInfo.textContent = "Pontuação não salva: erro de conexão ou permissão.";
      list.prepend(errInfo);
    }
  }
}

/* ---------- Event Listeners Iniciais ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const btnStart = document.getElementById('btnStart');
  const btnEdit = document.getElementById('btnEdit');
  const btnReplay = document.getElementById('btnReplay');
  const btnShowBoard = document.getElementById('btnShowBoard');

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (!nickname) askNicknameBlocking();
      if (nickname) initGame();
    });
  }

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      const n = prompt(`Digite seu apelido (máx ${NICK_MAX_LENGTH} chars):`, nickname || "");
      if (n && n.trim()) {
        nickname = sanitizeAndLimitName(n);
        updatePlayerNameUI();
      }
    });
  }

  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      initGame();
    });
  }

  if (btnShowBoard) {
    btnShowBoard.addEventListener('click', () => {
      carregarLeaderboardUI();
    });
  }

  // Atalho: tecla Enter para Iniciar / Reiniciar se não houver um input ativo
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const qText = document.getElementById('questionText');
      if (qText && (qText.textContent === "Clique em Iniciar Jogo para começar." || qText.textContent === "Clique em Iniciar Jogo" || qText.textContent === "Fim do Jogo!")) {
        // Clica no start
        if (qText.textContent === "Fim do Jogo!" && btnReplay) {
            btnReplay.click();
        } else if (btnStart) {
            btnStart.click();
        }
      }
    }
  });

  // UI inicial
  updatePlayerNameUI();
  
  if (typeof PERGUNTAS !== 'undefined' && PERGUNTAS.length > 0) {
    const qText = document.getElementById('questionText');
    const opts = document.getElementById('options');
    if (qText) qText.textContent = "Clique em Iniciar Jogo para começar.";
    if (opts) opts.innerHTML = '<div class="small">Opções aparecerão aqui ao iniciar o jogo.</div>';
    setProgressUI(0, PERGUNTAS.length);
  }

  // Inicializa a leaderboard visualmente
  carregarLeaderboardUI();
});
