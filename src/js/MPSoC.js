//const json = require('./mpsoc.json');
const prompt = require('prompt-sync')();
const fs = require('fs');

const dados = fs.readFileSync('mpsoc.json', 'utf8');
const objeto = JSON.parse(dados);

const posicaoAplicacao = prompt('Deseja simular a aplicação 0 ou 1?');
const aplicacao = objeto.aplicacoes[posicaoAplicacao]; // Acessando a primeira aplicação
const grafo_tarefas = aplicacao.grafo_tarefas; // Acessando o grafo de tarefas da primeira aplicação

let largura = parseInt(prompt('Qual a largura da matriz (máximo 9)?'));
let altura = parseInt(prompt('Qual a altura da matriz (máximo 9)?'));

while (largura <= 0 || largura > 9 || altura <= 0 || altura > 9) {
  console.log('O tamanho máximo para a matriz é 9x9');
  largura = parseInt(prompt('Qual a largura da matriz (máximo 9)?'));
  altura = parseInt(prompt('Qual a altura da matriz (máximo 9)?'));
};

const tarefas = [];

while (true) {
  const nomeTarefa = prompt('Digite o nome da tarefa ou "parar" para parar ');
  if (nomeTarefa.toLowerCase() === 'parar') {
    break;
  }
  let posicaoX = parseInt(prompt('Digite a posição X da tarefa:'));
  let posicaoY = parseInt(prompt('Digite a posição Y da tarefa:'));

  while (posicaoX < 0 || posicaoX >= largura || posicaoY < 0 || posicaoY >= altura) {
    console.log("As coordenadas do source estão fora dos limites da matriz!");
    posicaoX = parseInt(prompt('Qual a posição de source no eixo X?'));
    posicaoY = parseInt(prompt('Qual a posição de source no eixo Y?'));
  };

  const tarefa = {
    nome: nomeTarefa,
    posicaoX: posicaoX,
    posicaoY: posicaoY
  };

  tarefas.push(tarefa);
}

//monta a matriz e imprime na tela com os valores 
const matriz = [];
for (let i = 0; i < largura; i++) {
  matriz[i] = [];
  for (let j = 0; j < altura; j++) {
    let tarefaEncontrada = false;
    for (let k = 0; k < tarefas.length; k++) {
      const tarefa = tarefas[k];
      if (tarefa.posicaoX === i && tarefa.posicaoY === j) {
        matriz[i][j] = tarefa.nome;
        tarefaEncontrada = true;
        break;
      }
    }
    if (!tarefaEncontrada) {
      matriz[i][j] = null;
    }
  }
}

console.log(matriz);

//localiza os inputs no json
grafo_tarefas.forEach((tarefa) => {
  let source = tarefa.tarefa_origem;
  let target = tarefa.tarefa_destino;
  let custo = tarefa.quantidade_pacotes;

  let tarefaSource = tarefas.find((t) => t.nome.toUpperCase() === source); //compara os imputs com o arquivo json
  let tarefaTarget = tarefas.find((t) => t.nome.toUpperCase() === target);

  if (tarefaTarget) {
    bfs([tarefaSource.posicaoX, tarefaSource.posicaoY], [tarefaTarget.posicaoX, tarefaTarget.posicaoY], custo);
  }
})

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