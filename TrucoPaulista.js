const ORDEM_NAIPES = ['ouros', 'espadas', 'copas', 'paus'];
const ORDEM_CARTAS = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];
const VALORES_MAO = [1, 3, 6, 9, 12];

class TrucoPaulista {
    constructor() {
        this.pontos = [0, 0];
        this.aposta = 1;
        this.apostaSolicitadaPor = null;
        this.status = 'aguardando';
        this.vencedorDaMao = null;
        this.rodadas = [];
        this.vira = null;
    }

    iniciarPartida() {
        if (this.status !== 'aguardando') {
            throw new Error('A partida já foi iniciada.');
        }
        this.status = 'em_andamento';
        this.novaMao();
        return this.resumo();
    }

    novaMao(vira = null) {
        if (this.partidaEncerrada()) {
            throw new Error('A partida já terminou.');
        }
        this.aposta = 1;
        this.apostaSolicitadaPor = null;
        this.vencedorDaMao = null;
        this.rodadas = [];
        this.vira = vira;
        if (this.status === 'aguardando') this.status = 'em_andamento';
    }

    pedirTruco(dupla) {
        this.validarDupla(dupla);
        if (this.status !== 'em_andamento') throw new Error('A partida não está em andamento.');
        if (this.apostaSolicitadaPor !== null) throw new Error('Já existe um pedido de truco aguardando resposta.');

        const proximoValor = this.proximoValor(this.aposta);
        if (!proximoValor) throw new Error('A aposta já está no valor máximo de 12 pontos.');

        this.apostaSolicitadaPor = dupla;
        return { dupla, valorSolicitado: proximoValor };
    }

    aceitarTruco() {
        if (this.apostaSolicitadaPor === null) throw new Error('Não existe pedido de truco aguardando resposta.');
        this.aposta = this.proximoValor(this.aposta);
        this.apostaSolicitadaPor = null;
        return this.aposta;
    }

    correr(duplaQueCorre) {
        this.validarDupla(duplaQueCorre);
        if (this.apostaSolicitadaPor === null) throw new Error('Não existe pedido de truco aguardando resposta.');
        if (duplaQueCorre === this.apostaSolicitadaPor) throw new Error('A dupla que pediu o truco não pode correr.');

        const duplaVencedora = this.apostaSolicitadaPor;
        const pontos = this.aposta;
        this.pontos[duplaVencedora] += pontos;
        this.apostaSolicitadaPor = null;
        this.vencedorDaMao = duplaVencedora;
        this.status = this.partidaEncerrada() ? 'encerrada' : 'em_andamento';
        return { duplaVencedora, pontos };
    }

    registrarRodada(vencedor, empate = false) {
        if (![0, 1].includes(vencedor) && !empate) throw new Error('O vencedor deve ser a dupla 0 ou 1.');
        if (this.vencedorDaMao !== null) throw new Error('A mão já possui um vencedor.');

        this.rodadas.push(empate ? null : vencedor);
        const resultado = this.calcularVencedorDaMao();
        if (resultado !== null) this.finalizarMao(resultado);
        return resultado;
    }

    finalizarMao(vencedor) {
        this.validarDupla(vencedor);
        if (this.vencedorDaMao !== null) throw new Error('A mão já foi finalizada.');
        this.pontos[vencedor] += this.aposta;
        this.vencedorDaMao = vencedor;
        this.status = this.partidaEncerrada() ? 'encerrada' : 'em_andamento';
    }

    calcularVencedorDaMao() {
        const vitorias = [0, 0];
        for (const rodada of this.rodadas) {
            if (rodada !== null) vitorias[rodada]++;
        }
        if (vitorias[0] >= 2) return 0;
        if (vitorias[1] >= 2) return 1;

        // No Truco Paulista, se a primeira rodada empata, a dupla que vencer
        // qualquer rodada posterior leva a mão.
        if (this.rodadas.length >= 2 && this.rodadas[0] === null) {
            if (this.rodadas[1] !== null) return this.rodadas[1];
        }
        if (this.rodadas.length === 3) {
            if (this.rodadas[1] !== null && this.rodadas[2] !== null && this.rodadas[1] === this.rodadas[2]) return this.rodadas[1];
            if (this.rodadas[0] !== null && this.rodadas[1] === null && this.rodadas[2] === null) return this.rodadas[0];
        }
        return null;
    }

    proximoValor(valor) {
        const indice = VALORES_MAO.indexOf(valor);
        return VALORES_MAO[indice + 1] || null;
    }

    partidaEncerrada() {
        return this.pontos.some((pontos) => pontos >= 12);
    }

    pontuacaoDaDupla(dupla) {
        this.validarDupla(dupla);
        return this.pontos[dupla];
    }

    resumo() {
        return {
            status: this.status,
            pontos: [...this.pontos],
            aposta: this.aposta,
            rodadas: [...this.rodadas],
            vira: this.vira,
            vencedorDaMao: this.vencedorDaMao
        };
    }

    validarDupla(dupla) {
        if (![0, 1].includes(dupla)) throw new Error('A dupla deve ser identificada por 0 ou 1.');
    }

    static compararCartas(cartaA, cartaB, vira) {
        if (!cartaA || !cartaB || !vira) throw new Error('Duas cartas e a vira são obrigatórias.');
        const manilha = TrucoPaulista.manilhaDaVira(vira);
        const aManilha = cartaA.valor === manilha;
        const bManilha = cartaB.valor === manilha;
        if (aManilha && bManilha) return ORDEM_NAIPES.indexOf(cartaA.naipe) - ORDEM_NAIPES.indexOf(cartaB.naipe);
        if (aManilha) return 1;
        if (bManilha) return -1;
        return ORDEM_CARTAS.indexOf(cartaA.valor) - ORDEM_CARTAS.indexOf(cartaB.valor);
    }

    static manilhaDaVira(vira) {
        const indice = ORDEM_CARTAS.indexOf(vira.valor);
        if (indice < 0) throw new Error('Valor de vira inválido.');
        return ORDEM_CARTAS[(indice + 1) % ORDEM_CARTAS.length];
    }
}

module.exports = { TrucoPaulista, ORDEM_CARTAS, ORDEM_NAIPES };
