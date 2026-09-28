(function () {
    const textoElemento = document.getElementById("texto");
    const container = document.getElementById("container");
    const btnPrint = document.getElementById("btnPrint");
    const textoRecebido = localStorage.getItem("textoAviso") || "SEU TEXTO AQUI";

    // Preserva as quebras de linha; o CSS usa white-space: pre-line.
    textoElemento.textContent = textoRecebido;

    function ajustarTamanho() {
        let tamanhoAtual = 400;
        textoElemento.style.fontSize = tamanhoAtual + "px";

        while (
            (textoElemento.scrollHeight > container.clientHeight ||
             textoElemento.scrollWidth > container.clientWidth) &&
            tamanhoAtual > 10
        ) {
            tamanhoAtual -= 2;
            textoElemento.style.fontSize = tamanhoAtual + "px";
        }
    }

    btnPrint.addEventListener("click", () => window.print());
    window.addEventListener("beforeprint", ajustarTamanho);
    window.addEventListener("afterprint", ajustarTamanho);
    window.addEventListener("resize", ajustarTamanho);
    window.addEventListener("load", () => {
        ajustarTamanho();
        setTimeout(() => window.print(), 300);
    });
})();
