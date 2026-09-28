(function () {
    const img = document.getElementById("imagem");
    const btnPrint = document.getElementById("btnPrint");
    const imagem = localStorage.getItem("imagemSelecionada");

    if (!imagem) {
        btnPrint.disabled = true;
        alert("Nenhuma imagem encontrada. Volte para a tela inicial e selecione uma imagem.");
        return;
    }

    btnPrint.addEventListener("click", () => window.print());
    img.onerror = () => {
        btnPrint.disabled = true;
        alert("Falha ao carregar a imagem. Tente selecionar novamente.");
    };
    img.src = imagem;

    window.addEventListener("load", () => {
        if (img.naturalWidth > 0) setTimeout(() => window.print(), 300);
    });
})();
