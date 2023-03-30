const prompt = require('prompt-sync')();

function anel() {
    var nodos = prompt('Quantos nodos a rede terá?');

    //não permite que sejam mais de 10 nodos
    while (nodos <= 0 || nodos > 10) {
        console.log('O número máximo de nodos é 9');
        const newNodos = prompt('Quantos nodos a rede terá?');
        nodos = newNodos;
    };

    var source = prompt('Quem é o source?');
    var target = prompt('Quem é o target?');
    var anterior = source;

    console.log(`Proc ${source} criou a mensagem`);

    while (true) {
        anterior = source;
        if (source < nodos - 1) {
            source++;
        } else {
            source = 0;
        }

        console.log(`Proc ${anterior} Enviou a mensagem para Proc ${source}`);
        console.log(`Proc ${source} Recebeu a mensagem de Proc ${anterior}`);
        if (source == target) {
            console.log(`Proc ${source} é o destino`);
            console.log(`Proc ${source} consumiu a mensagem`);
            break;
        } else {
            console.log(`Proc ${source} NÃO é o destino`);
        }

    }
}

module.exports = anel;