let conteudo = document.getElementById('notaInput')
let caminho = document.getElementById('caminho')

function salvarNota1() {
    window.api.salvarNota(conteudo.value).then((caminhoSalvo) => {
        caminho.innerHTML = `Caminho: ${caminhoSalvo}`
    })
}

function abrirNota1() {
    window.api.abrirNota().then((data) => {
        if (data && data.content) {
            conteudo.value = data.content
            caminho.innerHTML = `Caminho: ${data.path || 'Não salvo'}`
        }
    })
}

// Escutar eventos do menu
window.api.receberNota(() => {
    salvarNota1()
})
window.api.receberAbrirNota(() => {
    abrirNota1()
})

// Você pode querer adicionar um evento para abrir também
// window.api.receberAbrirNota(() => {
//     abrirNota1()
// })