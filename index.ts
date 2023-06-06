type Chain = any
type Config = any
type Connector = any

export type ConnectorId = 'injected' | 'metaMask' | 'walletConnect' | 'walletConnectV1'

export interface ModalConnectorsOpts {
  chains: Chain[]
  version: 1 | 2
  projectId: string
}

export interface WalletConnectProviderOpts {
  projectId: string
}

type EthereumClient = {
  wagmi: {
    connectors: {[key: number]:{
      id: string //name of the connector
    }}
  }
  chains: Chain[]
  namespace: 'eip155'
  walletConnectVersion: 1 | 2
  getWalletConnectConnectors: ()=> ({ isV2: Boolean, connector: Connector })
  connectWalletConnectV1: (connector: Connector, onUri: (uri: string) => void)=>Promise<any>
  connectWalletConnectV2: (connector: Connector, onUri: (uri: string) => void)=>Promise<any>
  getConnectorById: (id: ConnectorId | string)=>Connector
  getConnectors: ()=>Connector[] //avoids WalletConnect connector

  connectWalletConnect: (onUri: (uri: string) => void, chainId?: number)=>Promise<any>
  connectConnector:(connectorId: ConnectorId | string, chainId?: number)=> any // data

  isInjectedProviderInstalled: ()=> boolean //check for window.ethereum
  safeCheckInjectedProvider:(providerId: string)=>boolean

  getConnectedChainIds:()=>'ALL' | string[]

  disconnect: any
  getAccount: any
  watchAccount: any
  fetchBalance: any
  getNetwork: any
  watchNetwork: any
  switchNetwork: any

  // -- web3modal (optional) ----------------------- //
  fetchEnsName: any
  fetchEnsAvatar: any
}