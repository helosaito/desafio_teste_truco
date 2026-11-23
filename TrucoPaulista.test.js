const test = require('node:test');
const assert = require('node:assert/strict');
const { TrucoPaulista } = require('./TrucoPaulista');

test('inicia partida com pontuação zerada e aposta de um ponto', () => {
    const jogo = new TrucoPaulista();
    const resumo = jogo.iniciarPartida();
    assert.equal(resumo.status, 'em_andamento');
    assert.deepEqual(resumo.pontos, [0, 0]);
    assert.equal(resumo.aposta, 1);
});

test('não permite registrar rodadas antes de iniciar', () => {
    const jogo = new TrucoPaulista();
    assert.throws(() => jogo.registrarRodada(0), /não está em andamento/);
});

test('dupla vence mão ao ganhar duas rodadas', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    assert.equal(jogo.registrarRodada(0), null);
    assert.equal(jogo.registrarRodada(0), 0);
    assert.equal(jogo.pontuacaoDaDupla(0), 1);
});

test('dupla vence após perder a primeira rodada', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    jogo.registrarRodada(1);
    jogo.registrarRodada(0);
    assert.equal(jogo.registrarRodada(0), 0);
    assert.equal(jogo.pontuacaoDaDupla(0), 1);
});

test('vitória na segunda rodada decide após empate na primeira', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    jogo.registrarRodada(null, true);
    assert.equal(jogo.registrarRodada(1), 1);
    assert.equal(jogo.pontuacaoDaDupla(1), 1);
});

test('pedido e aceitação de truco aumentam a aposta', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    assert.deepEqual(jogo.pedirTruco(0), { dupla: 0, valorSolicitado: 3 });
    assert.equal(jogo.aceitarTruco(), 3);
    assert.equal(jogo.aposta, 3);
});

test('vitória após aceitar truco pontua o valor da aposta', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    jogo.pedirTruco(0);
    jogo.aceitarTruco();
    jogo.registrarRodada(0);
    jogo.registrarRodada(0);
    assert.equal(jogo.pontuacaoDaDupla(0), 3);
});

test('desistência concede o valor anterior ao solicitante', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    jogo.pedirTruco(0);
    assert.deepEqual(jogo.correr(1), { duplaVencedora: 0, pontos: 1 });
    assert.equal(jogo.pontuacaoDaDupla(0), 1);
});

test('progressão da aposta termina em doze pontos', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    for (let indice = 0; indice < 4; indice += 1) {
        jogo.pedirTruco(indice % 2);
        jogo.aceitarTruco();
    }
    assert.equal(jogo.aposta, 12);
    assert.throws(() => jogo.pedirTruco(0), /máximo/);
});

test('partida termina ao atingir doze pontos', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    jogo.pontos[0] = 11;
    jogo.registrarRodada(0);
    jogo.registrarRodada(0);
    assert.equal(jogo.status, 'encerrada');
    assert.equal(jogo.pontuacaoDaDupla(0), 12);
    assert.throws(() => jogo.novaMao(), /não está em andamento|já terminou/);
});

test('rejeita dupla inválida e pedido de truco duplicado', () => {
    const jogo = new TrucoPaulista();
    jogo.iniciarPartida();
    assert.throws(() => jogo.pedirTruco(2), /identificada por 0 ou 1/);
    jogo.pedirTruco(0);
    assert.throws(() => jogo.pedirTruco(1), /aguardando resposta/);
});

test('identifica manilha como carta seguinte à vira', () => {
    assert.equal(TrucoPaulista.manilhaDaVira({ valor: '7', naipe: 'copas' }), 'Q');
    assert.equal(TrucoPaulista.manilhaDaVira({ valor: '3', naipe: 'paus' }), '4');
});

test('manilha vence carta comum e naipe define disputa entre manilhas', () => {
    assert.ok(TrucoPaulista.compararCartas(
        { valor: 'Q', naipe: 'ouros' },
        { valor: '3', naipe: 'paus' },
        { valor: '7', naipe: 'copas' }
    ) > 0);
    assert.ok(TrucoPaulista.compararCartas(
        { valor: 'Q', naipe: 'paus' },
        { valor: 'Q', naipe: 'ouros' },
        { valor: '7', naipe: 'copas' }
    ) > 0);
});
