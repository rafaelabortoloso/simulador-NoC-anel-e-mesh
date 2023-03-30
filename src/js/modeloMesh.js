const prompt = require('prompt-sync')();

function mesh() {
    var linhas = parseInt(prompt('Qual a largura da matriz (máximo 9)?'));
    var colunas = parseInt(prompt('Qual a altura da matriz (máximo 9)?'));

    while (linhas <= 0 || linhas > 9 || colunas <= 0 || colunas > 9) {
        console.log('O tamanho máximo para a matriz é 9x9');
        var linhas = parseInt(prompt('Qual a largura da matriz (máximo 9)?'));
        var colunas = parseInt(prompt('Qual a altura da matriz (máximo 9)?'));
    };

    // Solicitar ao usuário o valor do source e do target
    var sourceX = prompt('Qual a posição de source no eixo X?');
    var sourceY = prompt('Qual a posição de source no eixo Y?');

    //validar se os valores estão dentro da matriz
    while (sourceX < 0 || sourceX >= linhas || sourceY < 0 || sourceY >= colunas) {
        console.log("As coordenadas do source estão fora dos limites da matriz!");
        var sourceX = prompt('Qual a posição de source no eixo X?');
        var sourceY = prompt('Qual a posição de source no eixo Y?');
    };

    var targetX = prompt('Qual a posição de target no eixo X?');
    var targetY = prompt('Qual a posição de target no eixo Y?');

    while (targetX < 0 || targetX >= linhas || targetY < 0 || targetY >= colunas) {
        console.log("As coordenadas do target estão fora dos limites da matriz!");
        var targetX = prompt('Qual a posição de target no eixo X?');
        var targetY = prompt('Qual a posição de target no eixo Y?');
    };

    //criando a matriz
    const matriz = [];
    for (let i = 0; i < linhas; i++) {
        matriz[i] = [];
        for (let j = 0; j < colunas; j++) {
            if (i == sourceX && j == sourceY) {
                matriz[i][j] = "src"; // Definindo o elemento como source
            } else if (i == targetX && j == targetY) {
                matriz[i][j] = "trg"; // Definindo o elemento como target
            } else {
                //matriz[i][j] = i * colunas + j; // define valor para os outros elementos
                matriz[i][j] = null;
            }
        }
    }

    console.log(matriz);

    // Definindo uma função que retorna os vizinhos de um nó
    function getVizinhos(node) {
        const vizinhos = [];
        const x = parseInt(node[0]);
        const y = parseInt(node[1]);

        if (x > 0) {
            vizinhos.push([x - 1, y]); // vizinho acima
        }
        if (x < linhas - 1) {
            vizinhos.push([x + 1, y]); // vizinho abaixo
        }
        if (y > 0) {
            vizinhos.push([x, y - 1]); // vizinho à esquerda
        }
        if (y < colunas - 1) {
            vizinhos.push([x, y + 1]); // vizinho à direita
        }
        return vizinhos;

    }

    const source = [sourceX, sourceY];
    const target = [targetX, targetY];

    // Implementando o algoritmo BFS
    function bfs(source, target) {
        const queue = [source];
        const visitados = new Set([source.toString()]);
        const caminho = new Map();
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
                return result;
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

    const mapFunc = (obj, idx, leng, lastItem) => {
        if (idx === 0) {
            console.log(`Proc[${obj.x},${obj.y}] criou a mensagem`);
        } else if (idx + 1 === leng) {
            console.log(`Proc[${obj.x},${obj.y}] é o destino`);
            console.log(`Proc[${obj.x},${obj.y}] consumiu a mensagem`);
        } else {
            console.log(`Proc[${lastItem.x},${lastItem.y}] enviou a mensagem para Proc[${obj.x},${obj.y}]`);
            console.log(`Proc[${obj.x},${obj.y}] recebeu a mensagem de Proc[${lastItem.x},${lastItem.y}]`);
            console.log(`Proc[${obj.x},${obj.y}] NÃO é o destino`);
            const nextProc = listCaminho[idx + 1];
            console.log(`Proc[${obj.x},${obj.y}] enviou a mensagem para Proc[${nextProc.x},${nextProc.y}]`);
            console.log(`Proc[${obj.x},${obj.y}] recebeu a mensagem de Proc[${nextProc.x},${nextProc.y}]`);
        }
    }

    const listCaminho = bfs([sourceX, sourceY], [targetX, targetY]);

    let lastItem = listCaminho[0];
    listCaminho.forEach((obj, index) => {
        mapFunc(obj, index, listCaminho.length, lastItem);
        lastItem = obj;
    })
}

module.exports = mesh;