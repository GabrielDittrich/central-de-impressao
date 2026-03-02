(function () {
  const imagem = localStorage.getItem("imagemSelecionada");
  const grid = document.getElementById("grid");

  // 1) Se não tem imagem salva, avisa e não tenta imprimir
  if (!imagem) {
    alert("Nenhuma imagem encontrada. Volte para a tela inicial e selecione uma imagem.");
    return;
  }

  // 2) Cria as 4 imagens e espera todas carregarem antes de imprimir
  const total = 4;
  let carregadas = 0;

  function tentarImprimir() {
    // garante que já renderizou
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

  // 3) Fecha após imprimir (alguns browsers bloqueiam, mas tentamos)
  window.onafterprint = () => window.close();
})();