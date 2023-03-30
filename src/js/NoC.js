const prompt = require('prompt-sync')();
const anel = require('./modeloAnel.js');
const mesh = require('./modeloMesh.js');

var modelo = prompt('Digite A para simular modelo ANEL ou M para simular o modelo MESH-2D');

while (modelo != 'm' && modelo != 'M' && modelo != 'a' && modelo != 'A') {
    console.log('Selecione um modelo válido');
    const novoModelo = prompt('Digite A para simular modelo ANEL ou M para simular o modelo MESH-2D');
    modelo = novoModelo;
}

if (modelo === 'A' || modelo === 'a') {
    anel();

} else if (modelo === 'M' || modelo === 'm') {
    mesh();
};
