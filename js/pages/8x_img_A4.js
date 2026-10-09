(async function () {
    const grid = document.getElementById("grid8");
    const btnPrint = document.getElementById("btnPrint");
    const total = 8;
    let carregadas = 0;
    let houveErro = false;
    btnPrint.disabled = true;

    try {
        const arquivo = await ImageStorage.carregarImagem();
        if (!arquivo) {
            alert("Nenhuma imagem encontrada. Volte para a tela inicial e selecione uma imagem.");
            return;
        }

        const imagemURL = URL.createObjectURL(arquivo);
        window.addEventListener("pagehide", () => URL.revokeObjectURL(imagemURL), { once: true });
        btnPrint.addEventListener("click", () => window.print());

        for (let i = 0; i < total; i++) {
            const img = document.createElement("img");
            img.alt = `Imagem ${i + 1} para impressão`;
            img.onload = () => {
                carregadas++;
                if (carregadas === total && !houveErro) {
                    btnPrint.disabled = false;
                    requestAnimationFrame(() => setTimeout(() => window.print(), 150));
                }
            };
            img.onerror = () => {
                if (houveErro) return;
                houveErro = true;
                btnPrint.disabled = true;
                alert("Falha ao carregar a imagem. Tente selecionar novamente.");
            };
            grid.appendChild(img);
            img.src = imagemURL;
        }
    } catch (erro) {
        console.error("Falha ao abrir a imagem:", erro);
        alert("Não foi possível abrir a imagem salva. Volte e selecione-a novamente.");
    }
})();
