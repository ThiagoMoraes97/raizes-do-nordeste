// Página inicial da lanchonete

// Produtos em destaque ("mais pedidos")
const idsDestaque = [1, 4, 5, 12];

function mostrarDestaques() {
  let html = "";
  for (let i = 0; i < idsDestaque.length; i++) {
    html += htmlCartaoProduto(buscarProduto(idsDestaque[i]));
  }
  document.getElementById("listaDestaques").innerHTML = html;
}

// Chamada pelo comum.js sempre que o carrinho muda: atualiza os contadores dos destaques
function aoMudarCarrinho() {
  mostrarDestaques();
}

function mostrarCategorias() {
  // Pega cada categoria uma vez só, junto com o primeiro produto dela (para a foto)
  const categorias = [];
  const fotos = [];
  const quantidades = [];
  for (let i = 0; i < produtos.length; i++) {
    const posicao = categorias.indexOf(produtos[i].categoria);
    if (posicao === -1) {
      categorias.push(produtos[i].categoria);
      fotos.push(produtos[i]);
      quantidades.push(1);
    } else {
      quantidades[posicao]++;
    }
  }

  let html = "";
  for (let i = 0; i < categorias.length; i++) {
    let texto = quantidades[i] + " opções";
    if (quantidades[i] === 1) {
      texto = "1 opção";
    }
    html +=
      '<a href="#" class="categoria" onclick="irParaCardapio(\'' + categorias[i] + '\'); return false;">' +
      htmlFoto(fotos[i]) +
      "<span>" + categorias[i] + "</span><small>" + texto + "</small></a>";
  }
  document.getElementById("listaCategorias").innerHTML = html;
}

function mostrarPromocoes() {
  let html = "";
  for (let i = 0; i < promocoes.length; i++) {
    html +=
      '<div class="cupom">' +
      '<div class="cupom-info"><span class="selo selo-terracota">Cupom</span>' +
      "<h3>" + promocoes[i].titulo + "</h3>" +
      "<p>" + promocoes[i].descricao + "</p></div>" +
      '<div class="cupom-codigo"><small>Use o código</small><strong>' + promocoes[i].codigo + "</strong></div>" +
      "</div>";
  }
  document.getElementById("listaPromocoes").innerHTML = html;
}

function mostrarUnidades() {
  const atual = lerDados("unidade", null);
  let html = "";
  for (let i = 0; i < unidades.length; i++) {
    const unidade = unidades[i];

    let classe = "unidade";
    let textoBotao = "Pedir nesta unidade";
    if (unidade.id === atual) {
      classe = "unidade atual";
      textoBotao = "Ver cardápio";
    }

    let selo = '<span class="selo selo-verde">' + unidade.tipo + "</span>";
    if (unidade.tipo === "Formato reduzido") {
      selo = '<span class="selo selo-sol">' + unidade.tipo + "</span>";
    }

    html +=
      '<div class="' + classe + '">' +
      "<div>" + selo + "</div>" +
      "<h3>" + unidade.nome + "</h3>" +
      "<p>" + unidade.cidade + "/" + unidade.estado + "</p>" +
      "<p>Aberto das " + unidade.horario + "</p>" +
      '<button class="botao botao-secundario botao-pequeno" onclick="pedirNaUnidade(' + unidade.id + ')">' + textoBotao + "</button>" +
      "</div>";
  }
  document.getElementById("listaUnidades").innerHTML = html;
}

mostrarDestaques();
mostrarCategorias();
mostrarPromocoes();
mostrarUnidades();
preencherIcones();
