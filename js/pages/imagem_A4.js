(async function () {
    const img = document.getElementById("imagem");
    const btnPrint = document.getElementById("btnPrint");
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
        img.onload = () => {
            btnPrint.disabled = false;
            requestAnimationFrame(() => setTimeout(() => window.print(), 300));
        };
        img.onerror = () => {
            btnPrint.disabled = true;
            alert("Falha ao carregar a imagem. Tente selecionar novamente.");
        };
        img.src = imagemURL;
    } catch (erro) {
        console.error("Falha ao abrir a imagem:", erro);
        alert("Não foi possível abrir a imagem salva. Volte e selecione-a novamente.");
    }
})();
