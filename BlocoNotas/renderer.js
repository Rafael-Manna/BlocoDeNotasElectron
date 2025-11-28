    let conteudo = document.getElementById('notaInput').value;

function salvarNota() {

     window.api.salvarNota(conteudo.value).then((caminho) =>{
        document.getElementById("caminho").innerHTML = `Caminho: ${caminho}`
    })    
}