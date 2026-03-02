const textoElemento = document.getElementById("texto");
const container = document.getElementById("container");

// pega texto vindo do index
let textoRecebido = localStorage.getItem("textoAviso") || "SEU TEXTO AQUI";

// permite quebra de linha com Enter
textoElemento.innerHTML = textoRecebido.replace(/\n/g, "<br>");

function ajustarTamanho() {

    let tamanhoMaximo = 400;   // começa grande
    let tamanhoMinimo = 10;
    let tamanhoAtual = tamanhoMaximo;

    textoElemento.style.fontSize = tamanhoAtual + "px";

    // Se estiver ultrapassando, começa a reduzir
    while (
        (textoElemento.scrollHeight > container.clientHeight ||
            textoElemento.scrollWidth > container.clientWidth)
        && tamanhoAtual > tamanhoMinimo
    ) {
        tamanhoAtual -= 2; // reduz mais rápido
        textoElemento.style.fontSize = tamanhoAtual + "px";
    }
}

window.onload = function () {
    ajustarTamanho();

    setTimeout(() => {
        window.print();
    }, 300);

    window.onafterprint = function () {
        window.close();
    };
};