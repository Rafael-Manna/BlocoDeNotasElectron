    let conteudo = document.getElementById('notaInput')

function salvarNota1() {
     window.api.salvarNota(conteudo.value).then((caminho) =>{
        document.getElementById("caminho").innerHTML = `Caminho: ${caminho}`
    })    
}

window.api.receberNota(() => {
    salvarNota1()
})