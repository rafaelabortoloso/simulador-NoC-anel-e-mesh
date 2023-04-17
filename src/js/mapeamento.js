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

  let sourceExiste = false;
  let targetExiste = false;
  for (let i = 0; i < largura; i++) {
    for (let j = 0; j < altura; j++) {
      if (matriz[i][j] == source) {
        sourceExiste = true;
        break;
      } else if (matriz[i][j] == target) {
        targetExiste = true;
        break;
      }
    }
    if (sourceExiste && targetExiste) {
      break;
    }
  }

  // se a tarefa ainda não está na matriz, inseri-la próxima à sua tarefa comunicante
  if (!sourceExiste || !targetExiste) {
    let posComunicante;
    if (source != null) {
      posComunicante = encontrar_posicao_tarefa(matriz, source);
    } else if (target != null) {
      posComunicante = encontrar_posicao_tarefa(matriz, target);
    // } else {
    //   // tarefa não tem comunicante, inserir na posição central da matriz
    //   posComunicante = { i: Math.floor(n_linhas / 2), j: Math.floor(n_colunas / 2) };
    }

    let posDisponivel = encontrar_posicao_disponivel(matriz, posComunicante);
    matriz[posDisponivel.i][posDisponivel.j] = tarefa;
  }

});

// função auxiliar para encontrar a posição de uma tarefa na matriz
function encontrar_posicao_tarefa(matriz, nome_tarefa) {
  for (let i = 0; i < n_linhas; i++) {
    for (let j = 0; j < n_colunas; j++) {
      if (matriz[i][j] == nome_tarefa) {
        return { i: i, j: j };
      }
    }
  }
}

// função auxiliar para encontrar a próxima posição disponível na matriz a partir de uma posição inicial
function encontrar_posicao_disponivel(matriz, pos_inicial) {
  let i = pos_inicial.i;
  let j = pos_inicial.j;
  let k = 1;
  while (true) {
    // verificar se posição à direita está disponível
    if (j + k < n_colunas && matriz[i][j + k] == null) {
      return { i: i, j: j + k };
    }

    // verificar se posição à esquerda está disponível
    if (j - k >= 0 && matriz[i][j - k] == null) {
      return { i: i, j: j - k };
    }

    // verificar se posição abaixo está disponível
    if (i + k < n_linhas && matriz[i + k][j] == null) {
      return { i: i + k, j: j };
    }

    // verificar se posição acima está disponível
    if (i - k >= 0 && matriz[i

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