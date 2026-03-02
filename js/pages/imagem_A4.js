const img = document.getElementById("imagem");
const imagem = localStorage.getItem("imagemSelecionada");

if (imagem) {
    img.src = imagem;
}

window.onload = function () {

    setTimeout(() => {
        window.print();
    }, 300);

    window.onafterprint = function () {
        window.close();
    };
};