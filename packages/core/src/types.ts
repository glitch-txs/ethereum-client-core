import { Connector } from "./actions/connectors/base"
import type { Chain } from '@wagmi/chains'

export type URL = `https://${string}`

export type Address = `0x${string}`

export type Init = {
  connectors: Connector[]
  chains: Chain[]
}

export type WalletNames = 'Coinbase' | 'MetaMask' | 'Phantom' | 'Trust Wallet' | 'WalletConnect' | 'Injected'

export type EIP1193Provider = any

export interface ModalConnectorsOpts {
  chains: Chain[]
  version: 1 | 2
  projectId: string
}

export interface WalletConnectProviderOpts {
  projectId: string
}

export type ConnectorId = 'injected' | 'metaMask' | 'walletConnect' | 'walletConnectV1'

export type ConnectArgs = {
  connector: Connector
  chainId?: Number
}

export type Network = {
  chain?: Chain & { unsupported?: boolean }
  chains: Chain[]
}