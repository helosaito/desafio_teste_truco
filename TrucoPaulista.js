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
        if (this.status !== 'em_andamento') {
            throw new Error('A partida não está em andamento.');
        }
        if (this.partidaEncerrada()) {
            throw new Error('A partida já terminou.');
        }
        this.aposta = 1;
        this.apostaSolicitadaPor = null;
        this.vencedorDaMao = null;
        this.rodadas = [];
        this.vira = vira;
    }

    pedirTruco(dupla) {
        this.validarDupla(dupla);
        this.exigirPartidaEmAndamento();
        if (this.apostaSolicitadaPor !== null) {
            throw new Error('Já existe um pedido de truco aguardando resposta.');
        }
        if (this.vencedorDaMao !== null) {
            throw new Error('A mão já foi finalizada.');
        }

        const proximoValor = this.proximoValor(this.aposta);
        if (proximoValor === null) {
            throw new Error('A aposta já está no valor máximo de 12 pontos.');
        }

        this.apostaSolicitadaPor = dupla;
        return { dupla, valorSolicitado: proximoValor };
    }

    aceitarTruco() {
        this.exigirPartidaEmAndamento();
        if (this.apostaSolicitadaPor === null) {
            throw new Error('Não existe pedido de truco aguardando resposta.');
        }
        this.aposta = this.proximoValor(this.aposta);
        this.apostaSolicitadaPor = null;
        return this.aposta;
    }

    correr(duplaQueCorre) {
        this.validarDupla(duplaQueCorre);
        this.exigirPartidaEmAndamento();
        if (this.apostaSolicitadaPor === null) {
            throw new Error('Não existe pedido de truco aguardando resposta.');
        }
        if (duplaQueCorre === this.apostaSolicitadaPor) {
            throw new Error('A dupla que pediu o truco não pode correr.');
        }

        const duplaVencedora = this.apostaSolicitadaPor;
        const pontos = this.aposta;
        this.pontos[duplaVencedora] += pontos;
        this.apostaSolicitadaPor = null;
        this.vencedorDaMao = duplaVencedora;
        this.status = this.partidaEncerrada() ? 'encerrada' : 'em_andamento';
        return { duplaVencedora, pontos };
    }

    registrarRodada(vencedor, empate = false) {
        this.exigirPartidaEmAndamento();
        if (typeof empate !== 'boolean') {
            throw new Error('O indicador de empate deve ser booleano.');
        }
        if (empate !== true) {
            this.validarDupla(vencedor);
        }
        if (this.vencedorDaMao !== null) {
            throw new Error('A mão já possui um vencedor.');
        }
        if (this.apostaSolicitadaPor !== null) {
            throw new Error('O pedido de truco precisa ser respondido antes da rodada.');
        }
        if (this.rodadas.length >= 3) {
            throw new Error('A mão já possui três rodadas.');
        }

        this.rodadas.push(empate ? null : vencedor);
        const resultado = this.calcularVencedorDaMao();
        if (resultado !== null) {
            this.finalizarMao(resultado);
        }
        return resultado;
    }

    finalizarMao(vencedor) {
        this.validarDupla(vencedor);
        if (this.vencedorDaMao !== null) {
            throw new Error('A mão já foi finalizada.');
        }
        this.pontos[vencedor] += this.aposta;
        this.vencedorDaMao = vencedor;
        this.status = this.partidaEncerrada() ? 'encerrada' : 'em_andamento';
    }

    calcularVencedorDaMao() {
        const vitorias = [0, 0];
        for (const rodada of this.rodadas) {
            if (rodada !== null) {
                vitorias[rodada] += 1;
            }
        }
        if (vitorias[0] >= 2) return 0;
        if (vitorias[1] >= 2) return 1;
        if (this.rodadas.length >= 2 && this.rodadas[0] === null && this.rodadas[1] !== null) {
            return this.rodadas[1];
        }
        if (this.rodadas.length === 3) {
            if (this.rodadas[0] !== null && this.rodadas[1] === null && this.rodadas[2] === null) {
                return this.rodadas[0];
            }
        }
        return null;
    }

    proximoValor(valor) {
        const indice = VALORES_MAO.indexOf(valor);
        return VALORES_MAO[indice + 1] ?? null;
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
        if (dupla !== 0 && dupla !== 1) {
            throw new Error('A dupla deve ser identificada por 0 ou 1.');
        }
    }

    exigirPartidaEmAndamento() {
        if (this.status !== 'em_andamento') {
            throw new Error('A partida não está em andamento.');
        }
        if (this.partidaEncerrada()) {
            this.status = 'encerrada';
            throw new Error('A partida já terminou.');
        }
    }

    static compararCartas(cartaA, cartaB, vira) {
        if (!cartaA || !cartaB || !vira) {
            throw new Error('Duas cartas e a vira são obrigatórias.');
        }
        for (const carta of [cartaA, cartaB, vira]) {
            if (!ORDEM_CARTAS.includes(carta.valor)) {
                throw new Error('Valor de carta inválido.');
            }
        }
        for (const carta of [cartaA, cartaB]) {
            if (!ORDEM_NAIPES.includes(carta.naipe)) {
                throw new Error('Naipe de carta inválido.');
            }
        }

        const manilha = TrucoPaulista.manilhaDaVira(vira);
        const aManilha = cartaA.valor === manilha;
        const bManilha = cartaB.valor === manilha;
        if (aManilha && bManilha) {
            return ORDEM_NAIPES.indexOf(cartaA.naipe) - ORDEM_NAIPES.indexOf(cartaB.naipe);
        }
        if (aManilha) return 1;
        if (bManilha) return -1;
        return ORDEM_CARTAS.indexOf(cartaA.valor) - ORDEM_CARTAS.indexOf(cartaB.valor);
    }

    static manilhaDaVira(vira) {
        if (!vira || !ORDEM_CARTAS.includes(vira.valor)) {
            throw new Error('Valor de vira inválido.');
        }
        return ORDEM_CARTAS[(ORDEM_CARTAS.indexOf(vira.valor) + 1) % ORDEM_CARTAS.length];
    }
}
