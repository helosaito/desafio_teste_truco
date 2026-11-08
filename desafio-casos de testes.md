# desafio_teste_truco

Repositório do desafio de testes automatizados do **Truco Paulista**.

## 1. Colaborador(es)

Preencha os nomes das pessoas que participaram deste repositório:

- Colaborador 1: ____________________________________

- Colaborador 2: ____________________________________

Se o trabalho for individual, remova a segunda linha.

## 2. Especificação do desafio

O desafio consiste em criar casos de teste em JavaScript para verificar o funcionamento de uma partida de **Truco Paulista entre duas duplas**.

Neste projeto, as duplas são identificadas pelos números `0` e `1`.

As regras consideradas são:

- A partida começa com as duas duplas com zero pontos.

- Cada mão começa valendo 1 ponto.

- A dupla que vencer duas rodadas vence a mão.

- Se a primeira rodada empatar, a dupla que vencer a segunda rodada vence a mão.

- O valor da mão pode aumentar de 1 para 3, 6, 9 ou 12 pontos.

- A dupla adversária pode aceitar o pedido de truco ou correr.

- Quando a dupla adversária corre, quem pediu o truco recebe o valor anterior da aposta.

- A partida termina quando uma dupla alcança 12 pontos.

- A vira determina a manilha.

- Entre duas manilhas, o naipe mais forte vence.

O projeto não possui interface gráfica nem distribuição automática de cartas. O objetivo é testar as regras por meio de funções JavaScript, de forma simples e automatizada.

## 3. Estrutura do projeto

```
.
├── package.json
├── README.md
├── src/
│   └── TrucoPaulista.js
└── tests/
    └── TrucoPaulista.test.js
```

### Arquivos

- `src/TrucoPaulista.js`: contém a classe `TrucoPaulista` e as regras testadas.

- `tests/TrucoPaulista.test.js`: contém os casos de teste automatizados.

- `package.json`: contém os comandos e a dependência do Jest.

## 4. Funcionamento dos casos de teste

Os testes são executados com o framework Jest. Cada teste segue três etapas:

1. **Preparação:** cria uma partida e configura a situação necessária.

1. **Execução:** chama uma função da classe, como pedir truco ou registrar uma rodada.

1. **Verificação:** compara o resultado obtido com o resultado esperado usando `expect`.

### Casos de teste implementados

| Nº | Caso testado | Resultado esperado |
| --- | --- | --- |
| 1 | Iniciar uma partida | A partida fica em andamento, com pontuação `[0, 0]` e aposta 1. |
| 2 | Vencer duas rodadas | A dupla vencedora recebe 1 ponto. |
| 3 | Vencer após perder a primeira rodada | A dupla que vencer as duas rodadas seguintes ganha a mão. |
| 4 | Empatar a primeira rodada | A dupla vencedora da segunda rodada ganha a mão. |
| 5 | Pedir truco | O sistema registra o pedido de aumento para 3 pontos. |
| 6 | Aceitar truco | A aposta passa a valer 3 pontos. |
| 7 | Vencer uma mão trucada | A dupla vencedora recebe 3 pontos. |
| 8 | Correr do truco | Quem pediu recebe o valor anterior da aposta. |
| 9 | Aumentar a aposta | A aposta pode evoluir de 1 para 3, 6, 9 e 12. |
| 10 | Chegar a 12 pontos | A partida fica com status `encerrada`. |
| 11 | Usar uma dupla inválida | O sistema lança um erro. |
| 12 | Pedir truco duas vezes | O segundo pedido é rejeitado enquanto o primeiro aguarda resposta. |
| 13 | Calcular a manilha | A carta seguinte à vira é identificada como manilha. |
| 14 | Comparar manilha e carta comum | A manilha vence a carta comum. |
| 15 | Comparar duas manilhas | O naipe mais forte vence. |

### Exemplo de teste

```javascript
test('dupla vence uma mão com duas rodadas e recebe 1 ponto', () => {
  const jogo = new TrucoPaulista();
  jogo.iniciarPartida();

  jogo.registrarRodada(0);
  jogo.registrarRodada(0);

  expect(jogo.pontuacaoDaDupla(0)).toBe(1);
});
```

Nesse caso:

- a partida é criada;

- a partida é iniciada;

- a Dupla 0 vence duas rodadas;

- o teste verifica se ela recebeu 1 ponto.

## 5. Instalação

É necessário ter Node.js instalado. Dentro da pasta do projeto, execute:

```bash
npm install
```

## 6. Execução dos testes

Para executar todos os testes:

```bash
npm test
```

Comando para executar os testes observando alterações:

```bash
npm run test:watch
```

Comando para gerar cobertura de testes:

```bash
npm run test:coverage
```

## 7. Observações do enunciado

- A realização dos desafios é opcional.

- Podem ser feitos em dupla.

- A contribuição de cada integrante deve aparecer no repositório para que seja considerada.

- Este repositório segue o padrão de nomenclatura `desafio_teste_truco`.

- Serão considerados no máximo 5 desafios entregues.