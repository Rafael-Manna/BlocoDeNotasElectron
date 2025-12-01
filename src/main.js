import {app, BrowserWindow, nativeTheme, ipcMain, Menu, dialog} from 'electron'
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
  //  janela.webContents.openDevTools();
}

const template = [
    {label: "Aplicação", 
        submenu:[
            {label: "Salvar", click: () => janela.webContents.send('salvarNota')},
            {label: "Abrir", click: () => janela.webContents.send('abrirNota')},  
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

// Handler para salvar nota
ipcMain.handle('salvar', async(event, conteudo) =>{
    let dialogo = await dialog.showSaveDialog({
        defaultPath: 'nota.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        title: 'Salvar Nota'
    })
    if (dialogo.canceled) {
        return 
    } else {
        caminhoArquivo = dialogo.filePath
        salvarNota(conteudo)    
        return caminhoArquivo
    }
})

//Função para abrir o arquivo
function lerNota(caminho) {
    try{
        return fs.readFileSync(caminho, 'utf-8') 
    }catch(err){
        console.error(err)
        return ''
    }
}

// Handler para abrir nota
ipcMain.handle('open', async(event) =>{
    let dialogo = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
        title: 'Abrir Nota'
    })
    
    if (dialogo.canceled || dialogo.filePaths.length === 0) {
        return { content: '', path: '' }
    } else {
        caminhoArquivo = dialogo.filePaths[0]
        const conteudo = lerNota(caminhoArquivo)
        return { content: conteudo, path: caminhoArquivo }
    }
})

// Handler para enviar evento de salvar para a janela
ipcMain.on('salvarNota', () => {
    janela.webContents.send('salvarNota')
})

// Handler para enviar evento de abrir para a janela
ipcMain.on('abrirNota', () => {
    janela.webContents.send('abrirNota')
})

// Função auxiliar para criar janela "Sobre"
function criarJanela2() {
    const aboutWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: "Sobre",
        resizable: false,
        modal: true,
        parent: janela
    })
    
    aboutWindow.loadURL(`data:text/html;charset=utf-8,
        <html>
            <body style="font-family: Arial; padding: 20px; text-align: center;">
                <h2>Bloco de Notas</h2>
                <p>Versão 1.0.0</p>
                <p>Aplicação de bloco de notas simples</p>
                <p>Desenvolvido com Electron</p>
            </body>
        </html>
    `)
}