// Carrinho: itens, tipo de pedido, cupom e uso de pontos

const checkout = pegarCheckout();

function salvarCheckout() {
  salvarDados("checkout", checkout);
}

function mostrarCarrinho() {
  const carrinho = lerDados("carrinho", []);

  if (carrinho.length === 0) {
    document.getElementById("carrinhoVazio").classList.remove("escondido");
    document.getElementById("areaCarrinho").classList.add("escondido");
    return;
  }

  let html = "";
  for (let i = 0; i < carrinho.length; i++) {
    const produto = buscarProduto(carrinho[i].id);
    const quantidade = carrinho[i].quantidade;

    html +=
      '<div class="item-carrinho">' +
      '<div class="item-imagem">' + htmlFoto(produto) + "</div>" +
      '<div class="item-info"><strong>' + produto.nome + "</strong><small>" + formatarPreco(produto.preco) + " cada</small></div>" +
      '<div class="item-acoes">' +
      '<div class="quantidade">' +
      '<button onclick="alterarQuantidade(' + produto.id + ', -1)" aria-label="Diminuir">−</button>' +
      "<span>" + quantidade + "</span>" +
      '<button onclick="alterarQuantidade(' + produto.id + ', 1)" aria-label="Aumentar">+</button>' +
      "</div>" +
      '<strong class="item-total">' + formatarPreco(produto.preco * quantidade) + "</strong>" +
      '<button class="link-remover" onclick="removerItem(' + produto.id + ')">Remover</button>' +
      "</div>" +
      "</div>";
  }
  document.getElementById("listaItens").innerHTML = html;

  mostrarPontos();
  mostrarResumo();
}

// Os botões − e + usam alterarQuantidade (comum.js)
function aoMudarCarrinho() {
  mostrarCarrinho();
}

function removerItem(id) {
  const carrinho = lerDados("carrinho", []);
  const novoCarrinho = [];
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id !== id) {
      novoCarrinho.push(carrinho[i]);
    }
  }
  salvarDados("carrinho", novoCarrinho);
  montarCabecalho();
  mostrarCarrinho();
}

function mostrarResumo() {
  const totais = calcularTotais();
  document.getElementById("subtotal").textContent = formatarPreco(totais.subtotal);
  document.getElementById("desconto").textContent = "- " + formatarPreco(totais.desconto);
  document.getElementById("total").textContent = formatarPreco(totais.total);
}

function mostrarPontos() {
  const area = document.getElementById("areaPontos");
  const usuario = usuarioLogado();

  const topo = '<div class="caixa-pontos-topo">' + icone("estrela") + "<strong>Raízes Fiéis</strong>";

  if (usuario === null) {
    area.innerHTML = '<div class="caixa-pontos">' + topo + "</div>" +
      '<p><a href="login.html?voltar=carrinho">Entre na sua conta</a> para juntar pontos neste pedido.</p></div>';
    return;
  }

  if (!usuario.consentimentos.fidelidade) {
    checkout.usarPontos = false;
    salvarCheckout();
    area.innerHTML = '<div class="caixa-pontos">' + topo + "</div>" +
      '<p>Você não participa do programa. Para participar, autorize em <a href="conta.html">Minha conta</a>.</p></div>';
    return;
  }

  let html = '<div class="caixa-pontos">' + topo + "<span>" + usuario.pontos + " pts</span></div>";

  if (usuario.pontos >= PONTOS_PARA_RESGATE) {
    let marcado = "";
    if (checkout.usarPontos) {
      marcado = "checked";
    }
    html +=
      '<label class="opcao-check"><input type="checkbox" id="checkPontos" ' + marcado + ">" +
      "<span>Usar " + PONTOS_PARA_RESGATE + " pontos e ganhar " + formatarPreco(DESCONTO_DO_RESGATE) + " de desconto</span></label>";
  } else {
    checkout.usarPontos = false;
    salvarCheckout();
    html += "<p>Junte " + PONTOS_PARA_RESGATE + " pontos para ganhar " + formatarPreco(DESCONTO_DO_RESGATE) + " de desconto.</p>";
  }
  html += "</div>";
  area.innerHTML = html;

  const checkPontos = document.getElementById("checkPontos");
  if (checkPontos !== null) {
    checkPontos.onchange = function () {
      checkout.usarPontos = checkPontos.checked;
      salvarCheckout();
      mostrarResumo();
    };
  }
}

// Tipo de pedido (retirada ou consumir na loja)
const radiosTipo = document.querySelectorAll('input[name="tipo"]');
for (let i = 0; i < radiosTipo.length; i++) {
  if (radiosTipo[i].value === checkout.tipo) {
    radiosTipo[i].checked = true;
  }
  radiosTipo[i].onchange = function () {
    checkout.tipo = this.value;
    salvarCheckout();
  };
}

// Cupom
const campoCupom = document.getElementById("campoCupom");
campoCupom.value = checkout.cupom;

document.getElementById("btnCupom").onclick = function () {
  const codigo = campoCupom.value.trim().toUpperCase();

  if (codigo === "") {
    checkout.cupom = "";
    salvarCheckout();
    mostrarMensagem("mensagemCupom", "Cupom removido.", "aviso");
    mostrarResumo();
    return;
  }

  const promocao = buscarPromocao(codigo);
  if (promocao === null) {
    mostrarMensagem("mensagemCupom", "Cupom inválido ou expirado.", "erro");
    return;
  }

  const totais = calcularTotais();
  if (totais.subtotal < promocao.minimo) {
    mostrarMensagem("mensagemCupom", "Este cupom vale para pedidos a partir de " + formatarPreco(promocao.minimo) + ".", "erro");
    return;
  }

  checkout.cupom = codigo;
  salvarCheckout();
  campoCupom.value = codigo;
  mostrarMensagem("mensagemCupom", icone("check") + "<span>Cupom aplicado: " + promocao.descricao + "</span>", "sucesso");
  mostrarResumo();
};

// Continuar: no App e na Web precisa estar logado. No totem pode pedir sem cadastro.
function precisaEntrar() {
  return pegarCanal() !== "totem" && usuarioLogado() === null;
}

function atualizarAvisoLogin() {
  if (precisaEntrar()) {
    document.getElementById("avisoLogin").classList.remove("escondido");
  } else {
    document.getElementById("avisoLogin").classList.add("escondido");
  }
}

// Chamada pelo comum.js quando o modo de visualização muda
function aoTrocarModo() {
  atualizarAvisoLogin();
}

atualizarAvisoLogin();

document.getElementById("btnContinuar").onclick = function () {
  if (precisaEntrar()) {
    window.location.href = "login.html?voltar=carrinho";
    return;
  }
  window.location.href = "pagamento.html";
};

mostrarCarrinho();
