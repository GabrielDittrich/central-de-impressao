const input = document.getElementById("imagemInput");
const area = document.getElementById("areaImpressao");
let imagemURL = "";

const previewContainer = document.getElementById("previewContainer");
const previewImagem = document.getElementById("previewImagem");

input.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagemURL = e.target.result; // base64
            previewImagem.src = imagemURL;
            previewContainer.style.display = "block";
        };

        reader.readAsDataURL(file);
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

    // 🔹 MODELO AVISO A4
    if (modelo === "avisoA4") {

        const textoDigitado = document.getElementById("textoInput").value.trim();

        if (!textoDigitado) {
            alert("Digite o texto do aviso.");
            return;
        }

        localStorage.setItem("textoAviso", textoDigitado);

        window.open("./pages/aviso_A4.html", "_blank");
        return;
    }

    if (modelo === "avisoA3") {

        const textoDigitado = document.getElementById("textoInput").value.trim();

        if (!textoDigitado) {
            alert("Digite o texto do aviso.");
            return;
        }

        localStorage.setItem("textoAviso", textoDigitado);

        window.open("./pages/aviso_A3.html", "_blank");
        return;
    }

    // 🔹 MODELOS DE IMAGEM
    if (!imagemURL) {
        alert("Selecione uma imagem primeiro.");
        return;
    }

    localStorage.setItem("imagemSelecionada", imagemURL);

    if (modelo === "8x") {
        window.open("./pages/8x_img_A4.html", "_blank");
    }

    if (modelo === "4x") {
        window.open("./pages/4x_img_A4.html", "_blank");
    }

    if (modelo === "6x") {
        window.open("./pages/6x_img_A4.html", "_blank");
    }

    if (modelo === "a4") {
        window.open("./pages/imagem_A4.html", "_blank");
    }

    if (modelo === "a3") {
        window.open("./pages/imagem_A3.html", "_blank");
    }

}

modeloSelect.dispatchEvent(new Event("change"));
