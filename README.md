# Truco Paulista — Desafio de Testes

## Desafio

O desafio é elaborar testes automatizados para uma partida simplificada de Truco Paulista entre duas duplas, identificadas por `0` e `1`. A implementação de todas as funcionalidades não é obrigatória na atividade; este repositório inclui uma implementação de referência para os testes.

O código representa estado inicial, pontuação, mãos, rodadas, pedidos de aumento de aposta, aceitação ou desistência, encerramento em 12 pontos e comparação de cartas/manilhas. Cada mão inicia valendo 1 ponto. A aposta pode aumentar para 3, 6, 9 ou 12. Quando a primeira rodada empata, a vitória da segunda define a mão. As demais combinações de empate não estavam especificadas na documentação auditada; confirme o enunciado original antes de ampliar essas regras. O projeto não distribui cartas nem oferece interface de jogo.

## Colaboradores

- Heloísa Sayuri Silva Saito | RA: 24062631-2

- Maria Eduarda de Castro Lachimia | RA: 24055202-2

## Arquivos

- `TrucoPaulista.js`: implementação da classe e comparação de cartas.

- `TrucoPaulista.test.js`: testes automatizados com `node:test` e `node:assert/strict`.

## Casos de teste

| Caso | O que verifica |
| --- | --- |
| Inicia partida com pontuação zerada e aposta de um ponto | O estado inicial é `em_andamento`, as duas pontuações são zero e a aposta vale 1. |
| Não permite registrar rodadas antes de iniciar | Uma rodada antes de `iniciarPartida()` lança erro. |
| Dupla vence mão ao ganhar duas rodadas | Duas vitórias da dupla 0 encerram a mão e somam 1 ponto. |
| Dupla vence após perder a primeira rodada | A dupla que vence as duas rodadas seguintes vence a mão. |
| Vitória na segunda rodada decide após empate na primeira | Depois de empate na primeira, a vitória da dupla 1 na segunda encerra a mão e pontua. |
| Pedido e aceitação de truco aumentam a aposta | O pedido de 1 solicita 3 e sua aceitação altera a aposta para 3. |
| Vitória após aceitar truco pontua o valor da aposta | A dupla vencedora recebe os 3 pontos da aposta aceita. |
| Desistência concede o valor anterior ao solicitante | A dupla que pediu recebe a aposta atual quando a adversária corre. |
| Progressão da aposta termina em doze pontos | A aposta percorre 3, 6, 9 e 12, sem permitir novo aumento. |
| Partida termina ao atingir doze pontos | A pontuação chega a 12 e o status passa a `encerrada`. |
| Rejeita dupla inválida e pedido de truco duplicado | Identificador de dupla inválido e segundo pedido sem resposta são rejeitados. |
| Identifica manilha como carta seguinte à vira | A função retorna a carta seguinte na ordem definida, inclusive ao passar do 3 para o 4. |
| Manilha vence carta comum e naipe define disputa entre manilhas | A manilha supera carta comum e a ordem de naipes desempata duas manilhas. |
| Rejeita cartas e resultados de rodada inválidos | Valores de carta e vencedor de rodada fora dos domínios aceitos lançam erro. |

## Como executar

Requer Node.js 18 ou superior. Não há dependências externas, na pasta deste projeto, execute:

```bash
node --test
```
