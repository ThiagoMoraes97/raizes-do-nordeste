// Minha conta: fidelidade, pedidos, dados pessoais e direitos da LGPD

const usuario = usuarioLogado();
if (usuario === null) {
  window.location.href = "login.html";
}

function meusPedidos() {
  const pedidos = lerDados("pedidos", []);
  const lista = [];
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].clienteEmail === usuario.email) {
      lista.push(pedidos[i]);
    }
  }
  return lista;
}

function mostrarFidelidade() {
  const area = document.getElementById("areaFidelidade");
  if (!usuario.consentimentos.fidelidade) {
    area.innerHTML =
      '<span class="sobretitulo">Programa Raízes Fiéis</span>' +
      "<h2>Você ainda não participa</h2>" +
      '<p style="margin: 0;">Para juntar pontos e ganhar descontos, autorize o programa em "Privacidade".</p>';
    return;
  }

  const faltam = PONTOS_PARA_RESGATE - usuario.pontos;
  let texto = "Faltam " + faltam + " pontos para o próximo desconto.";
  if (faltam <= 0) {
    texto = "Você já pode trocar " + PONTOS_PARA_RESGATE + " pontos por " + formatarPreco(DESCONTO_DO_RESGATE) + " de desconto no carrinho.";
  }

  // Barra de progresso até o próximo resgate (no máximo 100%)
  let percentual = usuario.pontos / PONTOS_PARA_RESGATE * 100;
  if (percentual > 100) {
    percentual = 100;
  }

  area.innerHTML =
    '<span class="sobretitulo">Programa Raízes Fiéis</span>' +
    '<p class="pontos-grande">' + usuario.pontos + " <small>pontos</small></p>" +
    '<div class="barra-progresso"><div style="width: ' + percentual + '%;"></div></div>' +
    "<p>" + texto + "</p>" +
    '<p class="texto-pequeno" style="color: #CDB9A3; margin: 0;">Cada R$ 1,00 gasto vale 1 ponto. ' + PONTOS_PARA_RESGATE + " pontos = " + formatarPreco(DESCONTO_DO_RESGATE) + " de desconto.</p>";
}

function mostrarPedidos() {
  const lista = meusPedidos();
  if (lista.length === 0) {
    document.getElementById("listaPedidos").innerHTML = '<p>Você ainda não fez pedidos. <a href="cardapio.html">Ver cardápio</a></p>';
    return;
  }

  let html = "";
  // Do mais novo para o mais antigo
  for (let i = lista.length - 1; i >= 0; i--) {
    html +=
      '<div class="linha-pedido">' +
      "<div><strong>Pedido nº " + lista[i].numero + "</strong><small>" + lista[i].data + " · " + formatarPreco(lista[i].total) + "</small></div>" +
      '<span class="' + classeStatus(lista[i].status) + '">' + lista[i].status + "</span>" +
      '<a href="pedido.html?id=' + lista[i].id + '" class="botao botao-fantasma botao-pequeno">Ver</a>' +
      "</div>";
  }
  document.getElementById("listaPedidos").innerHTML = html;
}

function mostrarDados() {
  document.getElementById("avatar").textContent = usuario.nome.charAt(0).toUpperCase();
  document.getElementById("nomePerfil").textContent = usuario.nome;
  document.getElementById("nome").value = usuario.nome;
  document.getElementById("telefone").value = usuario.telefone;
  document.getElementById("email").value = usuario.email;
  document.getElementById("checkFidelidade").checked = usuario.consentimentos.fidelidade;
  document.getElementById("checkPromocoes").checked = usuario.consentimentos.promocoes;
  document.getElementById("dataConsentimento").textContent = "Última atualização das preferências: " + usuario.consentimentos.data;
}

// Direito de correção dos dados
document.getElementById("btnSalvarDados").onclick = function () {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.replace(/\D/g, "");

  if (nome.length < 3 || !nome.includes(" ")) {
    mostrarMensagem("mensagemDados", "Informe seu nome completo.", "erro");
    return;
  }
  if (telefone.length < 10 || telefone.length > 11) {
    mostrarMensagem("mensagemDados", "Informe um celular válido com DDD.", "erro");
    return;
  }

  usuario.nome = nome;
  usuario.telefone = telefone;
  salvarUsuario(usuario);
  montarCabecalho();
  mostrarDados();
  mostrarMensagem("mensagemDados", "Dados atualizados.", "sucesso");
};

// Alterar ou revogar consentimentos
document.getElementById("btnSalvarPrivacidade").onclick = function () {
  usuario.consentimentos.fidelidade = document.getElementById("checkFidelidade").checked;
  usuario.consentimentos.promocoes = document.getElementById("checkPromocoes").checked;
  usuario.consentimentos.data = new Date().toLocaleString("pt-BR");

  // Sem fidelidade não há motivo para guardar a data de nascimento
  if (!usuario.consentimentos.fidelidade) {
    usuario.nascimento = "";
  }

  salvarUsuario(usuario);
  registrarAuditoria("Consentimento alterado", "Cliente atualizou as preferências de privacidade");
  mostrarDados();
  mostrarFidelidade();
  mostrarMensagem("mensagemPrivacidade", "Preferências salvas.", "sucesso");
};

// Direito de acesso / portabilidade: baixa um arquivo com os dados do cliente
document.getElementById("btnBaixarDados").onclick = function () {
  const dados = {
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
    nascimento: usuario.nascimento,
    pontos: usuario.pontos,
    consentimentos: usuario.consentimentos,
    pedidos: meusPedidos()
  };

  const arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "meus-dados-raizes-do-nordeste.json";
  link.click();
};

// Direito de exclusão: apaga a conta e anonimiza os pedidos
// (os pedidos continuam existindo para os relatórios da loja, mas sem identificar o cliente)
document.getElementById("btnExcluirConta").onclick = function () {
  const confirmou = confirm("Tem certeza? Sua conta e seus pontos serão apagados e isso não pode ser desfeito.");
  if (!confirmou) {
    return;
  }

  const usuarios = lerDados("usuarios", []);
  const novaLista = [];
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email !== usuario.email) {
      novaLista.push(usuarios[i]);
    }
  }
  salvarDados("usuarios", novaLista);

  const pedidos = lerDados("pedidos", []);
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].clienteEmail === usuario.email) {
      pedidos[i].clienteEmail = null;
      pedidos[i].clienteNome = "Anônimo";
    }
  }
  salvarDados("pedidos", pedidos);

  registrarAuditoria("Conta excluída", "Dados pessoais apagados e pedidos anonimizados a pedido do cliente");
  localStorage.removeItem("sessao");
  alert("Sua conta foi excluída.");
  window.location.href = "index.html";
};

document.getElementById("btnSair").onclick = function () {
  localStorage.removeItem("sessao");
  window.location.href = "index.html";
};

// Só monta a tela se tiver alguém logado (senão a página já está indo para o login)
if (usuario !== null) {
  mostrarFidelidade();
  mostrarPedidos();
  mostrarDados();
}
