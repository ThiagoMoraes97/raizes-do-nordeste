// Acompanhamento do status do pedido

const parametros = new URLSearchParams(window.location.search);
const idPedido = Number(parametros.get("id"));
const etapas = ["Recebido", "Em preparo", "Pronto para retirada", "Entregue"];

function buscarPedido() {
  const pedidos = lerDados("pedidos", []);
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id === idPedido) {
      return pedidos[i];
    }
  }
  return null;
}

function mensagemDoStatus(pedido) {
  if (pedido.status === "Cancelado") {
    return '<p class="mensagem erro">' + icone("info") + "<span>Este pedido foi cancelado pela loja. O estorno foi solicitado ao serviço de pagamento.</span></p>";
  }
  if (pedido.status === "Entregue") {
    return '<p class="mensagem sucesso">' + icone("check") + "<span>Pedido entregue. Bom apetite!</span></p>";
  }
  if (pedido.status === "Pronto para retirada") {
    return '<p class="mensagem sucesso">' + icone("sacola") + "<span>Seu pedido está pronto! Retire no balcão informando o número do pedido.</span></p>";
  }
  return '<p class="mensagem sucesso">' + icone("check") + "<span>Pagamento aprovado (" + pedido.pagamento.metodo + "). Seu pedido foi enviado para a cozinha.</span></p>";
}

function htmlEtapas(pedido) {
  let html = '<ol class="etapas">';

  if (pedido.status === "Cancelado") {
    html += '<li class="etapa cancelada"><span class="etapa-marcador">!</span><span>Pedido cancelado</span></li>';
  } else {
    const posicaoAtual = etapas.indexOf(pedido.status);
    for (let i = 0; i < etapas.length; i++) {
      let classe = "";
      let marcador = i + 1;
      if (i < posicaoAtual || pedido.status === "Entregue") {
        classe = "feita";
        marcador = icone("check");
      } else if (i === posicaoAtual) {
        classe = "atual";
      }
      html += '<li class="etapa ' + classe + '"><span class="etapa-marcador">' + marcador + "</span><span>" + etapas[i] + "</span></li>";
    }
  }

  html += "</ol>";
  return html;
}

function mostrarPedido() {
  const area = document.getElementById("areaPedido");
  const pedido = buscarPedido();

  if (pedido === null) {
    area.innerHTML =
      '<div class="cartao estado-vazio"><span class="estado-vazio-icone">' + icone("info") + "</span>" +
      "<h2>Pedido não encontrado</h2>" +
      '<a href="index.html" class="botao">Voltar ao início</a></div>';
    return;
  }

  const unidade = buscarUnidade(pedido.unidadeId);

  let itens = "";
  for (let i = 0; i < pedido.itens.length; i++) {
    const item = pedido.itens[i];
    itens += '<div class="resumo-linha"><span>' + item.quantidade + "x " + item.nome + "</span><span>" + formatarPreco(item.preco * item.quantidade) + "</span></div>";
  }

  let pontos = "";
  if (pedido.pontosGanhos > 0) {
    pontos = '<p class="mensagem aviso">' + icone("estrela") + "<span>Você ganhou <strong>" + pedido.pontosGanhos + " pontos</strong> no programa Raízes Fiéis!</span></p>";
  }

  let botao = '<a href="cardapio.html" class="botao botao-secundario botao-bloco">Voltar ao cardápio</a>';
  if (pegarCanal() === "totem") {
    botao = '<button class="botao botao-bloco" onclick="recomecarTotem()">Fazer novo pedido</button>';
  }

  area.innerHTML =
    mensagemDoStatus(pedido) +
    '<div class="layout-lateral">' +
    '<section class="cartao">' +
    '<div class="pedido-topo">' +
    '<div class="ticket"><small>Pedido</small><strong>' + pedido.numero + "</strong></div>" +
    "<div>" +
    '<span class="sobretitulo">Acompanhe seu pedido</span>' +
    "<h1>" + pedido.status + "</h1>" +
    '<p class="texto-suave">' + unidade.nome + " · " + pedido.tipo + "<br>" + nomeDoCanal(pedido.canal) + " · " + pedido.data + "</p>" +
    "</div>" +
    "</div>" +
    htmlEtapas(pedido) +
    "</section>" +
    '<aside class="cartao">' +
    "<h2>Itens do pedido</h2>" +
    itens +
    '<div class="resumo-linha"><span>Descontos</span><span class="desconto-valor">- ' + formatarPreco(pedido.desconto) + "</span></div>" +
    '<div class="resumo-linha resumo-total"><span>Total pago</span><span>' + formatarPreco(pedido.total) + "</span></div>" +
    '<p class="texto-pequeno">Pagamento: ' + pedido.pagamento.metodo + " · Código " + pedido.pagamento.codigo + "</p>" +
    pontos +
    botao +
    "</aside>" +
    "</div>";
}

mostrarPedido();
// Confere o status de novo a cada 2 segundos
setInterval(mostrarPedido, 2000);
