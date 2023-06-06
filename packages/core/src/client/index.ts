import { connectW3, disconnectW3 } from "../actions"
import { Connector } from "../actions/connectors/base"
import { web3Store } from "../store/web3store"
import { Address, ConnectArgs, ConnectorId, Network } from "../types"

type Chain = any

// -- helpers ------------------------------------------- //
const ADD_ETH_CHAIN_METHOD = 'wallet_addEthereumChain'

export class EthereumClient {
  private readonly connectors: Connector[] = []
  public walletConnectVersion = 2
  public readonly chains: Chain[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(connectors: Connector[], chains: Chain[]) {
    this.connectors = connectors
    this.chains = chains
  }

  // -- private ------------------------------------------- //
  private getWalletConnectConnectors() {
    const connector = this.connectors.find((c: Connector) => c.id === 'walletConnect')
    if (!connector) {
      throw new Error('WalletConnectConnector is required')
    }
    return { isV2: true, connector }
  }

  private async connectWalletConnectV1(connector: Connector, onUri: (uri: string) => void) {
    return
  }

  private async connectWalletConnectV2(connector: Connector, onUri: (uri: string) => void) {
    await connector.getProvider()

    return new Promise<void>(resolve => {
      connector.once('message', event => {
        if (event.type === 'display_uri') {
          onUri(event.data as string)
          resolve()
        }
      })
    })
  }

  // -- public web3modal ---------------------------------- //
  public namespace = 'eip155'

  public getConnectorById(id: ConnectorId | string) {
    const connector = this.connectors.find(item => item.id === id)
    if (!connector) {
      throw new Error(`Connector for id ${id} was not found`)
    }

    return connector
  }

  public getConnectors() {
    const connectors = this.connectors.filter(connector => !connector.id.includes('walletConnect'))

    return connectors
  }

  public async connectWalletConnect(onUri: (uri: string) => void, chainId?: number) {
    const { connector, isV2 } = this.getWalletConnectConnectors()
    const options: ConnectArgs = { connector }
    if (chainId) {
      options.chainId = chainId
    }
    const handleProviderEvents = this.connectWalletConnectV2.bind(this)

    return Promise.all([connectW3(options), handleProviderEvents(connector, onUri)])
  }

  public async connectConnector(connectorId: ConnectorId | string, chainId?: number) {
    const connector = this.getConnectorById(connectorId)
    const options: ConnectArgs = { connector }
    if (chainId) {
      options.chainId = chainId
    }
    const data = await connectW3(options)

    return data
  }

  public isInjectedProviderInstalled() {
    return typeof window.ethereum !== 'undefined'
  }

  public safeCheckInjectedProvider(providerId: string) {
    try {
      const stringId = String(providerId)

      // @ts-expect-error - Structure is correct
      return Boolean(window.ethereum?.[stringId])
    } catch (err) {
      console.error(err)

      return false
    }
  }

  public async getConnectedChainIds() {
    const { connector } = this.getWalletConnectConnectors()

    const provider = await connector.getProvider()
    const sessionNamespaces = provider.signer?.session?.namespaces
    const sessionMethods = sessionNamespaces?.[this.namespace]?.methods
    if (sessionMethods?.includes(ADD_ETH_CHAIN_METHOD)) {
      return 'ALL'
    }
    if (sessionNamespaces) {
      const sessionAccounts: string[] = []
      Object.keys(sessionNamespaces).forEach(namespaceKey => {
        if (namespaceKey.includes(this.namespace)) {
          sessionAccounts.push(...sessionNamespaces[namespaceKey].accounts)
        }
      })
      const sessionChains = sessionAccounts?.map((a: string) => a.split(':')[1])

      return sessionChains
    }
    return 'ALL'
  }

  
  public disconnect = disconnectW3

  public getAccount = ()=>web3Store.getState().userAccount

  public watchAccount(fn: (account: Address | '')=> any){
    return web3Store.subscribe((state)=>fn(state.userAccount))
  }

  public fetchBalance({ address, token }: any){
    return { formatted: 0, symbol: 'ETH' }
  }

  public getNetwork = ()=> {
    const chain = {
      ...web3Store.getState().chains[0],
      unsupported: false
    }
    return { chain, chains: web3Store.getState().chains }
  }

  public watchNetwork(fn: (network: Network)=> any){
    return web3Store.subscribe((state)=>{
      const chain = {
        ...web3Store.getState().chains[0],
        unsupported: false
      }
      return fn({ chain: chain as Chain, chains: web3Store.getState().chains })
    })
  }

  public switchNetwork({ chainId }: { chainId: number }){
    web3Store.getState().childProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    })
  }

  // -- public web3modal (optional) ----------------------- //
  public fetchEnsName = ()=>'Test.eth'

  public fetchEnsAvatar = ()=>{}

}