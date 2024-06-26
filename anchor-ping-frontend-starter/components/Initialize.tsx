import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { FC, useEffect, useState } from 'react'
import idl from '../idl.json'
import { Button } from '@chakra-ui/react'
import { Keypair, PublicKey } from '@solana/web3.js'

const PROGRAM_ID = new anchor.web3.PublicKey(
  `HAhgiYTV71vMJ7AEcjCMLif9LzAURhqFJB4JrKxfuXKP`
)

export interface Props {
  setCounter: (counter: PublicKey) => void
  setTransactionUrl: (str: string) => void
}

export const Initialize: FC<Props> = ({ setCounter, setTransactionUrl }) => {
  const [program, setProgram] = useState<anchor.Program>()

  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  useEffect(() => {
    let provider: anchor.Provider

    try {
      provider = anchor.getProvider()
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet, {})
      anchor.setProvider(provider)
    }

    const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider)
    setProgram(program)
  }, [])

  const onClick = async () => {
    const newAccount = Keypair.generate()
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: newAccount.publicKey,
        user: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newAccount])
      .rpc()

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    setCounter(newAccount.publicKey)
  }

  return <Button onClick={onClick}>Initialize Counter</Button>
}
