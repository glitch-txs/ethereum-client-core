import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, connectors, mainnet } from '@glitch-txs/ethereum-client'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const ethereumClient = new EthereumClient(connectors(),[mainnet])

export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
    <Component {...pageProps} />
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
