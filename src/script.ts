// Carregar a lista de listas quando a página é carregada
const buttonAdd = {
    show: () => {
        $(".btn-add").addClass("show").removeClass("hidden");
    },
    hide: () => {
        $(".btn-add").addClass("hidden").removeClass("show");
    }
};
