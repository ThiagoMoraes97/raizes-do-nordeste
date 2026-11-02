// Login da equipe (atendente, cozinha e gerente)

const parametros = new URLSearchParams(window.location.search);
const destino = parametros.get("destino"); // "cozinha", "gerente" ou nenhum

function nomeDoPainel(painel) {
  if (painel === "gerente") {
    return "Painel do Gerente";
  }
  return "Painel da Cozinha";
}

// Para onde mandar depois do login, respeitando o perfil
function irParaPainel(equipe) {
  if (destino === "gerente" && equipe.perfil !== "gerente") {
    registrarAuditoria("Acesso negado", equipe.nome + " tentou abrir o painel gerente");
    mostrarMensagem("mensagemEquipe", icone("cadeado") + "<span>Acesso negado: o seu perfil não tem permissão para o Painel do Gerente.</span>", "erro");
    mostrarConectado();
    return;
  }
  if (destino === "gerente" || (destino === null && equipe.perfil === "gerente")) {
    window.location.href = "gerente.html";
  } else {
    window.location.href = "cozinha.html";
  }
}

function mostrarConectado() {
  const equipe = equipeLogada();
  if (equipe === null) {
    return;
  }
  document.getElementById("areaLogin").classList.add("escondido");
  document.getElementById("areaConectado").classList.remove("escondido");
  document.getElementById("textoConectado").textContent = "Conectado como " + equipe.nome + ".";

  // Só o gerente vê o botão do painel de relatórios
  if (equipe.perfil !== "gerente") {
    document.getElementById("linkGerente").classList.add("escondido");
  }
}

// Mensagens de quem chegou aqui vindo de um painel
if (parametros.get("negado") === "1") {
  mostrarMensagem("mensagemEquipe", icone("cadeado") + "<span>Acesso negado: o seu perfil não tem permissão para o " + nomeDoPainel(destino) + ". Entre com um usuário que tenha acesso.</span>", "erro");
} else if (destino !== null) {
  mostrarMensagem("mensagemEquipe", icone("info") + "<span>Entre com seu usuário da equipe para abrir o " + nomeDoPainel(destino) + ".</span>", "info");
}

mostrarConectado();

document.getElementById("formEquipe").onsubmit = function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;

  if (usuario === "" || senha === "") {
    mostrarMensagem("mensagemEquipe", "Preencha o usuário e a senha.", "erro");
    return;
  }

  let encontrado = null;
  for (let i = 0; i < funcionarios.length; i++) {
    if (funcionarios[i].usuario === usuario && funcionarios[i].senha === senha) {
      encontrado = funcionarios[i];
    }
  }

  if (encontrado === null) {
    mostrarMensagem("mensagemEquipe", "Usuário ou senha incorretos.", "erro");
    return;
  }

  // Guarda só o necessário (a senha não vai para a sessão)
  const equipe = { usuario: encontrado.usuario, nome: encontrado.nome, perfil: encontrado.perfil };
  salvarDados("sessaoEquipe", equipe);
  registrarAuditoria("Acesso da equipe", equipe.nome + " entrou no sistema");
  irParaPainel(equipe);
};
