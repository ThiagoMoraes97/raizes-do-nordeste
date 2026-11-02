// Cardápio: mostra só os produtos da unidade escolhida

const unidadeId = lerDados("unidade", null);
const unidade = buscarUnidade(unidadeId);

// Permite abrir já filtrado, ex.: cardapio.html?categoria=Bebidas
const parametros = new URLSearchParams(window.location.search);
let categoriaAtual = "Todos";
if (parametros.get("categoria") !== null) {
  categoriaAtual = parametros.get("categoria");
}

function produtoEhDaUnidade(produto) {
  return produto.unidades.includes(unidadeId);
}

function montarFiltros() {
  const categorias = ["Todos"];
  for (let i = 0; i < produtos.length; i++) {
    if (produtoEhDaUnidade(produtos[i]) && !categorias.includes(produtos[i].categoria)) {
      categorias.push(produtos[i].categoria);
    }
  }

  // Se a categoria da URL não existe nesta unidade, volta para "Todos"
  if (!categorias.includes(categoriaAtual)) {
    categoriaAtual = "Todos";
  }

  let html = "";
  for (let i = 0; i < categorias.length; i++) {
    let classe = "chip";
    if (categorias[i] === categoriaAtual) {
      classe = "chip ativo";
    }
    html += '<button class="' + classe + '" onclick="filtrar(\'' + categorias[i] + '\')">' + categorias[i] + "</button>";
  }
  document.getElementById("filtros").innerHTML = html;
}

function filtrar(categoria) {
  categoriaAtual = categoria;
  montarFiltros();
  mostrarProdutos();
}

function mostrarProdutos() {
  let html = "";
  let temJunino = false;

  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];

    if (!produtoEhDaUnidade(produto)) {
      continue;
    }
    if (categoriaAtual !== "Todos" && produto.categoria !== categoriaAtual) {
      continue;
    }
    if (produto.junino && !ehPeriodoJunino()) {
      temJunino = true;
    }

    html += htmlCartaoProduto(produto);
  }

  if (html === "") {
    html = "<p>Nenhum produto nesta categoria.</p>";
  }
  document.getElementById("listaProdutos").innerHTML = html;

  if (temJunino) {
    mostrarMensagem("avisoJunino", icone("info") + "<span>Os produtos juninos ficam disponíveis só no período junino (junho e julho).</span>", "aviso");
  } else {
    esconderMensagem("avisoJunino");
  }
}

// Barra fixa no rodapé da tela com o total do carrinho
function atualizarBarraCarrinho() {
  const barra = document.getElementById("barraCarrinho");
  const quantidade = quantidadeNoCarrinho();

  if (quantidade === 0) {
    barra.classList.add("escondido");
    return;
  }

  let texto = quantidade + " itens";
  if (quantidade === 1) {
    texto = "1 item";
  }

  const totais = calcularTotais();
  barra.innerHTML =
    "<span><small>" + texto + "</small><strong>" + formatarPreco(totais.subtotal) + "</strong></span>" +
    '<span class="botao botao-sol botao-pequeno">Ver carrinho</span>';
  barra.classList.remove("escondido");
}

// Chamada pelo comum.js sempre que o carrinho muda: atualiza os contadores dos cartões e a barra
function aoMudarCarrinho() {
  mostrarProdutos();
  atualizarBarraCarrinho();
}

if (unidade === null) {
  // Sem unidade não dá para saber o cardápio: pede para escolher
  document.getElementById("nomeUnidade").textContent = "Escolha uma unidade";
  document.getElementById("infoUnidade").textContent = "O cardápio muda de acordo com a unidade.";
  document.getElementById("listaProdutos").innerHTML =
    '<div class="cartao estado-vazio" style="grid-column: 1 / -1;">' +
    '<span class="estado-vazio-icone">' + icone("local") + "</span>" +
    "<h2>Onde você vai retirar?</h2>" +
    '<p class="texto-suave">Escolha a unidade para ver o cardápio e os preços.</p>' +
    '<button class="botao" onclick="abrirSeletorUnidade()">Escolher unidade</button>' +
    "</div>";
  abrirSeletorUnidade();
} else {
  document.getElementById("nomeUnidade").textContent = unidade.nome;
  document.getElementById("infoUnidade").textContent = unidade.cidade + "/" + unidade.estado + " · " + unidade.tipo + " · Aberto das " + unidade.horario;
  montarFiltros();
  mostrarProdutos();
  atualizarBarraCarrinho();
}
