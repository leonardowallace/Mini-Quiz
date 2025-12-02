let score = 0;
let perguntaIndex = 0;

class TelaMenu extends Phaser.Scene {
    constructor() { super("menu"); }

    create() {
        this.add.text(400, 150, "Mini-Game de\nBoas Práticas de TI",
            { fontSize: "36px", color: "#000", align: "center" }
        ).setOrigin(0.5);

        const btn = this.add.text(400, 350, "Iniciar Jogo", {
            fontSize: "28px", backgroundColor: "#4CAF50", color: "#fff", padding: 20
        }).setOrigin(0.5).setInteractive();

        btn.on("pointerdown", () => {
            score = 0;
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

        this.add.text(400, 120, p.pergunta, {
            fontSize: "28px",
            color: "#000",
            align: "center",
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        p.opcoes.forEach((op, i) => {
            const btn = this.add.text(400, 250 + (i * 70), op, {
                fontSize: "24px",
                backgroundColor: "#2196F3",
                color: "#fff",
                padding: 15
            }).setOrigin(0.5).setInteractive();

            btn.on("pointerdown", () => this.verificarResposta(i));
        });
    }

    verificarResposta(opcaoEscolhida) {
        const p = PERGUNTAS[perguntaIndex];
        if (opcaoEscolhida === p.correta) score += 100;

        perguntaIndex++;
        this.mostrarPergunta();
    }
}

class TelaResultado extends Phaser.Scene {
    constructor() { super("resultado"); }

    create() {
        this.add.text(400, 200, "Pontuação Final:", {
            fontSize: "32px",
            color: "#000"
        }).setOrigin(0.5);

        this.add.text(400, 280, score.toString(), {
            fontSize: "48px",
            color: "#4CAF50"
        }).setOrigin(0.5);

        const btn = this.add.text(400, 420, "Jogar Novamente", {
            fontSize: "26px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: 20
        }).setOrigin(0.5).setInteractive();

        btn.on("pointerdown", () => this.scene.start("menu"));
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#ffffff",
    scene: [TelaMenu, TelaQuiz, TelaResultado]
};

new Phaser.Game(config);
