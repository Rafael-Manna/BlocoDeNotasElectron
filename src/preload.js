import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    salvarNota: (conteudo) => ipcRenderer.invoke('salvar', conteudo),
})

