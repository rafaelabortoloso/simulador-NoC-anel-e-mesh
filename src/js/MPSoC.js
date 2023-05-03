const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

var jsonFilePath = path.join(__dirname, 'JsonTeste', 'Test1.json');

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const json = JSON.parse(data);
  const apps = json.TEST;

  const largura = parseInt(json.MPSOC_SIZE_X);
  const altura = parseInt(json.MPSOC_SIZE_Y);

  const tasks = parseInt(json.TASKS_PER_PROCESSOR);

  const matriz = [];
  for (let i = 0; i < largura; i++) {
    matriz[i] = [];
    for (let j = 0; j < altura; j++) {
      matriz[i][j] = null;
    }
  }

  for (const item of json.TEST) {
    // Repete o app a quantidade de vezes especificada em 'QTD'
    for (let i = 0; i < parseInt(item.QTD); i++) {



      for (const app of apps) {
        const appName = app.APP;
        const appFile = jsonFilePath = path.join(__dirname, 'JsonTeste', `Applications/${appName}.json`);

        fs.readFile(appFile, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          const objeto = JSON.parse(data);

          var grafo_tarefas = objeto.grafo_tarefas;

          let meioX = Math.floor(largura / 2);
          let meioY = Math.floor(altura / 2);

          const posMeio = [meioX, meioY];
          function sorteiaPosicao(matriz) {
            const linhas = matriz.length;
            const colunas = matriz[0].length;

            const randomLinha = Math.floor(Math.random() * linhas);
            const randomColuna = Math.floor(Math.random() * colunas);

            const posicaoSorteada = [randomLinha, randomColuna];
            return posicaoSorteada;
          }

          const noInicial = sorteiaPosicao(matriz);

          //insere a primeira tarefa em uma posiçao aleatoria da matriz
          if (matriz[noInicial[0]][noInicial[1]] == null) {
            matriz[noInicial[0]][noInicial[1]] = [];
            matriz[noInicial[0]][noInicial[1]].push(grafo_tarefas[0].tarefa_origem);
          };

          grafo_tarefas.forEach((tarefa) => {
            let source = tarefa.tarefa_origem;
            let target = tarefa.tarefa_destino;
            let custo = tarefa.quantidade_pacotes;

            const sourcePosition = srcExt(matriz, source);
            const targetPosition = srcExt(matriz, target);

            if (sourcePosition) { //verifica se o source ja existe
              if (matriz[sourcePosition[0]][sourcePosition[1]].length < tasks) { //verifica se o no do source ja esta cheio
                if (!targetPosition) { //verifica se o target nao existe
                  matriz[sourcePosition[0]][sourcePosition[1]].push(target); //coloca o target no mesmo no do source
                }
              } else { //se o no do source ja estiver cheio
                const vizinhos = getVizinhos([sourcePosition[0], sourcePosition[1]]) //pega os vizinhos do no onde esta o source
                const newTargetPosition = vizinhos.find((v) => {
                  return matriz[v[0]][v[1]] === null;
                });
                //console.log(newTargetPosition);

                if (!targetPosition) {
                  matriz[newTargetPosition[0]][newTargetPosition[1]] = [];
                  matriz[newTargetPosition[0]][newTargetPosition[1]].push(target);
                }
              }
            } else {
              const newSourcePosition = getVizinhos(noInicial).find((v) => {
                //console.log(matriz[v[0]][v[1]]);
                return matriz[v[0]][v[1]] == null;
              });

              matriz[newSourcePosition[0]][newSourcePosition[1]] = [];
              matriz[newSourcePosition[0]][newSourcePosition[1]].push(source);
            }
            const targetExiste = tgtExt(matriz, target);

            // console.log('sourceExiste', sourceExiste);
            // console.log('targetExiste', targetExiste);

            // getVizinhos([meioX, meioY])

          });

          function srcExt(matriz, source) {
            for (let i = 0; i < matriz.length; i++) {
              for (let j = 0; j < matriz[i].length; j++) {
                if (!!matriz[i][j]) {
                  if (matriz[i][j].find((value) => value === source)) {
                    return [i, j]
                  };
                }
              }
            }
            return false;
          };

          function tgtExt(matriz, target) {
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

          console.table(matriz);

          // let numberMatriz = []
          // for (let i = 0; i < largura; i++) {
          //   numberMatriz[i] = [];
          //   for (let j = 0; j < altura; j++) {
          //     numberMatriz[i][j] = null;
          //   }
          // }
          // grafo_tarefas.forEach((tarefa) => {
          //    source = 
          // })
        });
      }
    }
  }
});
