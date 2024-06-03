import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { FC, useCallback, useEffect, useState } from 'react'
import idlJson from '../idl.json'
const idl: anchor.Idl = idlJson as anchor.Idl
import { Button, HStack, VStack, Text } from '@chakra-ui/react'
import { PublicKey } from '@solana/web3.js'
import { CounterAccount } from '../types/accounts'
import { IdlAccount } from '@project-serum/anchor/dist/cjs/idl'

const PROGRAM_ID = `HAhgiYTV71vMJ7AEcjCMLif9LzAURhqFJB4JrKxfuXKP`

export interface Props {
  counter: PublicKey
  setTransactionUrl: (str: string) => void
}

export const Increment: FC<Props> = ({ counter, setTransactionUrl }) => {
  const [count, setCount] = useState(0)
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
    if (!program) {
      const prgm = new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider)
      setProgram(prgm)
      refreshCount(prgm)
    } else {
      refreshCount(program)
    }
  }, [])

  const incrementCount = async () => {
    const sig = await program.methods
      .increment()
      .accounts({ counter, user: wallet.publicKey })
      .rpc()

    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
  }

  const refreshCount = async (program: anchor.Program<typeof idl>) => {
    const counterAccount = (await program.account.counter.fetch(
      counter
    )) as CounterAccount
    setCount(counterAccount.count.toNumber())
  }

  return (
    <VStack>
      <HStack>
        <Button onClick={incrementCount}>Increment Counter</Button>
        <Button onClick={() => refreshCount(program)}>Refresh count</Button>
      </HStack>
      <Text color="white">Count: {count}</Text>
    </VStack>
  )
}
