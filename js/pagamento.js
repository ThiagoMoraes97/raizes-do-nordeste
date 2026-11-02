// Pagamento: o sistema só envia a solicitação para o serviço externo
// e trata a resposta (aprovado, recusado ou sem resposta)

const carrinho = lerDados("carrinho", []);
if (carrinho.length === 0) {
  window.location.href = "cardapio.html";
}

// No App e na Web o pagamento exige login (no totem não)
function conferirLogin() {
  if (pegarCanal() !== "totem" && usuarioLogado() === null) {
    window.location.href = "login.html?voltar=carrinho";
  }
}

// Chamada pelo comum.js quando o modo de visualização muda
function aoTrocarModo() {
  conferirLogin();
}

conferirLogin();

const checkout = pegarCheckout();
const totais = calcularTotais();
const btnPagar = document.getElementById("btnPagar");

function mostrarResumoPedido() {
  let html = "";
  for (let i = 0; i < carrinho.length; i++) {
    const produto = buscarProduto(carrinho[i].id);
    html +=
      '<div class="item-carrinho">' +
      '<div class="item-imagem">' + htmlFoto(produto) + "</div>" +
      '<div class="item-info"><strong>' + produto.nome + "</strong><small>" + carrinho[i].quantidade + " x " + formatarPreco(produto.preco) + "</small></div>" +
      "</div>";
  }
  document.getElementById("resumoItens").innerHTML = html;
  document.getElementById("subtotal").textContent = formatarPreco(totais.subtotal);
  document.getElementById("desconto").textContent = "- " + formatarPreco(totais.desconto);
  document.getElementById("total").textContent = formatarPreco(totais.total);
  document.getElementById("tipoPedido").textContent = "Tipo do pedido: " + checkout.tipo;
  textoBotaoPagar();
}

function textoBotaoPagar() {
  btnPagar.innerHTML = icone("cadeado") + "Pagar " + formatarPreco(totais.total);
}

btnPagar.onclick = function () {
  const metodoMarcado = document.querySelector('input[name="metodo"]:checked');
  if (metodoMarcado === null) {
    mostrarMensagem("mensagemPagamento", "Escolha uma forma de pagamento.", "erro");
    return;
  }

  const metodo = metodoMarcado.value;
  const resposta = document.getElementById("respostaGateway").value;

  // Desabilita o botão para o cliente não pagar duas vezes
  btnPagar.disabled = true;
  btnPagar.innerHTML = '<span class="carregando"></span>Processando...';
  mostrarMensagem("mensagemPagamento", icone("relogio") + "<span>Enviando solicitação ao serviço de pagamento... aguarde.</span>", "aviso");

  if (resposta === "sem_resposta") {
    // Depois de 5 segundos sem resposta, desistimos (timeout)
    setTimeout(function () {
      registrarAuditoria("Pagamento sem resposta", metodo + " - " + formatarPreco(totais.total) + " - serviço externo não respondeu");
      mostrarMensagem("mensagemPagamento", icone("info") + "<span>O serviço de pagamento não respondeu. Nenhum valor foi cobrado. Tente novamente em alguns instantes.</span>", "erro");
      btnPagar.disabled = false;
      textoBotaoPagar();
    }, 5000);
    return;
  }

  setTimeout(function () {
    if (resposta === "recusado") {
      registrarAuditoria("Pagamento recusado", metodo + " - " + formatarPreco(totais.total));
      mostrarMensagem("mensagemPagamento", icone("info") + "<span>Pagamento recusado pela operadora. Confira seus dados ou escolha outra forma de pagamento.</span>", "erro");
      btnPagar.disabled = false;
      textoBotaoPagar();
    } else {
      finalizarPedido(metodo);
    }
  }, 2000);
};

function finalizarPedido(metodo) {
  const usuario = usuarioLogado();
  const pedidos = lerDados("pedidos", []);
  const numero = pedidos.length + 101;

  const itens = [];
  for (let i = 0; i < carrinho.length; i++) {
    const produto = buscarProduto(carrinho[i].id);
    itens.push({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: carrinho[i].quantidade
    });
  }

  // Fidelidade: desconta os pontos usados e soma os pontos ganhos (1 ponto por real)
  let pontosGanhos = 0;
  let pontosUsados = 0;
  if (usuario !== null && usuario.consentimentos.fidelidade) {
    if (totais.descontoPontos > 0) {
      pontosUsados = PONTOS_PARA_RESGATE;
      usuario.pontos = usuario.pontos - PONTOS_PARA_RESGATE;
      registrarAuditoria("Resgate de pontos", "Pedido nº " + numero + " - " + PONTOS_PARA_RESGATE + " pontos = " + formatarPreco(DESCONTO_DO_RESGATE));
    }
    pontosGanhos = Math.floor(totais.total);
    usuario.pontos = usuario.pontos + pontosGanhos;
    salvarUsuario(usuario);
  }

  if (totais.descontoCupom > 0) {
    registrarAuditoria("Desconto por cupom", "Pedido nº " + numero + " - cupom " + checkout.cupom + " - " + formatarPreco(totais.descontoCupom));
  }

  let emailCliente = null;
  let nomeCliente = "Cliente sem cadastro";
  if (usuario !== null) {
    emailCliente = usuario.email;
    nomeCliente = primeiroNome(usuario.nome);
  }

  const pedido = {
    id: Date.now(),
    numero: numero,
    data: new Date().toLocaleString("pt-BR"),
    unidadeId: lerDados("unidade", null),
    canal: pegarCanal(),
    tipo: checkout.tipo,
    clienteEmail: emailCliente,
    clienteNome: nomeCliente,
    itens: itens,
    subtotal: totais.subtotal,
    desconto: totais.desconto,
    total: totais.total,
    pagamento: {
      metodo: metodo,
      situacao: "Aprovado",
      codigo: "PAG-" + Math.floor(Math.random() * 1000000)
    },
    pontosGanhos: pontosGanhos,
    pontosUsados: pontosUsados,
    status: "Recebido"
  };

  pedidos.push(pedido);
  salvarDados("pedidos", pedidos);

  // Limpa o carrinho depois do pedido feito
  salvarDados("carrinho", []);
  localStorage.removeItem("checkout");

  // No totem o aparelho é de uso coletivo, então o cliente é desconectado
  if (pegarCanal() === "totem") {
    localStorage.removeItem("sessao");
  }

  window.location.href = "pedido.html?id=" + pedido.id;
}

mostrarResumoPedido();
