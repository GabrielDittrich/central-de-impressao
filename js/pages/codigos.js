(function () {
    const tipo = document.body.dataset.codeType;
    const valor = localStorage.getItem("codigoConteudo")?.trim();
    const output = document.getElementById("codeOutput");
    const valueLabel = document.getElementById("valueLabel");
    const errorMessage = document.getElementById("errorMessage");
    const btnPrint = document.getElementById("btnPrint");
    const btnDownload = document.getElementById("btnDownload");

    function mostrarErro(mensagem) {
        errorMessage.textContent = mensagem;
        errorMessage.hidden = false;
    }

    if (!valor) {
        mostrarErro("Volte para a tela inicial e digite o conteúdo do código.");
        return;
    }
    valueLabel.textContent = valor;

    try {
        if (tipo === "qr") {
            const url = new URL(valor);
            if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Link inválido");
            const qr = qrcode(0, "M");
            qr.addData(valor);
            qr.make();
            // A biblioteca desenha apenas a matriz, com 4 módulos brancos de margem.
            const xml = new DOMParser().parseFromString(
                qr.createSvgTag({ cellSize: 1, margin: 4, scalable: true }),
                "image/svg+xml"
            );
            if (xml.querySelector("parsererror")) throw new Error("SVG inválido");
            const svg = document.importNode(xml.documentElement, true);
            svg.setAttribute("width", "100mm");
            svg.setAttribute("height", "100mm");
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", "QR Code do link informado");
            output.appendChild(svg);
        } else if (tipo === "barras") {
            if (valor.length > 60 || !/^[\x20-\x7E]+$/.test(valor)) throw new Error("Code 128 aceita até 60 caracteres comuns.");
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            output.appendChild(svg);
            JsBarcode(svg, valor, {
                format: "CODE128",
                lineColor: "#000000",
                background: "#ffffff",
                width: 2,
                height: 90,
                fontSize: 16,
                displayValue: true,
                margin: 20
            });
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", "Código de barras do conteúdo informado");
        } else {
            throw new Error("Modelo desconhecido");
        }
    } catch (erro) {
        output.replaceChildren();
        mostrarErro(tipo === "qr"
            ? "Não foi possível gerar o QR Code. Confira o link ou reduza seu tamanho."
            : "Não foi possível gerar o código de barras. Confira o texto informado.");
        return;
    }

    btnPrint.disabled = false;
    btnDownload.disabled = false;
    btnPrint.addEventListener("click", () => window.print());
    btnDownload.addEventListener("click", () => {
        const svg = output.querySelector("svg");
        const copia = svg.cloneNode(true);
        // O serializador adiciona o namespace SVG; evite um xmlns duplicado.
        copia.removeAttribute("xmlns");
        const xml = new XMLSerializer().serializeToString(copia);
        const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = tipo === "qr" ? "qrcode-link.svg" : "codigo-barras-code128.svg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    requestAnimationFrame(() => setTimeout(() => window.print(), 150));
})();
