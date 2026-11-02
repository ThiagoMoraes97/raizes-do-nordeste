// Painel da cozinha/atendente: avança o status dos pedidos ou cancela

const proximoStatus = {
  "Recebido": "Em preparo",
  "Em preparo": "Pronto para retirada",
  "Pronto para retirada": "Entregue"
};

const filtroUnidade = document.getElementById("filtroUnidade");

function preencherFiltro() {
  let html = '<option value="0">Todas as unidades</option>';
  for (let i = 0; i < unidades.length; i++) {
    html += '<option value="' + unidades[i].id + '">' + unidades[i].nome + "</option>";
  }
  filtroUnidade.innerHTML = html;
  filtroUnidade.onchange = mostrarPedidos;
}

// Texto do botão de cada etapa
const textoDoBotao = {
  "Recebido": "Iniciar preparo",
  "Em preparo": "Marcar como pronto",
  "Pronto para retirada": "Entregue ao cliente"
};

function mostrarPedidos() {
  const pedidos = lerDados("pedidos", []);
  const unidadeFiltro = Number(filtroUnidade.value);

  // Uma coluna para cada status, como um quadro de produção
  let recebidos = "";
  let emPreparo = "";
  let prontos = "";
  let qtdRecebidos = 0;
  let qtdPreparo = 0;
  let qtdProntos = 0;

  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];

    if (pedido.status === "Entregue" || pedido.status === "Cancelado") {
      continue;
    }
    if (unidadeFiltro !== 0 && pedido.unidadeId !== unidadeFiltro) {
      continue;
    }

    let itens = "";
    for (let j = 0; j < pedido.itens.length; j++) {
      itens += "<li>" + pedido.itens[j].quantidade + "x " + pedido.itens[j].nome + "</li>";
    }

    const cartao =
      '<div class="pedido-cozinha">' +
      '<div class="pedido-cozinha-topo"><strong>#' + pedido.numero + "</strong><span>" + pedido.clienteNome + "</span></div>" +
      '<p class="texto-pequeno" style="margin: 4px 0 0;">' + buscarUnidade(pedido.unidadeId).nome + " · " + nomeDoCanal(pedido.canal) + " · " + pedido.tipo + "</p>" +
      "<ul>" + itens + "</ul>" +
      '<div class="pedido-cozinha-botoes">' +
      '<button class="botao botao-pequeno" onclick="avancarStatus(' + pedido.id + ')">' + textoDoBotao[pedido.status] + "</button>" +
      '<button class="botao botao-fantasma botao-pequeno" onclick="cancelarPedido(' + pedido.id + ')">Cancelar</button>' +
      "</div>" +
      "</div>";

    if (pedido.status === "Recebido") {
      recebidos += cartao;
      qtdRecebidos++;
    } else if (pedido.status === "Em preparo") {
      emPreparo += cartao;
      qtdPreparo++;
    } else {
      prontos += cartao;
      qtdProntos++;
    }
  }

  const vazio = '<p class="coluna-vazia">Nenhum pedido aqui.</p>';
  if (recebidos === "") {
    recebidos = vazio;
  }
  if (emPreparo === "") {
    emPreparo = vazio;
  }
  if (prontos === "") {
    prontos = vazio;
  }

  document.getElementById("colunaRecebido").innerHTML = recebidos;
  document.getElementById("colunaPreparo").innerHTML = emPreparo;
  document.getElementById("colunaPronto").innerHTML = prontos;
  document.getElementById("contaRecebido").textContent = qtdRecebidos;
  document.getElementById("contaPreparo").textContent = qtdPreparo;
  document.getElementById("contaPronto").textContent = qtdProntos;
}

function avancarStatus(id) {
  const pedidos = lerDados("pedidos", []);
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id === id) {
      pedidos[i].status = proximoStatus[pedidos[i].status];
    }
  }
  salvarDados("pedidos", pedidos);
  mostrarPedidos();
}

function cancelarPedido(id) {
  const motivo = prompt("Informe o motivo do cancelamento:");
  if (motivo === null || motivo.trim() === "") {
    alert("O cancelamento precisa de um motivo (fica registrado na auditoria).");
    return;
  }

  const pedidos = lerDados("pedidos", []);
  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id === id) {
      pedidos[i].status = "Cancelado";
      pedidos[i].motivoCancelamento = motivo;

      // Tira os pontos que o cliente ganhou e devolve os que ele usou nesse pedido
      if (pedidos[i].clienteEmail !== null) {
        const usuarios = lerDados("usuarios", []);
        for (let j = 0; j < usuarios.length; j++) {
          if (usuarios[j].email === pedidos[i].clienteEmail) {
            usuarios[j].pontos = usuarios[j].pontos - pedidos[i].pontosGanhos + pedidos[i].pontosUsados;
            if (usuarios[j].pontos < 0) {
              usuarios[j].pontos = 0;
            }
          }
        }
        salvarDados("usuarios", usuarios);
      }

      registrarAuditoria("Cancelamento", "Pedido nº " + pedidos[i].numero + " - motivo: " + motivo);
      registrarAuditoria("Estorno solicitado", "Pedido nº " + pedidos[i].numero + " - " + formatarPreco(pedidos[i].total) + " enviado ao serviço de pagamento");
    }
  }
  salvarDados("pedidos", pedidos);
  mostrarPedidos();
}

// Atendente, cozinha e gerente podem usar este painel
if (exigirEquipe(["atendente", "cozinha", "gerente"], "cozinha")) {
  // O link para os relatórios só aparece para o gerente
  if (equipeLogada().perfil !== "gerente") {
    document.getElementById("linkPainelGerente").classList.add("escondido");
  }
  preencherFiltro();
  mostrarPedidos();
  // Atualiza a lista a cada 3 segundos para mostrar pedidos novos
  setInterval(mostrarPedidos, 3000);
}
