import { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { AppBar } from '../components/AppBar'
import { useWallet } from '@solana/wallet-adapter-react'
import { Increment } from '../components/Increment'
import { Initialize } from '../components/Initialize'
import { useState } from 'react'
import Head from 'next/head'
import { Spacer, VStack, Text, Button, Box, Stack } from '@chakra-ui/react'
import { PublicKey } from '@solana/web3.js'

const Home: NextPage = (props) => {
  const [counter, setCounter] = useState<PublicKey>()
  const [transactionUrl, setTransactionUrl] = useState('')
  const wallet = useWallet()

  return (
    <div className={styles.App}>
      <Head>
        <title>Anchor Frontend Example</title>
      </Head>
      <Box
        h="calc(100vh)"
        w="full"
      >
        <Stack
          w="full"
          h="calc(100vh)"
          justify="center"
        >
          <AppBar />
          <div className={styles.AppBody}>
            {wallet.connected ? (
              counter ? (
                <VStack>
                  <Increment
                    counter={counter}
                    setTransactionUrl={setTransactionUrl}
                  />
                </VStack>
              ) : (
                <Initialize
                  setCounter={setCounter}
                  setTransactionUrl={setTransactionUrl}
                />
              )
            ) : (
              <Text color="white">Connect Wallet</Text>
            )}
            <Spacer />
            {transactionUrl && (
              <Button
                onClick={() => window.open(transactionUrl, '_blank')}
                margin={8}
              >
                View most recent transaction
              </Button>
            )}
          </div>
        </Stack>
      </Box>
    </div>
  )
}

export default Home
