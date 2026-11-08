const { TrucoPaulista } = require('../src/TrucoPaulista');

describe('Truco Paulista - partida e pontuação', () => {
    test('inicia uma partida com duas duplas e pontuação zerada', () => {
        const jogo = new TrucoPaulista();
        const resumo = jogo.iniciarPartida();
        expect(resumo.status).toBe('em_andamento');
        expect(resumo.pontos).toEqual([0, 0]);
        expect(resumo.aposta).toBe(1);
    });

    test('dupla vence uma mão com duas rodadas e recebe 1 ponto', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.registrarRodada(0);
        jogo.registrarRodada(0);
        expect(jogo.pontuacaoDaDupla(0)).toBe(1);
        expect(jogo.vencedorDaMao).toBe(0);
    });

    test('dupla vence uma mão após perder a primeira rodada', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.registrarRodada(1);
        jogo.registrarRodada(0);
        jogo.registrarRodada(0);
        expect(jogo.pontuacaoDaDupla(0)).toBe(1);
    });

    test('empate na primeira rodada e vitória na segunda encerra a mão', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.registrarRodada(null, true);
        jogo.registrarRodada(1);
        expect(jogo.pontuacaoDaDupla(1)).toBe(1);
    });

    test('pedido de truco aceito aumenta a mão de 1 para 3', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        expect(jogo.pedirTruco(0)).toEqual({ dupla: 0, valorSolicitado: 3 });
        expect(jogo.aceitarTruco()).toBe(3);
        expect(jogo.aposta).toBe(3);
    });

    test('a mão vale o valor atual da aposta depois de um truco aceito', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.pedirTruco(0);
        jogo.aceitarTruco();
        jogo.registrarRodada(0);
        jogo.registrarRodada(0);
        expect(jogo.pontuacaoDaDupla(0)).toBe(3);
    });

    test('quando a dupla adversária corre, quem pediu truco recebe o valor anterior', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.pedirTruco(0);
        const resultado = jogo.correr(1);
        expect(resultado).toEqual({ duplaVencedora: 0, pontos: 1 });
        expect(jogo.pontuacaoDaDupla(0)).toBe(1);
    });

    test('permite aumentos sucessivos de 3, 6, 9 e 12', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.pedirTruco(0); jogo.aceitarTruco();
        jogo.pedirTruco(1); jogo.aceitarTruco();
        jogo.pedirTruco(0); jogo.aceitarTruco();
        jogo.pedirTruco(1); jogo.aceitarTruco();
        expect(jogo.aposta).toBe(12);
    });

    test('encerra a partida quando uma dupla chega a 12 pontos', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        jogo.pontos[0] = 11;
        jogo.registrarRodada(0);
        jogo.registrarRodada(0);
        expect(jogo.status).toBe('encerrada');
        expect(jogo.pontuacaoDaDupla(0)).toBe(12);
    });

    test('rejeita dupla inválida e pedido de truco duplicado', () => {
        const jogo = new TrucoPaulista();
        jogo.iniciarPartida();
        expect(() => jogo.pedirTruco(2)).toThrow('A dupla deve ser identificada por 0 ou 1.');
        jogo.pedirTruco(0);
        expect(() => jogo.pedirTruco(1)).toThrow('Já existe um pedido de truco aguardando resposta.');
    });
});

describe('Truco Paulista - manilhas', () => {
    test('a manilha é a carta seguinte à vira na ordem do truco', () => {
        expect(TrucoPaulista.manilhaDaVira({ valor: '7', naipe: 'copas' })).toBe('Q');
        expect(TrucoPaulista.manilhaDaVira({ valor: '3', naipe: 'paus' })).toBe('4');
    });

    test('uma manilha vence uma carta comum', () => {
        const resultado = TrucoPaulista.compararCartas(
            { valor: 'Q', naipe: 'ouros' },
            { valor: '3', naipe: 'paus' },
            { valor: '7', naipe: 'copas' }
        );
        expect(resultado).toBeGreaterThan(0);
    });

    test('entre duas manilhas, o naipe define a força', () => {
        const resultado = TrucoPaulista.compararCartas(
            { valor: 'Q', naipe: 'paus' },
            { valor: 'Q', naipe: 'ouros' },
            { valor: '7', naipe: 'copas' }
        );
        expect(resultado).toBeGreaterThan(0);
    });
});
