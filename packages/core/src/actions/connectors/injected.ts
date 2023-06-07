import { URL, WalletNames } from "../../types"
import { Connector } from "./base"

export class MetaMask extends Connector {
  readonly id: string
  readonly name: WalletNames
  readonly install?: URL
  readonly deeplink?: URL

  constructor(){
    const getProvider = ()=>{
      if (typeof window === 'undefined') return
      return window.ethereum
    }

    super(getProvider)

    this.id = 'Injected'
    this.name = 'Injected'
  }
}