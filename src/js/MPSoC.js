//const json = require('./mpsoc.json');
const prompt = require('prompt-sync')();
const fs = require('fs');

const dados = fs.readFileSync('mpsoc.json', 'utf8');
const objeto = JSON.parse(dados);

const posicaoAplicacao = 0;
const aplicacao = objeto.aplicacoes[posicaoAplicacao]; // Acessando a primeira aplicação
const grafo_tarefas = aplicacao.grafo_tarefas; // Acessando o grafo de tarefas da primeira aplicação

let largura = 5;
let altura = 5;

let meioX = Math.floor(largura / 2);
let meioY = Math.floor(altura / 2);

//monta a matriz e imprime na tela com os valores 
const matriz = [];
for (let i = 0; i < largura; i++) {
  matriz[i] = [];
  for (let j = 0; j < altura; j++) {
    matriz[i][j] = null;
  }
}

const posMeio = [meioX, meioY];

if (matriz[meioX][meioY] == null) {
  matriz[meioX][meioY] = grafo_tarefas[0].tarefa_origem;
};

//localiza os inputs no json
grafo_tarefas.forEach((tarefa) => {
  let source = tarefa.tarefa_origem;
  let target = tarefa.tarefa_destino;
  let custo = tarefa.quantidade_pacotes;

  const sourceExiste = srcExt(matriz, source);
  const targetExiste = tgtExt(matriz, target);

  getVizinhos([meioX, meioY])

});

function srcExt(matriz, source){
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] == source) {
        return true;
      }
    }
  }
  return false;
};

function tgtExt(matriz, target){
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] == target) {
        return true;
      }
    }
  }
  return false;
};

// function mapeamento(tarefa){
//   let posVazia = posicaoVazia();
//   matriz[posVazia.posX][posVazia.posY] = tarefa;
// }

// function posicaoVazia(){
//   const vizinhos = getVizinhos([meioX, meioY], largura, altura);
//   return vizinhos.find((vizinho) => {
//     return matriz[vizinho.posX][vizinho.posY] === null;
//   })
// };

// Definindo uma função que retorna os vizinhos de um nó
function getVizinhos(node) {
  const vizinhos = [];
  const x = parseInt(node[0]);
  const y = parseInt(node[1]);

  if (x > 0) {
    vizinhos.push([x - 1, y]); // vizinho acima
  }
  if (x < largura - 1) {
    vizinhos.push([x + 1, y]); // vizinho abaixo
  }
  if (y > 0) {
    vizinhos.push([x, y - 1]); // vizinho à esquerda
  }
  if (y < altura - 1) {
    vizinhos.push([x, y + 1]); // vizinho à direita
  }
  console.log(vizinhos);
  return vizinhos;

}

// percorre a matriz
function bfs(source, target, custo) {
  const queue = [source];
  const visitados = new Set([source.toString()]); //cria uma lista com componentes unicos (se existirem 1 e 1 a lista será [1])
  const caminho = new Map(); //cria um objeto chave = valor, onde a chave pode ser qualquer coisa
  caminho.set(source.toString(), null);

  while (queue.length > 0) {
    const atual = queue.shift();

    if (atual.toString() == target.toString()) {
      // Chegamos ao target, retornamos o caminho
      const result = [];
      let node = target.toString();

      while (node !== null) {
        let [x, y] = node.split(",").map((coord) => parseInt(coord));
        result.unshift({ x, y });

        node = caminho.get(node);
      }

      result.forEach((caminho) => {
        if (typeof matriz[caminho.x][caminho.y] === 'number') {
          matriz[caminho.x][caminho.y] += custo;
        } else {
          matriz[caminho.x][caminho.y] = custo;
        }

      });

    }

    const vizinhos = getVizinhos(atual);

    for (let i = 0; i < vizinhos.length; i++) {
      const vizinho = vizinhos[i];

      if (!visitados.has(vizinho.toString())) {
        queue.push(vizinho);
        visitados.add(vizinho.toString());
        caminho.set(vizinho.toString(), atual.toString());
      }
    }
  }

  // Não foi possível chegar ao target
  return null;
}

console.log(matriz);