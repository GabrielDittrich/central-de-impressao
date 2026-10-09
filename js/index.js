const input = document.getElementById("imagemInput");
const area = document.getElementById("areaImpressao");
let imagemURL = "";
let imagemSalva = false;
let carregandoImagem = false;
let versaoSelecao = 0;

const previewContainer = document.getElementById("previewContainer");
const previewImagem = document.getElementById("previewImagem");
const imagemStatus = document.getElementById("imagemStatus");
const botaoImprimir = document.getElementById("btnImprimir");

function atualizarBotaoImagem() {
    const modelo = modeloSelect.value;
    const modeloDeImagem = !["avisoA4", "avisoA3", "qr", "barras"].includes(modelo);
    botaoImprimir.disabled = modeloDeImagem && carregandoImagem;
}

input.addEventListener("change", async function () {
    const versaoAtual = ++versaoSelecao;
    const file = this.files[0];

    if (imagemURL) URL.revokeObjectURL(imagemURL);
    imagemURL = "";
    imagemSalva = false;
    previewImagem.removeAttribute("src");
    previewContainer.style.display = "none";
    imagemStatus.hidden = true;

    if (!file) {
        carregandoImagem = false;
        atualizarBotaoImagem();
        return;
    }

    if (!file.type.startsWith("image/")) {
        this.value = "";
        carregandoImagem = false;
        atualizarBotaoImagem();
        alert("Selecione um arquivo de imagem.");
        return;
    }

    imagemURL = URL.createObjectURL(file);
    previewImagem.src = imagemURL;
    previewContainer.style.display = "block";
    imagemStatus.textContent = "Salvando imagem...";
    imagemStatus.hidden = false;
    carregandoImagem = true;
    atualizarBotaoImagem();

    try {
        await ImageStorage.salvarImagem(file);
        if (versaoAtual !== versaoSelecao) return;

        imagemSalva = true;
        imagemStatus.textContent = "Imagem pronta para impressão.";
        // A chave antiga ocupava a pequena cota do localStorage.
        try {
            localStorage.removeItem("imagemSelecionada");
        } catch (erro) {
            console.warn("Não foi possível remover a imagem antiga.", erro);
        }
    } catch (erro) {
        if (versaoAtual !== versaoSelecao) return;
        console.error("Falha ao salvar a imagem:", erro);
        imagemStatus.textContent = "Não foi possível salvar a imagem. Selecione-a novamente.";
        alert("Não foi possível salvar a imagem neste navegador. Verifique o espaço disponível e tente novamente.");
    } finally {
        if (versaoAtual === versaoSelecao) {
            carregandoImagem = false;
            atualizarBotaoImagem();
        }
    }
});

const modeloSelect = document.getElementById("modelo");
const textarea = document.getElementById("textoInput");
const codigoContainer = document.getElementById("codigoContainer");
const codigoInput = document.getElementById("codigoInput");
const codigoLabel = document.getElementById("codigoLabel");
const codigoHelp = document.getElementById("codigoHelp");

modeloSelect.addEventListener("change", function () {
    const aviso = this.value === "avisoA4" || this.value === "avisoA3";
    const codigo = this.value === "qr" || this.value === "barras";
    textarea.style.display = aviso ? "block" : "none";
    input.style.display = aviso || codigo ? "none" : "block";
    codigoContainer.hidden = !codigo;
    previewContainer.style.display = aviso || codigo || !imagemURL ? "none" : "block";
    imagemStatus.hidden = aviso || codigo || !imagemURL;
    atualizarBotaoImagem();

    if (codigo) {
        codigoLabel.textContent = this.value === "qr" ? "Link para o QR Code" : "Link curto ou código";
        codigoInput.placeholder = this.value === "qr" ? "https://exemplo.com.br" : "https://exemplo.com.br ou PRODUTO-123";
        codigoHelp.textContent = this.value === "qr"
            ? "Cole um link completo, começando por https:// ou http://."
            : "Code 128 aceita texto simples. Links longos ficam difíceis de ler no papel; para eles, use QR Code.";
    }
});

function imprimir() {
    const modelo = document.getElementById("modelo").value;

    if (modelo === "qr" || modelo === "barras") {
        const conteudo = codigoInput.value.trim();
        if (!conteudo) {
            alert("Digite um link ou código primeiro.");
            codigoInput.focus();
            return;
        }
        if (modelo === "qr") {
            try {
                const url = new URL(conteudo);
                if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Protocolo inválido");
            } catch {
                alert("Digite um link completo começando por https:// ou http://.");
                codigoInput.focus();
                return;
            }
        } else if (conteudo.length > 60 || !/^[\x20-\x7E]+$/.test(conteudo)) {
            alert("Code 128 aceita até 60 caracteres comuns (sem acentos). Para links maiores, use QR Code.");
            codigoInput.focus();
            return;
        }
        localStorage.setItem("codigoConteudo", conteudo);
        window.open(modelo === "qr" ? "./pages/codigo_qr.html" : "./pages/codigo_barras.html", "_blank");
        return;
    }

    if (modelo === "avisoA4" || modelo === "avisoA3") {
        const textoDigitado = textarea.value.trim();
        if (!textoDigitado) {
            alert("Digite o texto do aviso.");
            return;
        }

        localStorage.setItem("textoAviso", textoDigitado);
        window.open(modelo === "avisoA4" ? "./pages/aviso_A4.html" : "./pages/aviso_A3.html", "_blank");
        return;
    }

    if (!imagemURL) {
        alert("Selecione uma imagem primeiro.");
        return;
    }
    if (!imagemSalva) {
        alert("A imagem ainda não está pronta. Se o salvamento falhou, selecione-a novamente.");
        return;
    }

    const paginas = {
        "8x": "./pages/8x_img_A4.html",
        "6x": "./pages/6x_img_A4.html",
        "4x": "./pages/4x_img_A4.html",
        "a4": "./pages/imagem_A4.html",
        "a3": "./pages/imagem_A3.html"
    };
    window.open(paginas[modelo], "_blank");
}

modeloSelect.dispatchEvent(new Event("change"));
