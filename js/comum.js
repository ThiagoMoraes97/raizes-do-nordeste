// Funções usadas em todas as páginas
// Como não temos back-end, os dados ficam guardados no localStorage do navegador

function lerDados(chave, valorPadrao) {
  const texto = localStorage.getItem(chave);
  if (texto === null) {
    return valorPadrao;
  }
  return JSON.parse(texto);
}

function salvarDados(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// ---------- Ícones (desenhos SVG simples, todos no mesmo estilo de traço) ----------

const icones = {
  casa: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  cardapio: '<path d="M5 3v5a2 2 0 0 0 4 0V3"/><path d="M7 3v18"/><path d="M17 21V3c-2 1.5-3 4-3 7v3h3"/>',
  carrinho: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6.2"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  local: '<path d="M12 22s7-6.4 7-12a7 7 0 0 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  recomecar: '<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
  cadeado: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  escudo: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  celular: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  totem: '<rect x="5" y="2" width="14" height="14" rx="2"/><path d="M12 16v4M8 22h8"/>',
  computador: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  estrela: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3l-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
  sacola: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  loja: '<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/>',
  pix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M8 12h8"/>',
  cartao: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  sair: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  lixeira: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
};

function icone(nome) {
  return '<svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icones[nome] + "</svg>";
}

// Troca os <span data-icone="nome"> escritos no HTML pelo desenho do ícone
function preencherIcones() {
  const elementos = document.querySelectorAll("[data-icone]");
  for (let i = 0; i < elementos.length; i++) {
    elementos[i].innerHTML = icone(elementos[i].dataset.icone);
  }
}

function htmlMarca() {
  return '<a href="index.html" class="marca">' +
    '<img src="img/logo.svg" alt="" width="40" height="40">' +
    '<span class="marca-nome">Raízes<small>do Nordeste</small></span>' +
    "</a>";
}

// Cor do selo de acordo com o status do pedido
function classeStatus(status) {
  if (status === "Recebido") {
    return "selo selo-sol";
  }
  if (status === "Em preparo") {
    return "selo selo-terracota";
  }
  if (status === "Pronto para retirada") {
    return "selo selo-verde";
  }
  if (status === "Cancelado") {
    return "selo selo-erro";
  }
  return "selo";
}

// Aviso rápido no topo da tela, some sozinho
function mostrarAvisoRapido(texto) {
  const antigo = document.querySelector(".toast");
  if (antigo !== null) {
    antigo.remove();
  }
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.innerHTML = icone("check") + "<span>" + texto + "</span>";
  document.body.appendChild(aviso);
  setTimeout(function () {
    aviso.remove();
  }, 2500);
}

function mostrarMensagem(idElemento, texto, tipo) {
  const elemento = document.getElementById(idElemento);
  elemento.innerHTML = texto;
  elemento.className = "mensagem " + tipo;
}

function esconderMensagem(idElemento) {
  document.getElementById(idElemento).className = "mensagem escondido";
}

function buscarProduto(id) {
  for (let i = 0; i < produtos.length; i++) {
    if (produtos[i].id === id) {
      return produtos[i];
    }
  }
  return null;
}

function buscarUnidade(id) {
  for (let i = 0; i < unidades.length; i++) {
    if (unidades[i].id === id) {
      return unidades[i];
    }
  }
  return null;
}

function buscarPromocao(codigo) {
  for (let i = 0; i < promocoes.length; i++) {
    if (promocoes[i].codigo === codigo) {
      return promocoes[i];
    }
  }
  return null;
}

function ehPeriodoJunino() {
  const mes = new Date().getMonth(); // 0 = janeiro, 5 = junho, 6 = julho
  return mes === 5 || mes === 6;
}

// ---------- Canal de atendimento (App, Totem ou Web) ----------

function pegarCanal() {
  return lerDados("canal", "web");
}

function nomeDoCanal(canal) {
  if (canal === "app") {
    return "Aplicativo";
  }
  if (canal === "totem") {
    return "Totem da loja";
  }
  return "Site (Web)";
}

// No totem o aparelho é compartilhado, então ao recomeçar apagamos tudo da sessão
function recomecarTotem() {
  localStorage.removeItem("sessao");
  salvarDados("carrinho", []);
  localStorage.removeItem("checkout");
  window.location.href = "index.html";
}

// ---------- Usuários ----------

function usuarioLogado() {
  const email = lerDados("sessao", null);
  if (email === null) {
    return null;
  }
  const usuarios = lerDados("usuarios", []);
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      return usuarios[i];
    }
  }
  return null;
}

function salvarUsuario(usuarioAlterado) {
  const usuarios = lerDados("usuarios", []);
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === usuarioAlterado.email) {
      usuarios[i] = usuarioAlterado;
    }
  }
  salvarDados("usuarios", usuarios);
}

function primeiroNome(nome) {
  return nome.split(" ")[0];
}

// Cria um usuário de teste para facilitar a avaliação do protótipo
// (em um sistema real a senha nunca ficaria salva assim, e sim criptografada no servidor)
function criarUsuarioDemo() {
  const usuarios = lerDados("usuarios", []);
  if (usuarios.length === 0) {
    usuarios.push({
      nome: "Maria Teste",
      email: "maria@teste.com",
      telefone: "81999990000",
      nascimento: "",
      senha: "123456",
      pontos: 150,
      consentimentos: {
        termos: true,
        fidelidade: true,
        promocoes: false,
        data: new Date().toLocaleString("pt-BR")
      }
    });
    salvarDados("usuarios", usuarios);
  }
}

// ---------- Equipe (atendente, cozinha e gerente) ----------
// A sessão da equipe é separada da sessão do cliente

function equipeLogada() {
  return lerDados("sessaoEquipe", null);
}

// Usada no início dos painéis: só deixa abrir se o perfil tiver permissão
function exigirEquipe(perfisPermitidos, painel) {
  const equipe = equipeLogada();

  if (equipe === null) {
    window.location.href = "equipe.html?destino=" + painel;
    return false;
  }

  if (!perfisPermitidos.includes(equipe.perfil)) {
    registrarAuditoria("Acesso negado", equipe.nome + " tentou abrir o painel " + painel);
    window.location.href = "equipe.html?destino=" + painel + "&negado=1";
    return false;
  }

  const nome = document.getElementById("nomeEquipe");
  if (nome !== null) {
    nome.textContent = equipe.nome;
  }
  return true;
}

function sairEquipe() {
  const equipe = equipeLogada();
  if (equipe !== null) {
    registrarAuditoria("Saída da equipe", equipe.nome + " saiu do sistema");
  }
  localStorage.removeItem("sessaoEquipe");
  window.location.href = "equipe.html";
}

// ---------- Carrinho ----------

function quantidadeNoCarrinho() {
  const carrinho = lerDados("carrinho", []);
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].quantidade;
  }
  return total;
}

function pegarCheckout() {
  return lerDados("checkout", { cupom: "", usarPontos: false, tipo: "Retirada no balcão" });
}

// Calcula subtotal, descontos (cupom + pontos) e total do carrinho
function calcularTotais() {
  const carrinho = lerDados("carrinho", []);
  const checkout = pegarCheckout();
  const usuario = usuarioLogado();

  let subtotal = 0;
  for (let i = 0; i < carrinho.length; i++) {
    const produto = buscarProduto(carrinho[i].id);
    subtotal = subtotal + produto.preco * carrinho[i].quantidade;
  }

  let descontoCupom = 0;
  const promocao = buscarPromocao(checkout.cupom);
  if (promocao !== null && subtotal >= promocao.minimo) {
    if (promocao.tipo === "percentual") {
      descontoCupom = subtotal * promocao.valor / 100;
    } else {
      descontoCupom = promocao.valor;
    }
  }

  let descontoPontos = 0;
  if (checkout.usarPontos && usuario !== null && usuario.pontos >= PONTOS_PARA_RESGATE) {
    descontoPontos = DESCONTO_DO_RESGATE;
  }

  let desconto = descontoCupom + descontoPontos;
  if (desconto > subtotal) {
    desconto = subtotal;
  }

  // Arredonda para centavos (evita valores como 14.209999 por causa das contas com decimais)
  return {
    subtotal: arredondar(subtotal),
    descontoCupom: arredondar(descontoCupom),
    descontoPontos: descontoPontos,
    desconto: arredondar(desconto),
    total: arredondar(subtotal - desconto)
  };
}

// ---------- Auditoria (cancelamentos, descontos, pagamentos, LGPD) ----------

function registrarAuditoria(acao, detalhe) {
  const lista = lerDados("auditoria", []);
  lista.push({
    data: new Date().toLocaleString("pt-BR"),
    acao: acao,
    detalhe: detalhe
  });
  salvarDados("auditoria", lista);
}

// ---------- Partes repetidas das telas ----------

function montarCabecalho() {
  const cabecalho = document.getElementById("cabecalho");
  if (cabecalho === null) {
    return;
  }

  const canal = pegarCanal();
  const usuario = usuarioLogado();
  const unidade = buscarUnidade(lerDados("unidade", null));
  const quantidade = quantidadeNoCarrinho();

  let contador = "";
  if (quantidade > 0) {
    contador = '<b class="contador">' + quantidade + "</b>";
  }

  let links = linkMenu("index.html", "casa", "Início", "");
  links += linkMenu("cardapio.html", "cardapio", "Cardápio", "");
  links += linkMenu("carrinho.html", "carrinho", "Carrinho", contador);

  if (usuario !== null) {
    links += linkMenu("conta.html", "usuario", "Olá, " + primeiroNome(usuario.nome), "");
  } else {
    links += linkMenu("login.html", "usuario", "Entrar", "");
  }

  if (canal === "totem") {
    links += '<a href="#" onclick="recomecarTotem()">' + icone("recomecar") + "<span>Recomeçar</span></a>";
  }

  let textoUnidade = "Escolha a unidade";
  let detalheUnidade = "para ver o cardápio";
  if (unidade !== null) {
    textoUnidade = unidade.nome;
    detalheUnidade = "Aberto das " + unidade.horario;
  }

  cabecalho.className = "cabecalho";
  cabecalho.innerHTML =
    htmlBarraModo() +
    '<div class="container cabecalho-linha">' + htmlMarca() + '<nav class="menu">' + links + "</nav></div>" +
    '<div class="barra-contexto"><div class="container">' +
    '<button class="botao-unidade" onclick="abrirSeletorUnidade()">' + icone("local") +
    "<span><strong>" + textoUnidade + "</strong> · " + detalheUnidade + "</span>" +
    '<span class="botao-unidade-trocar">Trocar unidade</span>' +
    "</button></div></div>";

  montarNavApp();
}

// ---------- Modo de visualização (simula os canais App, Totem e Web) ----------

function htmlBarraModo() {
  const canal = pegarCanal();
  const modos = [
    { valor: "app", nome: "App", icone: "celular" },
    { valor: "totem", nome: "Totem", icone: "totem" },
    { valor: "web", nome: "Web", icone: "computador" }
  ];

  let botoes = "";
  for (let i = 0; i < modos.length; i++) {
    let classe = "";
    if (modos[i].valor === canal) {
      classe = "ativo";
    }
    botoes += '<button class="' + classe + '" onclick="trocarModo(\'' + modos[i].valor + '\')">' + icone(modos[i].icone) + modos[i].nome + "</button>";
  }

  // Atalhos só do protótipo: acesso da equipe e guia de marca ficam fora do site do cliente.
  // Cada link tem um texto completo e um curto; no celular só o curto aparece (ver style.css)
  return '<div class="barra-modo"><div class="container">' +
    '<div class="barra-modo-links">' +
    '<span class="barra-modo-rotulo">Protótipo</span>' +
    '<a href="equipe.html">' + icone("cadeado") +
    '<span class="texto-completo">Acesso da equipe</span><span class="texto-curto">Equipe</span></a>' +
    '<a href="design-system.html" class="link-guia">' +
    '<span class="texto-completo">Guia de marca</span><span class="texto-curto">Guia</span></a>' +
    "</div>" +
    '<div class="seletor-modo" role="group" aria-label="Visualizar como">' + botoes + "</div>" +
    "</div></div>";
}

// Coloca a classe do modo no <html> para o CSS mudar a aparência
function aplicarModo() {
  // As telas da equipe (que têm .painel-topo) não mudam com o modo do cliente
  if (document.querySelector(".painel-topo") !== null) {
    return;
  }
  const raiz = document.documentElement;
  raiz.classList.remove("modo-app", "modo-totem", "modo-web");
  raiz.classList.add("modo-" + pegarCanal());
}

// Troca na hora, sem recarregar a página
function trocarModo(canal) {
  salvarDados("canal", canal);
  aplicarModo();
  montarCabecalho();
  // Algumas páginas têm regras que dependem do canal (ex.: login obrigatório)
  if (typeof aoTrocarModo === "function") {
    aoTrocarModo();
  }
  mostrarAvisoRapido("Visualizando como " + nomeDoCanal(canal));
}

// Barra de navegação de baixo, só aparece no modo App (pelo CSS)
function montarNavApp() {
  let nav = document.getElementById("navApp");
  if (nav === null) {
    nav = document.createElement("nav");
    nav.id = "navApp";
    nav.className = "nav-app";
    document.body.appendChild(nav);
  }

  let contaEndereco = "login.html";
  if (usuarioLogado() !== null) {
    contaEndereco = "conta.html";
  }

  let contador = "";
  const quantidade = quantidadeNoCarrinho();
  if (quantidade > 0) {
    contador = '<b class="contador">' + quantidade + "</b>";
  }

  nav.innerHTML =
    linkMenu("index.html", "casa", "Início", "") +
    linkMenu("cardapio.html", "cardapio", "Cardápio", "") +
    linkMenu("carrinho.html", "carrinho", "Carrinho", contador) +
    linkMenu(contaEndereco, "usuario", "Conta", "");
}

// ---------- Escolha da unidade (janela que abre em qualquer página) ----------

let destinoDepoisDaUnidade = null;

function abrirSeletorUnidade(destino) {
  let janela = document.getElementById("janelaUnidade");
  if (janela === null) {
    janela = document.createElement("dialog");
    janela.id = "janelaUnidade";
    janela.className = "janela";
    document.body.appendChild(janela);
  }

  const atual = lerDados("unidade", null);
  let lista = "";
  for (let i = 0; i < unidades.length; i++) {
    const unidade = unidades[i];
    let classe = "opcao-cartao";
    if (unidade.id === atual) {
      classe = classe + " selecionado";
    }
    let selo = '<span class="selo selo-verde">' + unidade.tipo + "</span>";
    if (unidade.tipo === "Formato reduzido") {
      selo = '<span class="selo selo-sol">' + unidade.tipo + "</span>";
    }
    lista +=
      '<button class="' + classe + '" onclick="escolherUnidade(' + unidade.id + ')">' +
      '<span class="icone-caixa">' + icone("local") + "</span>" +
      "<span><strong>" + unidade.nome + "</strong>" +
      "<small>" + unidade.cidade + "/" + unidade.estado + " · Aberto das " + unidade.horario + "</small>" +
      selo + "</span></button>";
  }

  janela.innerHTML =
    '<div class="janela-topo"><h2>Escolha a unidade</h2>' +
    '<button class="botao-fechar" onclick="fecharSeletorUnidade()" aria-label="Fechar">×</button></div>' +
    '<p class="texto-suave">Cada unidade tem o seu cardápio: algumas têm cozinha completa e outras operam em formato reduzido.</p>' +
    '<div class="grade-opcoes">' + lista + "</div>";

  destinoDepoisDaUnidade = null;
  if (destino !== undefined) {
    destinoDepoisDaUnidade = destino;
  }
  janela.showModal();
}

function fecharSeletorUnidade() {
  const janela = document.getElementById("janelaUnidade");
  if (janela !== null) {
    janela.close();
  }
}

// Usado nos botões "Pedir nesta unidade" da página inicial
function pedirNaUnidade(id) {
  destinoDepoisDaUnidade = "cardapio.html";
  escolherUnidade(id);
}

function escolherUnidade(id) {
  const atual = lerDados("unidade", null);

  // Cada unidade tem seu cardápio, então o carrinho não pode misturar unidades
  if (atual !== null && atual !== id && quantidadeNoCarrinho() > 0) {
    const confirmou = confirm("Seu carrinho tem itens de outra unidade. Trocar de unidade vai esvaziar o carrinho. Deseja continuar?");
    if (!confirmou) {
      return;
    }
    salvarDados("carrinho", []);
    localStorage.removeItem("checkout");
  }

  salvarDados("unidade", id);
  fecharSeletorUnidade();

  if (destinoDepoisDaUnidade !== null) {
    window.location.href = destinoDepoisDaUnidade;
  } else {
    window.location.reload();
  }
}

// Foto do prato
function htmlFoto(produto) {
  return '<img src="' + produto.foto + '" alt="' + produto.nome + '" loading="lazy">';
}

// Cartão de produto usado no cardápio e na página inicial
function htmlCartaoProduto(produto) {
  const unidadeId = lerDados("unidade", null);
  let classe = "produto";
  let selo = "";
  let botao = '<button class="botao-adicionar" onclick="pedirProduto(' + produto.id + ')" aria-label="Adicionar ' + produto.nome + '">' + icone("mais") + "</button>";

  if (produto.junino) {
    selo = '<span class="selo selo-verde">Junino</span>';
    if (!ehPeriodoJunino()) {
      classe = "produto indisponivel";
      botao = '<span class="selo">Só em junho e julho</span>';
    }
  }
  if (unidadeId !== null && !produto.unidades.includes(unidadeId)) {
    classe = "produto indisponivel";
    botao = '<span class="selo">Indisponível nesta unidade</span>';
  }

  return '<article class="' + classe + '">' +
    '<div class="produto-imagem">' + selo + htmlFoto(produto) + "</div>" +
    '<div class="produto-corpo">' +
    '<span class="produto-categoria">' + produto.categoria + "</span>" +
    "<h3>" + produto.nome + "</h3>" +
    "<p>" + produto.descricao + "</p>" +
    '<div class="produto-rodape"><span class="preco">' + formatarPreco(produto.preco) + "</span>" + botao + "</div>" +
    "</div>" +
    "</article>";
}

// Antes de adicionar, o cliente precisa ter escolhido a unidade
function pedirProduto(id) {
  if (lerDados("unidade", null) === null) {
    abrirSeletorUnidade();
    return;
  }
  adicionarAoCarrinho(id);
}

function irParaCardapio(categoria) {
  let endereco = "cardapio.html";
  if (categoria !== undefined) {
    endereco = "cardapio.html?categoria=" + categoria;
  }
  if (lerDados("unidade", null) === null) {
    abrirSeletorUnidade(endereco);
  } else {
    window.location.href = endereco;
  }
}

function adicionarAoCarrinho(id) {
  const carrinho = lerDados("carrinho", []);
  let achou = false;

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      carrinho[i].quantidade = carrinho[i].quantidade + 1;
      achou = true;
    }
  }
  if (!achou) {
    carrinho.push({ id: id, quantidade: 1 });
  }

  salvarDados("carrinho", carrinho);
  montarCabecalho();
  // A página do cardápio usa isso para atualizar a barra do carrinho
  if (typeof aoMudarCarrinho === "function") {
    aoMudarCarrinho();
  }

  const produto = buscarProduto(id);
  mostrarAvisoRapido(produto.nome + " no carrinho");
}

function linkMenu(endereco, nomeIcone, texto, extra) {
  let classe = "";
  const caminho = window.location.pathname;
  if (caminho.endsWith(endereco) || (endereco === "index.html" && caminho.endsWith("/"))) {
    classe = "ativo";
  }
  return '<a href="' + endereco + '" class="' + classe + '">' + icone(nomeIcone) + "<span>" + texto + "</span>" + extra + "</a>";
}

function montarRodape() {
  const rodape = document.getElementById("rodape");
  if (rodape === null) {
    return;
  }
  rodape.className = "rodape";
  rodape.innerHTML =
    '<div class="container">' +
    '<div class="rodape-grade">' +
    "<div>" + htmlMarca() + "<p>Culinária nordestina no dia a dia, com rapidez, qualidade e identidade cultural.</p></div>" +
    "<div><h4>Cliente</h4>" +
    '<a href="cardapio.html">Cardápio</a>' +
    '<a href="conta.html">Minha conta</a>' +
    '<a href="privacidade.html">Política de Privacidade</a>' +
    "</div>" +
    "<div><h4>A rede</h4>" +
    '<a href="index.html#unidades">Nossas unidades</a>' +
    '<a href="cadastro.html">Programa Raízes Fiéis</a>' +
    '<a href="index.html">Promoções</a>' +
    "</div>" +
    "</div>" +
    '<p class="rodape-final">© 2026 Raízes do Nordeste · Protótipo acadêmico com dados fictícios.</p>' +
    "</div>";
}

// Aviso de privacidade (LGPD) exibido no primeiro acesso
function mostrarAvisoLgpd() {
  if (lerDados("avisoLgpd", null) !== null) {
    return;
  }

  const aviso = document.createElement("div");
  aviso.className = "aviso-lgpd";
  aviso.innerHTML =
    '<div class="aviso-lgpd-topo">' + icone("cadeado") + "<strong>Sua privacidade é importante</strong></div>" +
    "<p>Usamos o armazenamento do navegador para guardar seu carrinho, sua unidade e seu login (essenciais). " +
    "Com sua permissão, também usaríamos dados de navegação para melhorar o cardápio (opcionais). " +
    'Saiba mais na <a href="privacidade.html">Política de Privacidade</a>.</p>' +
    '<div class="aviso-lgpd-botoes">' +
    '<button id="btnAceitarTodos" class="botao botao-pequeno">Aceitar todos</button>' +
    '<button id="btnSoEssenciais" class="botao botao-secundario botao-pequeno">Somente essenciais</button>' +
    "</div>";
  document.body.appendChild(aviso);

  document.getElementById("btnAceitarTodos").onclick = function () {
    salvarDados("avisoLgpd", { escolha: "todos", data: new Date().toLocaleString("pt-BR") });
    aviso.remove();
  };
  document.getElementById("btnSoEssenciais").onclick = function () {
    salvarDados("avisoLgpd", { escolha: "essenciais", data: new Date().toLocaleString("pt-BR") });
    aviso.remove();
  };
}

// Executa em todas as páginas
criarUsuarioDemo();
aplicarModo();
montarCabecalho();
montarRodape();
preencherIcones();
mostrarAvisoLgpd();
