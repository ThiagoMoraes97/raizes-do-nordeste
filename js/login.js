// Login (simulado com os usuários salvos no navegador)

const parametros = new URLSearchParams(window.location.search);
const voltarParaCarrinho = parametros.get("voltar") === "carrinho";

if (voltarParaCarrinho) {
  document.getElementById("avisoVoltar").classList.remove("escondido");
  document.getElementById("linkCadastro").href = "cadastro.html?voltar=carrinho";
}

document.getElementById("formLogin").onsubmit = function (evento) {
  evento.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;

  if (email === "" || senha === "") {
    mostrarMensagem("mensagemLogin", "Preencha o e-mail e a senha.", "erro");
    return;
  }

  const usuarios = lerDados("usuarios", []);
  let encontrado = null;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email && usuarios[i].senha === senha) {
      encontrado = usuarios[i];
    }
  }

  // Mensagem genérica: não dizemos se o erro foi no e-mail ou na senha (segurança)
  if (encontrado === null) {
    mostrarMensagem("mensagemLogin", "E-mail ou senha incorretos.", "erro");
    return;
  }

  salvarDados("sessao", encontrado.email);

  if (voltarParaCarrinho) {
    window.location.href = "carrinho.html";
  } else {
    window.location.href = "conta.html";
  }
};
