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

modeloSelect.addEventListener("change", function () {

    if (this.value === "avisoA4" || this.value === "avisoA3") {
        textarea.style.display = "block";
        input.style.display = "none";
        previewContainer.style.display = "none";
    } else {
        textarea.style.display = "none";
        input.style.display = "block";
    }
});


function imprimir() {

    const modelo = document.getElementById("modelo").value;

    // 🔹 MODELO AVISO A4
    if (modelo === "avisoA4") {

        const textoDigitado = document.getElementById("textoInput").value.trim();

        if (!textoDigitado) {
            alert("Digite o texto do aviso.");
            return;
        }

        localStorage.setItem("textoAviso", textoDigitado);

        window.open("pages/aviso_A4.html", "_blank");
        return;
    }

    if (modelo === "avisoA3") {

        const textoDigitado = document.getElementById("textoInput").value.trim();

        if (!textoDigitado) {
            alert("Digite o texto do aviso.");
            return;
        }

        localStorage.setItem("textoAviso", textoDigitado);

        window.open("pages/aviso_A3.html", "_blank");
        return;
    }

    // 🔹 MODELOS DE IMAGEM
    if (!imagemURL) {
        alert("Selecione uma imagem primeiro.");
        return;
    }

    localStorage.setItem("imagemSelecionada", imagemURL);

    if (modelo === "4x") {
        window.open("pages/4x_img_A4.html", "_blank");
    }

    if (modelo === "6x") {
        window.open("pages/6x_img_A4.html", "_blank");
    }

    if (modelo === "a4") {
        window.open("pages/aviso_A4.html", "_blank");
    }

    if (modelo === "a3") {
        window.open("pages/imagem_A3.html", "_blank");;
    }

}

modeloSelect.dispatchEvent(new Event("change"));
