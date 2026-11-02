// Painel do gerente: relatórios simples a partir dos pedidos salvos

const todosPedidos = lerDados("pedidos", []);

// Só entram nos relatórios os pedidos que não foram cancelados
const pedidosValidos = [];
let cancelados = 0;
for (let i = 0; i < todosPedidos.length; i++) {
  if (todosPedidos[i].status === "Cancelado") {
    cancelados++;
  } else {
    pedidosValidos.push(todosPedidos[i]);
  }
}

// Desenha uma barrinha proporcional ao maior valor da tabela
function htmlBarra(valor, maior) {
  let percentual = 0;
  if (maior > 0) {
    percentual = valor / maior * 100;
  }
  return '<div class="barra-valor"><div style="width: ' + percentual + '%;"></div></div>';
}

function mostrarIndicadores() {
  let faturamento = 0;
  for (let i = 0; i < pedidosValidos.length; i++) {
    faturamento = faturamento + pedidosValidos[i].total;
  }

  let ticketMedio = 0;
  if (pedidosValidos.length > 0) {
    ticketMedio = faturamento / pedidosValidos.length;
  }

  document.getElementById("indicadores").innerHTML =
    '<div class="indicador"><span>Faturamento</span><strong>' + formatarPreco(faturamento) + "</strong><small>Pedidos pagos e não cancelados</small></div>" +
    '<div class="indicador"><span>Pedidos</span><strong>' + pedidosValidos.length + "</strong><small>" + cancelados + " cancelado(s)</small></div>" +
    '<div class="indicador"><span>Ticket médio</span><strong>' + formatarPreco(ticketMedio) + "</strong><small>Faturamento ÷ pedidos</small></div>";
}

function mostrarPorUnidade() {
  // Primeiro calcula os valores de cada unidade
  const valores = [];
  let maior = 0;
  for (let i = 0; i < unidades.length; i++) {
    let quantidade = 0;
    let valor = 0;
    for (let j = 0; j < pedidosValidos.length; j++) {
      if (pedidosValidos[j].unidadeId === unidades[i].id) {
        quantidade++;
        valor = valor + pedidosValidos[j].total;
      }
    }
    valores.push({ unidade: unidades[i], quantidade: quantidade, valor: valor });
    if (valor > maior) {
      maior = valor;
    }
  }

  let html = '<tr><th>Unidade</th><th class="numero">Pedidos</th><th class="numero">Faturamento</th><th></th></tr>';
  for (let i = 0; i < valores.length; i++) {
    html +=
      "<tr><td><strong>" + valores[i].unidade.nome + '</strong><br><span class="texto-pequeno">' + valores[i].unidade.tipo + "</span></td>" +
      '<td class="numero">' + valores[i].quantidade + "</td>" +
      '<td class="numero">' + formatarPreco(valores[i].valor) + "</td>" +
      "<td>" + htmlBarra(valores[i].valor, maior) + "</td></tr>";
  }
  document.getElementById("tabelaUnidades").innerHTML = html;
}

function mostrarPorEstado() {
  const estados = [];
  for (let i = 0; i < unidades.length; i++) {
    if (!estados.includes(unidades[i].estado)) {
      estados.push(unidades[i].estado);
    }
  }

  let html = '<tr><th>Estado</th><th class="numero">Pedidos</th><th class="numero">Faturamento</th></tr>';
  for (let i = 0; i < estados.length; i++) {
    let quantidade = 0;
    let valor = 0;
    for (let j = 0; j < pedidosValidos.length; j++) {
      if (buscarUnidade(pedidosValidos[j].unidadeId).estado === estados[i]) {
        quantidade++;
        valor = valor + pedidosValidos[j].total;
      }
    }
    html += "<tr><td>" + estados[i] + '</td><td class="numero">' + quantidade + '</td><td class="numero">' + formatarPreco(valor) + "</td></tr>";
  }
  document.getElementById("tabelaEstados").innerHTML = html;
}

function mostrarPorCanal() {
  const canais = ["app", "totem", "web"];
  let html = '<tr><th>Canal</th><th class="numero">Pedidos</th><th class="numero">Faturamento</th></tr>';
  for (let i = 0; i < canais.length; i++) {
    let quantidade = 0;
    let valor = 0;
    for (let j = 0; j < pedidosValidos.length; j++) {
      if (pedidosValidos[j].canal === canais[i]) {
        quantidade++;
        valor = valor + pedidosValidos[j].total;
      }
    }
    html += "<tr><td>" + nomeDoCanal(canais[i]) + '</td><td class="numero">' + quantidade + '</td><td class="numero">' + formatarPreco(valor) + "</td></tr>";
  }
  document.getElementById("tabelaCanais").innerHTML = html;
}

function mostrarProdutosMaisVendidos() {
  // Soma a quantidade vendida de cada produto
  const ranking = [];
  for (let i = 0; i < produtos.length; i++) {
    let quantidade = 0;
    for (let j = 0; j < pedidosValidos.length; j++) {
      const itens = pedidosValidos[j].itens;
      for (let k = 0; k < itens.length; k++) {
        if (itens[k].id === produtos[i].id) {
          quantidade = quantidade + itens[k].quantidade;
        }
      }
    }
    if (quantidade > 0) {
      ranking.push({ nome: produtos[i].nome, quantidade: quantidade });
    }
  }

  // Ordena do mais vendido para o menos vendido
  ranking.sort(function (a, b) {
    return b.quantidade - a.quantidade;
  });

  let html = '<tr><th>Produto</th><th class="numero">Vendidos</th><th></th></tr>';
  for (let i = 0; i < ranking.length; i++) {
    html +=
      "<tr><td>" + ranking[i].nome + '</td><td class="numero">' + ranking[i].quantidade + "</td>" +
      "<td>" + htmlBarra(ranking[i].quantidade, ranking[0].quantidade) + "</td></tr>";
  }
  if (ranking.length === 0) {
    html += '<tr><td colspan="3" class="texto-suave">Nenhuma venda ainda.</td></tr>';
  }
  document.getElementById("tabelaProdutos").innerHTML = html;
}

function mostrarAuditoria() {
  const auditoria = lerDados("auditoria", []);
  let html = "<tr><th>Data</th><th>Ação</th><th>Detalhe</th></tr>";
  // Mais recente primeiro
  for (let i = auditoria.length - 1; i >= 0; i--) {
    html +=
      '<tr><td class="texto-pequeno" style="white-space: nowrap;">' + auditoria[i].data + "</td>" +
      '<td><span class="selo">' + auditoria[i].acao + "</span></td>" +
      "<td>" + auditoria[i].detalhe + "</td></tr>";
  }
  if (auditoria.length === 0) {
    html += '<tr><td colspan="3" class="texto-suave">Nenhum registro.</td></tr>';
  }
  document.getElementById("tabelaAuditoria").innerHTML = html;
}

// Relatórios e auditoria: só o gerente pode ver
if (exigirEquipe(["gerente"], "gerente")) {
  mostrarIndicadores();
  mostrarPorUnidade();
  mostrarPorEstado();
  mostrarPorCanal();
  mostrarProdutosMaisVendidos();
  mostrarAuditoria();
}
