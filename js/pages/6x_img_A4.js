(function () {
    const imagem = localStorage.getItem("imagemSelecionada");
    const grid = document.getElementById("grid");

    if (!imagem) {
        alert("Nenhuma imagem encontrada. Volte para a tela inicial e selecione uma imagem.");
        return;
    }

    const total = 6;
    let carregadas = 0;

    function tentarImprimir() {
        // dá 1 “respiro” pra renderizar layout/imagens
        requestAnimationFrame(() => {
            setTimeout(() => window.print(), 150);
        });
    }

    for (let i = 0; i < total; i++) {
        const img = document.createElement("img");
        img.alt = "Imagem para impressão";
        img.src = imagem;

        img.onload = () => {
            carregadas++;
            if (carregadas === total) {
                tentarImprimir();
            }
        };

        img.onerror = () => {
            alert("Falha ao carregar a imagem. Tente selecionar novamente.");
        };

        grid.appendChild(img);
    }

    window.onafterprint = () => window.close();
})();