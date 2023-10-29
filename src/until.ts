//import * as Hammer from "hammerjs";
import { CheckboxProperties, ItemList } from "./interfaces";

import { ModalProps } from "./interfaces";


function exibirModal(props: ModalProps) {
    const modal = $("#modal");

    // Obtenha os valores do objeto de configuração
    const title = props.title || "";
    const content = props.content || "";
    const buttons = props.buttons || [];
    const result = props.result || function () { };
    const icon = props.icon || "";

    // Defina o título e a mensagem do modal
    modal.find(".modal-title").text(title);
    modal.find(".modal-body").html(content);

    // Remova os botões existentes
    modal.find(".modal-buttons").empty();

    // Adicione os botões personalizáveis
    if (buttons && Array.isArray(buttons) && buttons.length > 0) {
        for (const botao of buttons) {
            const button = $("<button>")
                .text(botao.text)
                .addClass("modal-button")
                .on('click', function () {
                    result(botao.value);
                    modal.hide();
                });

            if (botao.style) {
                button.addClass(botao.style);
            }

            modal.find(".modal-buttons").append(button);
        }
    }

    // Defina o ícone, se fornecido
    if (icon) {
        modal.find(".modal-icon").html(icon);
    } else {
        modal.find(".modal-icon").empty();
    }

    // Exiba o modal
    modal.show();
}

// Função para mostrar/ocultar campos de adicionar item
function mostrarCamposAdicionarItem() {
    const camposAdicionarItem = $("#camposAdicionarItem");
    camposAdicionarItem.toggle();
}
// Função para criar uma nova lista de compras
function criarLista() {
    const nomeListaInput = $("#nomeLista");
    const nomeLista = nomeListaInput.val().toString().trim();


    if (nomeLista !== "") {
        const lista = { items: [] }; // Crie uma nova lista vazia
        const listas = JSON.parse(localStorage.getItem("listas")) || [];

        if (!listas.includes(nomeLista)) {
            listas.push(nomeLista);
            localStorage.setItem("listas", JSON.stringify(listas));
        }

        localStorage.setItem(nomeLista, JSON.stringify(lista));
        nomeListaInput.val("");

        listarListas();
        mostrarLista(nomeLista);
    }
}

// Função para listar todas as listas disponíveis
// Função para listar todas as listas disponíveis
// Função para listar todas as listas disponíveis
function listarListas() {
    // Obtém as listas do Local Storage ou cria uma lista vazia se não existir
    const listas = JSON.parse(localStorage.getItem("listas")) || [];

    // Seleciona o elemento <ul> com o ID "listas"
    const listasUl = $("#listas");

    // Limpa o conteúdo atual da lista antes de atualizá-lo
    listasUl.html("");

    // Itera sobre cada lista e cria um item de lista (<li>) para cada uma
    $.each(listas, function (index: number, lista: string) {
        const listItem = $("<li>");

        const listContainer = $("<div>").addClass("list-container");

        const listNome = $("<span>").addClass('').text(lista);

        listContainer.append(listNome);

        // Adiciona um evento de clique ao item da lista para mostrar a lista
        listItem.on('click', function () {
            mostrarLista(lista);
        });

        // Obtém a lista de itens para a lista atual
        let listaItens = JSON.parse(localStorage.getItem(lista));

        // Verifica se listaItens.items é um array; se não, cria um array vazio
        if (!Array.isArray(listaItens.items)) {
            listaItens.items = [];
        }

        // Calcula a contagem de itens marcados e o total de itens
        const itensMarcados = listaItens.items.filter(item => item.selected).length;
        const totalItens = listaItens.items.length;

        // Calcula a porcentagem de itens marcados em relação ao total
        const porcentagem = (itensMarcados / totalItens) * 100;

        // Cria a barra de progresso
        const progressContainer = $("<div>").addClass("progress-container");
        const progress = $("<div>").addClass("completebar")

        setTimeout(function () {
            // Altere a largura da barra de progresso para 100% após o atraso
            progress.css("width", porcentagem + "%");
        }, 200);


        progressContainer.append(progress);

        // Adiciona a contagem de itens e a barra de progresso ao item da lista
        const contagem = $('<span>').text(`${itensMarcados}/${totalItens}`);
        listContainer.append(contagem);
        listContainer.append(progressContainer);

        listItem.append(listContainer);

        // Adiciona o item da lista à lista não ordenada (<ul>)
        listasUl.append(listItem);
    });
}

// Chama a função inicialmente para listar as listas disponíveis
//listarListas();



function ocultarLista() {
    buttonAdd.hide();
    const camposAdicionarItem = $("#camposAdicionarItem");
    camposAdicionarItem.hide();
    listarListas();
    //mostr
    //reloadPage();
}






function enableSwipeToEdit() {
    console.log('habilitado');
    // Seletor para os elementos que terão a funcionalidade de swipe
    const swipeElements = $('.c-control');

    // Loop pelos elementos e adicionando a funcionalidade de swipe
    swipeElements.each(function () {
        const $element = $(this).find('.item-content');
        const $showOptions = $element.find('.item-options');
        let isSwiping = false;
        let originalX = 0;
        let lastDeltaX = 0;

        // Use o Hammer.js para reconhecimento de gestos
        const hammer = new Hammer(this);

        hammer.on('panstart', function (event) {
            isSwiping = true;
            originalX = $element.position().left;
        });

        //const $element =  $element.closest('li');
        hammer.on('panmove', function (event) {
            if (isSwiping) {
                const deltaX = originalX + event.deltaX;

                if (deltaX <= 0) {
                    lastDeltaX = deltaX;
                    $element.css('transform', `translateX(${deltaX}px)`);
                }

            }
        });

        hammer.on('panend', function (event) {
            if (isSwiping) {
                isSwiping = false;
                originalX = 0;
                const deltaX = event.deltaX;

                if (deltaX > 0) {
                    // Deslizar para a direita (ação a ser executada)
                    $element.closest('li').removeClass('swipe-edit swipe-delete');
                    $element.css('transform', 'translateX(0)');
                } else if (lastDeltaX < -0 && lastDeltaX >= -60) {
                    // Permanece na posição de edição
                    $element.closest('li').addClass('swipe-edit');
                    $element.css('transform', 'translateX(-60px)');
                } else if (lastDeltaX < -60) {
                    // Permanece na posição de exclusão

                    $element.closest('li').addClass('swipe-edit swipe-delete');
                    $element.css('transform', 'translateX(-120px)');
                }
            }
        });
    });
}

// Chame a função para habilitar o swipe
//enableSwipeToEdit();

// Chame a função para habilitar o swipe
//enableSwipeToEdit();


// Chame a função para habilitar o swipe
//enableSwipeToEdit();

// Chame a função para habilitar o swipe
//enableSwipeToEdit();


// Função para mostrar uma lista específica
function ordenarLista(lista) {
    const itemsSelecionados = lista.items.filter(item => item.selected);
    const itemsNaoSelecionados = lista.items.filter(item => !item.selected);

    itemsSelecionados.sort((a, b) => a.name.localeCompare(b.name));
    itemsNaoSelecionados.sort((a, b) => a.name.localeCompare(b.name));

    return [...itemsSelecionados, ...itemsNaoSelecionados];
}

// Função para mostrar uma lista específica
function mostrarLista(nomeLista: string) {
    buttonAdd.show();
    const nomeListaAtual = $("#nomeListaAtual");
    nomeListaAtual.text(nomeLista);

    const camposAdicionarItem = $("#camposAdicionarItem");
    camposAdicionarItem.show();

    let lista: { items: ItemList[] } = JSON.parse(localStorage.getItem(nomeLista)) || { items: [] };
    // Ordenar a lista
    lista.items = ordenarLista(lista);
    const listaUl = $("#lista");
    listaUl.html("");

    let totalLista = 0;
    let totalCarrinho = 0;
    let totalForaDoCarrinho = 0;

    $.each(lista.items, function (index, item) {
        const controlContainer = $("<div>");
        const checkboxContainer = $("<div>").addClass('item-content');
        const checkboxLabel = $("<label>").text(item.name);

        const checkbox = $("<input>").attr({
            "type": "checkbox",
            "class": "item-checkbox",
            "id": "item" + item.id,
            "data-index": item.id,
            "data-selected": item.selected.toString()
        })[0];

        const checkmark = $("<span>").addClass("checkmark");
        checkboxLabel.append(checkbox, checkmark);
        controlContainer.append(checkboxContainer);

        const precoFormatado = item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const totalItem = (item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        checkboxContainer.append(checkboxLabel, `${item.quantity} x, ${precoFormatado} ${item.unit}, ${totalItem}`);
        controlContainer.append(checkboxContainer);

        const listItem = $("<li>").append(controlContainer).addClass("c-control");

        const actionsContainer = $('<div>').addClass('item-options');
        listaUl.append(listItem);

        const editButton = $("<button>").html('<ion-icon name="ios-create"></ion-icon>');
        editButton.on('click', function () {
            iniciarEdicaoOuAdicao(item.id);
        });

        const deleteButton = $("<button>").addClass('is-danger').html('<ion-icon name="ios-trash"></ion-icon>');
        deleteButton.on('click', function () {
            exibirModal({
                title: "Deletar item",
                content: "Tem certeza que deseja <b>deletar</b> o item da lista?",
                buttons: [
                    { text: "Sim", value: "confirm", style: "danger" },
                    { text: "Cancelar", value: "cancel", style: "secondary" }
                ],
                result: function (resultado) {
                    if (resultado === "confirm") {
                        console.log("Botão OK foi clicado.");
                        excluirItem(nomeLista, index);
                    } else if (resultado === "cancel") {
                        console.log("Botão Cancelar foi clicado.");
                    }
                }
            });
        });

        actionsContainer.append(deleteButton);
        actionsContainer.append(editButton);
        listItem.append(actionsContainer);

        $(checkbox).on('change', function () {
            if (this instanceof HTMLInputElement && this.type === "checkbox") {
                const isChecked = this.checked;
                const dataIndex = parseInt($(this).attr("data-index") || "0", 10);

                // Obtenha o ID do item sendo editado (se existir)
                const idDoItemEdited = $(this).data("index");

                // Encontre o item na lista com base no ID
                const itemEdited = lista.items.find(item => item.id === idDoItemEdited);

                if (itemEdited) {
                    itemEdited.selected = isChecked;


                    console.log(itemEdited);
                    //lista.items.find(item => item.id === idDoItemEdited).selected = isChecked;
                    localStorage.setItem(nomeLista, JSON.stringify(lista));
                    // Ordenar a lista
                    lista.items = ordenarLista(lista);
                    atualizaTotais(lista);
                    // Atualize a exibição da lista em tempo real
                    mostrarLista(nomeLista);
                }
            }
        });

        totalLista += item.quantity * item.price;

        if (item.selected) {
            if (checkbox instanceof HTMLInputElement && checkbox.type === "checkbox") {
                checkbox.checked = true;
            }
            totalCarrinho += item.quantity * item.price;
        }
    });

    const totalListaFormatado = totalLista.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const totalCarrinhoFormatado = totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const totalForaCarrinhoFormatado = (totalLista - totalCarrinho).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    $("#totalLista").text(totalListaFormatado);

    function atualizaTotais(lista: { items: ItemList[] }) {
        totalCarrinho = 0;
        totalForaDoCarrinho = 0;
        $.each(lista.items, function (index, item) {
            const totalItem = item.quantity * item.price;
            if (item.selected) {
                totalCarrinho += totalItem;
            } else {
                totalForaDoCarrinho += totalItem;
            }
        });

        const totalCarrinhoFormatado = totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const totalForaCarrinhoFormatado = totalForaDoCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        $("#totalCarrinho").text(totalCarrinhoFormatado);
        $("#totalForaCarrinho").text(totalForaCarrinhoFormatado);
        localStorage.setItem(nomeLista, JSON.stringify(lista));
    }

    atualizaTotais(lista);
    enableSwipeToEdit();
}


// Função para iniciar a edição ou adição de um item
function iniciarEdicaoOuAdicao(id) {
    const nomeListaAtual = $("#nomeListaAtual").text();
    const lista = JSON.parse(localStorage.getItem(nomeListaAtual)) || { items: [] };

    if (id !== undefined) { // Se o ID for fornecido, estamos editando um item existente
        // Encontre o item na lista com base no ID
        const itemEdited = lista.items.find(item => item.id === id);

        if (itemEdited) {
            // Preencha os campos de edição com os valores do item encontrado
            $("#editItem").val(itemEdited.name);
            $("#editQuantity").val(itemEdited.quantity);
            $("#editPrice").val(itemEdited.price);
            $("#editUnit").val(itemEdited.unit);

            // Defina o ID do item sendo editado como um atributo de dados no botão "Salvar"
            $("#nomeListaAtualModal").text("Editando: " + itemEdited.name);
            $("#editarItemBtn").data("index", id);
        } else {
            console.error("Item não encontrado na lista.");
        }
    } else { // Caso contrário, estamos adicionando um novo item
        // Limpe os campos de edição
        $("#editItem").val("");
        $("#editQuantity").val("1");
        $("#editPrice").val("0");
        $("#editUnit").val("Un");

        // Limpe o atributo de dados do botão "Salvar"
        $("#editarItemBtn").removeData("index");

        // Defina o texto apropriado no modal
        $("#nomeListaAtualModal").text("Adicionar Novo Item");
    }

    // Abra o modal de edição/adicão
    abrirModal();
}

function generateUniqueID(lista) {
    // Verifique se a lista já contém itens
    if (lista.items.length > 0) {
        // Obtenha o último item da lista
        const ultimoItem = lista.items[lista.items.length - 1];
        // Gere um novo ID baseado no último item
        const novoID = ultimoItem.id + 1;
        return novoID;
    } else {
        // Se a lista estiver vazia, comece com o ID 1
        return 1;
    }
}

// Função para editar ou adicionar um item
function editarItem() {
    const nomeListaAtual = $("#nomeListaAtual").text();
    const editItemInput: JQuery<HTMLInputElement> = $("#editItem");

    const editQuantityInput: JQuery<HTMLInputElement> = $("#editQuantity");
    const editPriceInput: JQuery<HTMLInputElement> = $("#editPrice");
    const editUnitInput: JQuery<HTMLInputElement> = $("#editUnit");

    const nomeItemEdited = editItemInput.val().toString().trim();
    const quantityEdited = parseFloat(editQuantityInput.val());
    const precoEdited = parseFloat(editPriceInput.val());
    const unitEdited = editUnitInput.val().toString().trim();


    // Obtenha a lista do LocalStorage
    const lista = JSON.parse(localStorage.getItem(nomeListaAtual)) || { items: [] };


    // Obtenha o ID do item sendo editado (se existir)
    const idDoItemEdited = $("#editarItemBtn").data("index");

    // Encontre o item na lista com base no ID
    const itemEdited = lista.items.find(item => item.id === idDoItemEdited);



    if (itemEdited) {
        // Atualize os valores do item com os valores dos campos de edição
        itemEdited.name = nomeItemEdited;
        itemEdited.quantity = quantityEdited;
        itemEdited.price = precoEdited;
        itemEdited.unit = unitEdited;
    } else { // Caso contrário, estamos adicionando um novo item
        const novoItemID = generateUniqueID(lista);
        console.log(novoItemID);
        const item: ItemList = {
            id: novoItemID,
            name: nomeItemEdited,
            quantity: quantityEdited,
            price: precoEdited,
            unit: unitEdited,
            selected: false
        };
        lista.items.push(item);
    }

    // Atualize o LocalStorage com a lista atualizada
    localStorage.setItem(nomeListaAtual, JSON.stringify(lista));

    // Recarregue a lista e exiba-a novamente

    mostrarLista(nomeListaAtual);

    // Feche o modal de edição/adicão
    $("#nomeListaAtualModal").text(""); // Limpe o texto do modal
    //$(".box-content-modal").removeClass("active"); // Feche o modal
    fecharModal();
    // Após adicionar conteúdo, chame a função para ajustar a posição do modal
    //ajustarPosicaoModal();
}

// Função para excluir um item da lista
function excluirItem(nomeLista, index) {
    // Obtenha a lista atual do Local Storage
    const listaAtual = JSON.parse(localStorage.getItem(nomeLista));

    // Verifique se a lista existe
    if (listaAtual && Array.isArray(listaAtual.items)) {
        // Remova o item pelo índice
        listaAtual.items.splice(index, 1);

        // Salve a lista atualizada no Local Storage
        localStorage.setItem(nomeLista, JSON.stringify(listaAtual));

        // Atualize a interface do usuário ou realize outras ações necessárias
        console.log('Item excluído com sucesso.');

        // Atualize a lista de itens na interface do usuário
        mostrarLista(nomeLista);
    }
}


// Função para remover a lista atual
function removerListaAtual() {
    const nomeListaAtual = $("#nomeListaAtual").text();

    const listas = JSON.parse(localStorage.getItem("listas")) || [];


    exibirModal({
        title: "Deletar item",
        content: "Tem certeza que deseja <b>deletar</b> a lista atual?",
        buttons: [
            { text: "Sim", value: "confirm", style: "danger" },
            { text: "Cancelar", value: "cancel", style: "secondary" }
        ],
        result: function (resultado) {
            // Lidar com o resultado
            if (resultado === "confirm") {
                console.log("Botão OK foi clicado.");
                const index = listas.indexOf(nomeListaAtual);
                if (index > -1) {
                    listas.splice(index, 1);
                    localStorage.setItem("listas", JSON.stringify(listas));
                }

                // Remover a lista atual do LocalStorage
                localStorage.removeItem(nomeListaAtual);

                // Limpar a lista na página
                mostrarLista(nomeListaAtual);

                // Limpar o nome da lista atual
                $("#nomeListaAtual").text("");


                reloadPage();
            } else if (resultado === "cancel") {
                console.log("Botão Cancelar foi clicado.");
            }
        }
    });
}

// Função para limpar a lista atual
function limparLista() {
    const nomeListaAtual = $("#nomeListaAtual").text();


    exibirModal({
        title: "Limpar Lista",
        content: "Tem certeza que deseja <b>limpar</b> a lista?",
        buttons: [
            { text: "Sim", value: "confirm", style: "danger" },
            { text: "Cancelar", value: "cancel", style: "secondary" }
        ],
        result: function (resultado) {
            if (resultado === "confirm") {
                const lista = { items: [] };
                localStorage.setItem(nomeListaAtual, JSON.stringify(lista));
                mostrarLista(nomeListaAtual);
            } else if (resultado === "cancel") {
                console.log("Botão Cancelar foi clicado.");
            }
        }
    });
}


function abrirModal() {

    buttonAdd.hide();
    setTimeout(function () {
        $(".box-content-modal").addClass("active");

    }, 200); // Tempo de atraso em milissegundos (1 segundo no exemplo)

}

function fecharModal() {
    $(".box-content-modal").removeClass("active");
    buttonAdd.show();
}


// Função para aplicar o modo escuro ou claro
function applyDarkMode(isDarkMode) {
    const body = $('body');

    // Obtenha a cor de fundo atual
    const backgroundColor = body.css('background-color');

    // Atualize a cor da barra de status
    $('meta[name="theme-color"]').attr('content', isDarkMode ? '#333333' : backgroundColor);

    // Atualize a cor do tema
    $('meta[name="apple-mobile-web-app-status-bar-style"]').attr('content', isDarkMode ? 'default' : 'black-translucent');

    // Atualize o ícone do modo claro/escuro
    const darkModeToggle = $('.darkModeToggle');
    if (isDarkMode) {
        darkModeToggle.attr('name', 'sunny');
    } else {
        darkModeToggle.attr('name', 'moon');
    }

    // Aplicar classe dark-mode ao body se o modo escuro estiver ativado
    if (isDarkMode) {
        body.addClass('dark-mode');
    } else {
        body.removeClass('dark-mode');
    }

    // Armazene a preferência do usuário no Local Storage
    localStorage.setItem('darkMode', isDarkMode.toString());
}


// Função para alternar o modo claro/escuro
function toggleDarkMode() {


    const body = $('body');
    const isDarkMode = body.toggleClass('dark-mode').hasClass('dark-mode');
    applyDarkMode(isDarkMode);

    // Atualize o ícone do modo claro/escuro
    const darkModeToggle = $('.darkModeToggle');
    if (isDarkMode) {
        darkModeToggle.attr('name', 'sunny');
    } else {
        darkModeToggle.attr('name', 'moon');
    }

    // Armazene a preferência do usuário no Local Storage
    localStorage.setItem('darkMode', isDarkMode.toString());
}


function showList() {
    // Esconde o conteúdo da página definindo o corpo como invisível
    //$('body').css('visibility', 'hidden');
    $('.full-content.list').remove('hidden');


    // Recarrega a página após um breve atraso
    setTimeout(function () {
        // location.reload();
        //  $('.full-content.list').removeClass('hidden');
    }, 1000); // Tempo de atraso em milissegundos (1 segundo no exemplo)

}
function hideList() {
    // Esconde o conteúdo da página definindo o corpo como invisível
    $('.full-content.list').addClass('hidden');

    // Recarrega a página após um breve atraso
    setTimeout(function () {
    }, 1000); // Tempo de atraso em milissegundos (1 segundo no exemplo)

}


function reloadPage() {
    hideList();
    location.reload();
}


/* here */
// Função para exportar itens de uma lista específica
function exportarItensDaLista(nomeLista) {
    // Obtenha a lista atual do Local Storage
    const lista = JSON.parse(localStorage.getItem(nomeLista));

    if (lista && lista.items && lista.items.length > 0) {
        const dadosParaExportar = {
            items: lista.items
        };

        // Crie um objeto Blob para o arquivo JSON
        const blob = new Blob([JSON.stringify(dadosParaExportar)], { type: 'application/json' });

        // Crie um URL do Blob
        const url = URL.createObjectURL(blob);

        // Crie um link para o URL do Blob e defina atributos para o download
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeLista + '.json';

        // Clique automaticamente no link para iniciar o download
        a.click();

        // Libere o URL do Blob após o download
        URL.revokeObjectURL(url);
    } else {
        console.error('A lista está vazia ou não existe.');
    }
}

// Função para importar itens de um arquivo JSON e adicionar à lista atual
function importarItensDoArquivo(arquivo) {
    const leitor = new FileReader();

    leitor.onload = function (e) {

        const result = e.target?.result;

        if (typeof result === 'string') {
            const itensImportados = JSON.parse(result);


            if (itensImportados && Array.isArray(itensImportados.items)) {
                // Obtenha o nome da lista atual do elemento HTML
                const nomeListaAtual = $("#nomeListaAtual").text().trim();

                if (nomeListaAtual !== '') {
                    // Obtenha a lista atual do Local Storage ou crie uma nova lista vazia
                    const listaAtual = JSON.parse(localStorage.getItem(nomeListaAtual)) || { items: [] };

                    // Adicione os itens importados à lista atual
                    listaAtual.items = listaAtual.items.concat(itensImportados.items);

                    // Salve a lista atualizada no Local Storage
                    localStorage.setItem(nomeListaAtual, JSON.stringify(listaAtual));

                    // Atualize a interface do usuário ou realize outras ações necessárias
                    console.log('Itens importados com sucesso:', itensImportados.items);

                    // Atualize a lista de listas disponíveis
                    listarListas();
                    mostrarLista(nomeListaAtual);
                } else {
                    console.error('Nome da lista atual não encontrado.');
                }
            } else {
                console.error('Dados de importação inválidos.');
            }
        } else {
            console.error('O conteúdo lido não é uma string válida.');
        }
    };

    leitor.readAsText(arquivo);
}
