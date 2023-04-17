let grafo_tarefas = JSON.parse(json_data);

// criar matriz com tamanho informado
let matriz = new Array(n_linhas);
for (let i = 0; i < n_linhas; i++) {
    matriz[i] = new Array(n_colunas);
}

for (let tarefa of grafo_tarefas) {
    // verificar se a tarefa já está na matriz
    let tarefa_existe = false;
    for (let i = 0; i < n_linhas; i++) {
        for (let j = 0; j < n_colunas; j++) {
            if (matriz[i][j] == tarefa['nome']) {
                tarefa_existe = true;
                break;
            }
        }
        if (tarefa_existe) {
            break;
        }
    }

    // se a tarefa ainda não está na matriz, inseri-la próxima à sua tarefa comunicante
    if (!tarefa_existe) {
        let pos_comunicante;
        if (tarefa['tarefa_origem'] != null) {
            pos_comunicante = encontrar_posicao_tarefa(matriz, tarefa['tarefa_origem']);
        } else if (tarefa['tarefa_destino'] != null) {
            pos_comunicante = encontrar_posicao_tarefa(matriz, tarefa['tarefa_destino']);
        } else {
            // tarefa não tem comunicante, inserir na posição central da matriz
            pos_comunicante = { i: Math.floor(n_linhas / 2), j: Math.floor(n_colunas / 2) };
        }

        let pos_disponivel = encontrar_posicao_disponivel(matriz, pos_comunicante);
        matriz[pos_disponivel.i][pos_disponivel.j] = tarefa['nome'];
    }
}

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
        if (i - k >= 0 && matriz[i - k][j] == 0) {
            matriz[i - k][j] = tarefa["id"]
            tarefa_posicionada = true
            break
        }
        // Check if there's an empty space to the right
        if (j + k < n_colunas && matriz[i][j + k] == 0) {
            matriz[i][j + k] = tarefa["id"]
            tarefa_posicionada = true
            break
        }
        // Check if there's an empty space to the left
        if (j - k >= 0 && matriz[i][j - k] == 0) {
            matriz[i][j - k] = tarefa["id"]
            tarefa_posicionada = true
            break
        }
        // Check if there's an empty space below
        if (i + k < n_linhas && matriz[i + k][j] == 0) {
            matriz[i + k][j] = tarefa["id"]
            tarefa_posicionada = true
            break
        }
        // Increment k to check the next layer of neighbors
        k++
    }
    // If the task wasn't positioned yet, increase the size of the matrix
    if (!tarefa_posicionada) {
        n_linhas += 2
        n_colunas += 2
        matriz = expandeMatriz(matriz, n_linhas, n_colunas)
        // Try again to position the task
    }
}
return matriz
function expandeMatriz(matriz, n_linhas, n_colunas) {
    let nova_matriz = []
    for (let i = 0; i < n_linhas; i++) {
        nova_matriz.push([])
        for (let j = 0; j < n_colunas; j++) {
            if (i < matriz.length && j < matriz[0].length) {
                nova_matriz[i].push(matriz[i][j])
            } else {
                nova_matriz[i].push(0)
            }
        }
    }
    return nova_matriz
}
