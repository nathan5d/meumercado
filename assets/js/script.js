// Função para mostrar/ocultar campos de adicionar item
function mostrarCamposAdicionarItem() {
    const camposAdicionarItem = $("#camposAdicionarItem");
    camposAdicionarItem.toggle();
}

// Função para criar uma nova lista de compras
function criarLista() {
    const nomeListaInput = $("#nomeLista");
    const nomeLista = nomeListaInput.val().trim();

    if (nomeLista !== "") {
        const lista = JSON.parse(localStorage.getItem(nomeLista)) || { items: [] };
        const listas = JSON.parse(localStorage.getItem("listas")) || [];

        if (!listas.includes(nomeLista)) {
            listas.push(nomeLista);
            localStorage.setItem("listas", JSON.stringify(listas));
        }

        localStorage.setItem(nomeLista, JSON.stringify(lista));
        nomeListaInput.val("");

        listarListas();
        mostrarLista(nomeLista);
        console.log(nomeLista)
    }
}

// Função para listar todas as listas disponíveis
function listarListas() {
    const listas = JSON.parse(localStorage.getItem("listas")) || [];
    const listasUl = $("#listas");
    listasUl.html("");

    $.each(listas, function (index, lista) {
        const listItem = $("<li>").text(lista);
        listItem.click(function () {
            mostrarLista(lista);
        });
        listasUl.append(listItem);
    });
}

// Função para mostrar uma lista específica
function mostrarLista(nomeLista) {
    const nomeListaAtual = $(".nome-lista-atual");
    nomeListaAtual.text(nomeLista);

    // Mostrar campos de adicionar item quando uma lista é selecionada
    const camposAdicionarItem = $("#camposAdicionarItem");
    camposAdicionarItem.show();

    const lista = JSON.parse(localStorage.getItem(nomeLista)) || { items: [] };
    const listaUl = $("#lista");
    listaUl.html("");
    console.log(lista);

    $.each(lista.items, function (index, item) {
        const listItem = $("<li>").text(`${item.nome} - Quantidade: ${item.quantidade}, Preço: ${item.preco} ${item.unidade}, Total: ${item.quantidade * item.preco}`);
        listaUl.append(listItem);
    });
}

// Função para adicionar um item à lista atual
function adicionarItem() {
    const nomeListaAtual = $(".nome-lista-atual").text();
    const itemInput = $("#item");
    const quantidadeInput = $("#quantidade");
    const precoInput = $("#preco");
    const unidadeInput = $("#unidade");

    const nomeItem = itemInput.val().trim();
    const quantidade = parseFloat(quantidadeInput.val());
    const preco = parseFloat(precoInput.val());
    const unidade = unidadeInput.val().trim();

    if (nomeItem !== "" && !isNaN(quantidade) && !isNaN(preco) && unidade !== "") {
        const item = {
            nome: nomeItem,
            quantidade: quantidade,
            preco: preco,
            unidade: unidade
        };

        const lista = JSON.parse(localStorage.getItem(nomeListaAtual)) || { items: [] };
        lista.items.push(item);
        localStorage.setItem(nomeListaAtual, JSON.stringify(lista));
        console.log(lista);

        atualizarLista();
        itemInput.val("");
        quantidadeInput.val("");
        precoInput.val("");
        unidadeInput.val("");
    }
    toogleSwipe();
}

// Função para limpar a lista atual
function limparLista() {
    const nomeListaAtual = $(".nome-lista-atual").text();
    const lista = { items: [] };
    localStorage.setItem(nomeListaAtual, JSON.stringify(lista));
    atualizarLista();
}

// Função para atualizar a lista na página
function atualizarLista() {
    const nomeListaAtual = $(".nome-lista-atual").text();
    const lista = JSON.parse(localStorage.getItem(nomeListaAtual)) || { items: [] };
    const listaUl = $("#lista");
    listaUl.html("");

    $.each(lista.items, function (index, item) {
        const listItem = $("<li>").text(`${item.nome} - Quantidade: ${item.quantidade}, Preço: ${item.preco} ${item.unidade}, Total: ${item.quantidade * item.preco}`);
        listaUl.append(listItem);
    });
}

function toogleSwipe(){
    $('.box-modal').toggleClass('active');
}

// Carregar a lista de listas quando a página é carregada
$(document).ready(function () {
    listarListas();
    $('.box-modal').on('click', function(){
        toogleSwipe();
    })
});
