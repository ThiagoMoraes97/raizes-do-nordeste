// Dados mockados (simulam o que viria da API do back-end)

const unidades = [
  {
    id: 1,
    nome: "Recife - Boa Viagem",
    cidade: "Recife",
    estado: "PE",
    tipo: "Cozinha completa",
    horario: "06h às 22h"
  },
  {
    id: 2,
    nome: "Salvador - Barra",
    cidade: "Salvador",
    estado: "BA",
    tipo: "Cozinha completa",
    horario: "06h às 21h"
  },
  {
    id: 3,
    nome: "Fortaleza - Aldeota",
    cidade: "Fortaleza",
    estado: "CE",
    tipo: "Cozinha completa",
    horario: "07h às 21h"
  },
  {
    id: 4,
    nome: "Caruaru - Centro",
    cidade: "Caruaru",
    estado: "PE",
    tipo: "Formato reduzido",
    horario: "06h às 14h"
  }
];

// "foto" = foto do prato (em img/fotos)
// "unidades" = em quais lojas o produto é vendido
// "junino" = só aparece disponível em junho e julho
const produtos = [
  {
    id: 1,
    nome: "Tapioca de carne de sol com queijo coalho",
    descricao: "Tapioca recheada com carne de sol desfiada e queijo coalho.",
    categoria: "Tapiocas",
    preco: 18.9,
    foto: "img/fotos/tapioca-carne.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 2,
    nome: "Tapioca de coco com leite condensado",
    descricao: "Tapioca doce com coco ralado fresco.",
    categoria: "Tapiocas",
    preco: 12.5,
    foto: "img/fotos/tapioca-coco.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 3,
    nome: "Cuscuz recheado com charque",
    descricao: "Cuscuz de milho com charque acebolada e manteiga de garrafa.",
    categoria: "Cuscuz",
    preco: 16.0,
    foto: "img/fotos/cuscuz-charque.jpg",
    unidades: [1, 2, 3],
    junino: false
  },
  {
    id: 4,
    nome: "Cuscuz com ovo",
    descricao: "Cuscuz de milho com ovo frito e manteiga de garrafa.",
    categoria: "Cuscuz",
    preco: 11.0,
    foto: "img/fotos/cuscuz-ovo.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 5,
    nome: "Bolo de macaxeira",
    descricao: "Fatia de bolo de macaxeira caseiro.",
    categoria: "Bolos",
    preco: 7.5,
    foto: "img/fotos/bolo-macaxeira.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 6,
    nome: "Bolo de milho",
    descricao: "Fatia de bolo de milho verde.",
    categoria: "Bolos",
    preco: 7.0,
    foto: "img/fotos/bolo-milho.jpg",
    unidades: [1, 2, 3, 4],
    junino: true
  },
  {
    id: 7,
    nome: "Pamonha",
    descricao: "Pamonha doce feita com milho verde.",
    categoria: "Juninos",
    preco: 9.0,
    foto: "img/fotos/pamonha.jpg",
    unidades: [1, 3, 4],
    junino: true
  },
  {
    id: 8,
    nome: "Canjica",
    descricao: "Canjica cremosa com canela.",
    categoria: "Juninos",
    preco: 8.5,
    foto: "img/fotos/canjica.jpg",
    unidades: [1, 2, 3],
    junino: true
  },
  {
    id: 9,
    nome: "Suco de cajá",
    descricao: "Suco natural de cajá (400 ml).",
    categoria: "Bebidas",
    preco: 8.0,
    foto: "img/fotos/suco-caja.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 10,
    nome: "Suco de graviola",
    descricao: "Suco natural de graviola (400 ml).",
    categoria: "Bebidas",
    preco: 8.5,
    foto: "img/fotos/suco-graviola.jpg",
    unidades: [1, 2, 3],
    junino: false
  },
  {
    id: 11,
    nome: "Café coado",
    descricao: "Café passado na hora (200 ml).",
    categoria: "Bebidas",
    preco: 4.5,
    foto: "img/fotos/cafe.jpg",
    unidades: [1, 2, 3, 4],
    junino: false
  },
  {
    id: 12,
    nome: "Café da manhã completo",
    descricao: "Cuscuz com ovo, queijo coalho assado, bolo de macaxeira e café.",
    categoria: "Combos",
    preco: 29.9,
    foto: "img/fotos/combo.jpg",
    unidades: [1, 2, 3],
    junino: false
  }
];

// Cupons e campanhas
const promocoes = [
  {
    codigo: "RAIZES10",
    titulo: "10% no seu pedido",
    descricao: "10% de desconto em qualquer pedido.",
    tipo: "percentual",
    valor: 10,
    minimo: 0
  },
  {
    codigo: "CAFE5",
    titulo: "R$ 5 no café da manhã",
    descricao: "R$ 5,00 de desconto em pedidos a partir de R$ 30,00.",
    tipo: "valor",
    valor: 5,
    minimo: 30
  }
];

// Usuários da equipe (dados de teste do protótipo)
// perfil "atendente" e "cozinha" usam o Painel da Cozinha; "gerente" acessa tudo
const funcionarios = [
  { usuario: "atendente", senha: "1234", nome: "Ana (Atendente)", perfil: "atendente" },
  { usuario: "cozinha", senha: "1234", nome: "José (Cozinha)", perfil: "cozinha" },
  { usuario: "gerente", senha: "1234", nome: "Carla (Gerente)", perfil: "gerente" }
];

// Regras do programa de fidelidade "Raízes Fiéis"
const PONTOS_PARA_RESGATE = 100;
const DESCONTO_DO_RESGATE = 10;
