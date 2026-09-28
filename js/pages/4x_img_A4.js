(function () {
    const imagem = localStorage.getItem("imagemSelecionada");
    const grid = document.getElementById("grid");
    const btnPrint = document.getElementById("btnPrint");
    const total = 4;
    let carregadas = 0;
    let houveErro = false;

    if (!imagem) {
        btnPrint.disabled = true;
        alert("Nenhuma imagem encontrada. Volte para a tela inicial e selecione uma imagem.");
        return;
    }

    btnPrint.addEventListener("click", () => window.print());

    function tentarImprimir() {
        requestAnimationFrame(() => {
            setTimeout(() => window.print(), 150);
        });
    }

    for (let i = 0; i < total; i++) {
        const img = document.createElement("img");
        img.alt = `Imagem ${i + 1} para impressão`;
        img.onload = () => {
            carregadas++;
            if (carregadas === total && !houveErro) tentarImprimir();
        };
        img.onerror = () => {
            if (houveErro) return;
            houveErro = true;
            btnPrint.disabled = true;
            alert("Falha ao carregar a imagem. Tente selecionar novamente.");
        };
        grid.appendChild(img);
        img.src = imagem;
    }
})();
