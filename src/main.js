import {app, BrowserWindow, nativeTheme, ipcMain, Menu} from 'electron'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) 

let janela = null 

function criarJanela(){
    nativeTheme.themeSource = 'dark' // modo claro/escuro da janela
    janela = new BrowserWindow({ 
        width: 800, height: 800,
        title: "Aplicação Desktop",  
        resizable: true,     
        webPreferences: {
            nodeIntegration: false,           
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname,'preload.js'),
            sandbox: false,
            setZoomFactor: 1.0 //deixando o zoom em 100%
        }
    })
    janela.loadFile('../BlocoNotas/notas.html') 
   
    
    janela.removeMenu() //remover menu padrão do electron

    janela.webContents.on('did-finish-load', () => { //evento disparado quando a janela termina de carregar
        janela.webContents.setZoomFactor(1.0) 
    }) 
 let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu) // criação do menu
    janela.webContents.on('context-menu', () => {
        menu.popup({window: janela})
    })
    janela.webContents.openDevTools();
}

const template = [
    {label: "Aplicação", 
        submenu:[
            {label: "Novo", click: () => criarJanela()},  
            {label: "Sair", role: 'quit'}]}, 
            {label: "Sobre", click: () => criarJanela2()},
    {label: "Zoom",
        submenu:[{label: 'Ampliar',  role: 'zoomin' }, 
                {label: 'Diminuir', role: 'zoomout'}]
    },
    {label: 'Aparência',
            submenu:[
                {label: 'Trocar tema',  
                    click: () => nativeTheme.themeSource = 'dark'},
                    {label: 'Tema claro',  
                    click: () => nativeTheme.themeSource = 'light'}                                       
            ]
      }
]

app.whenReady().then(() => { 
        criarJanela()

})
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

let caminhoArquivo = path.join(__dirname,'arquivo.txt')

//Função para salvar o arquivo
function salvarNota (conteudo){
    try{
        fs.writeFileSync(caminhoArquivo, conteudo, 'utf-8') 
    }catch(err){
        console.error(err)
    }
}
ipcMain.handle('salvar', (event, texto) =>{
    // console.log('Texto: ',texto)
    salvarNota(texto)    
    return caminhoArquivo
})
