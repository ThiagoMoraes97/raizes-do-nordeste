// Cadastro de cliente com validações e consentimento (LGPD)

const parametros = new URLSearchParams(window.location.search);

document.getElementById("formCadastro").onsubmit = function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const telefone = document.getElementById("telefone").value.replace(/\D/g, ""); // deixa só os números
  const nascimento = document.getElementById("nascimento").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const aceiteTermos = document.getElementById("aceiteTermos").checked;
  const aceiteFidelidade = document.getElementById("aceiteFidelidade").checked;
  const aceitePromocoes = document.getElementById("aceitePromocoes").checked;

  const erros = [];

  if (nome.length < 3 || !nome.includes(" ")) {
    erros.push("Informe seu nome completo.");
  }
  if (!email.includes("@") || !email.includes(".")) {
    erros.push("Informe um e-mail válido.");
  }
  if (telefone.length < 10 || telefone.length > 11) {
    erros.push("Informe um celular válido com DDD.");
  }
  if (senha.length < 6) {
    erros.push("A senha precisa ter pelo menos 6 caracteres.");
  }
  if (senha !== confirmarSenha) {
    erros.push("As senhas não são iguais.");
  }
  if (!aceiteTermos) {
    erros.push("Para criar a conta você precisa aceitar os Termos de Uso e a Política de Privacidade.");
  }

  const usuarios = lerDados("usuarios", []);
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      erros.push("Este e-mail já está cadastrado.");
    }
  }

  if (erros.length > 0) {
    mostrarMensagem("mensagemCadastro", icone("info") + "<span>" + erros.join("<br>") + "</span>", "erro");
    return;
  }

  // Data de nascimento só é guardada se o cliente aceitou o programa de fidelidade
  let nascimentoSalvo = "";
  if (aceiteFidelidade) {
    nascimentoSalvo = nascimento;
  }

  usuarios.push({
    nome: nome,
    email: email,
    telefone: telefone,
    nascimento: nascimentoSalvo,
    senha: senha,
    pontos: 0,
    consentimentos: {
      termos: true,
      fidelidade: aceiteFidelidade,
      promocoes: aceitePromocoes,
      data: new Date().toLocaleString("pt-BR")
    }
  });
  salvarDados("usuarios", usuarios);
  salvarDados("sessao", email);

  if (parametros.get("voltar") === "carrinho") {
    window.location.href = "carrinho.html";
  } else {
    window.location.href = "conta.html";
  }
};
