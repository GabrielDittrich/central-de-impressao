// O arquivo é salvo sem conversão para Base64, preservando sua resolução.
window.ImageStorage = (() => {
    const nomeBanco = "central-de-impressao";
    const nomeColecao = "imagens";
    const chaveImagem = "selecionada";

    function abrirBanco() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error("IndexedDB indisponível neste navegador."));
                return;
            }

            let pedido;
            try {
                pedido = indexedDB.open(nomeBanco, 1);
            } catch (erro) {
                reject(erro);
                return;
            }

            pedido.onupgradeneeded = () => {
                pedido.result.createObjectStore(nomeColecao);
            };
            pedido.onsuccess = () => {
                const banco = pedido.result;
                banco.onversionchange = () => banco.close();
                resolve(banco);
            };
            pedido.onerror = () => reject(pedido.error);
            pedido.onblocked = () => reject(new Error("O banco de imagens está bloqueado por outra aba."));
        });
    }

    async function salvarImagem(arquivo) {
        const banco = await abrirBanco();
        return new Promise((resolve, reject) => {
            try {
                const transacao = banco.transaction(nomeColecao, "readwrite");
                transacao.objectStore(nomeColecao).put(arquivo, chaveImagem);
                transacao.oncomplete = () => {
                    banco.close();
                    resolve();
                };
                transacao.onerror = () => {
                    banco.close();
                    reject(transacao.error);
                };
                transacao.onabort = () => {
                    banco.close();
                    reject(transacao.error);
                };
            } catch (erro) {
                banco.close();
                reject(erro);
            }
        });
    }

    async function carregarImagem() {
        const banco = await abrirBanco();
        return new Promise((resolve, reject) => {
            try {
                const transacao = banco.transaction(nomeColecao, "readonly");
                const pedido = transacao.objectStore(nomeColecao).get(chaveImagem);
                transacao.oncomplete = () => {
                    banco.close();
                    resolve(pedido.result);
                };
                transacao.onerror = () => {
                    banco.close();
                    reject(transacao.error);
                };
                transacao.onabort = () => {
                    banco.close();
                    reject(transacao.error);
                };
            } catch (erro) {
                banco.close();
                reject(erro);
            }
        });
    }

    return { salvarImagem, carregarImagem };
})();
