const test = require('node:test');
const assert = require('node:assert/strict');
const { recusarQuantidadeNegativa } = require('./regras-carrinho');

test('recusa quantidade negativa', () => {
  assert.throws(
    () => recusarQuantidadeNegativa(-1),
    /Quantidade negativa não é permitida/
  );
  assert.throws(
    () => recusarQuantidadeNegativa(-3),
    /Quantidade negativa não é permitida/
  );
});

test('aceita a quantidade de um pedido normal', () => {
  assert.equal(recusarQuantidadeNegativa(1), 1);
  assert.equal(recusarQuantidadeNegativa(4), 4);
});
