import { web3Store } from "../store/web3store"
import { ConnectArgs, Init } from "../types"
import { KEY_WALLET } from "../utils/constants"

export async function connectW3(options: ConnectArgs): Promise<any>{

  const { connector, chainId } = options

  return await connector.connect()
}

export function disconnectW3(){
  const [connector] = web3Store.getState().connectors.filter(c => c.name === window?.localStorage.getItem(KEY_WALLET))
  
  if(connector){
    connector.disconnect()
  }else{
    for(let c of web3Store.getState().connectors)
    c.disconnect()
  }
}

export async function w3init({connectors, chains}: Init){
  if(typeof window === 'undefined') return
  web3Store.setState((state)=>({chains, connectors}))
  for(let c of connectors)
  c.init()
}