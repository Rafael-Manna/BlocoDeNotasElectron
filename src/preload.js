import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    salvarNota: (conteudo) => ipcRenderer.invoke('salvar', conteudo),
    receberNota: (callback) => ipcRenderer.on('salvarNota', () => callback()),
    abrirNota: () => ipcRenderer.invoke('open'),
    receberAbrirNota: (callback) => ipcRenderer.on('abrirNota', () => callback())
})