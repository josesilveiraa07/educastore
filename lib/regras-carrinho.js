(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.RegrasCarrinho = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function recusarQuantidadeNegativa(quantidade) {
    const valor = Number(quantidade);
    if (!Number.isFinite(valor) || valor < 0) {
      throw new Error('Quantidade negativa não é permitida');
    }
    return valor;
  }

  return { recusarQuantidadeNegativa };
});
