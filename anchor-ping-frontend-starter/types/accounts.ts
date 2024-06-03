import { BN, IdlAccounts } from '@project-serum/anchor'

export type CounterProgram = {
  address: 'HAhgiYTV71vMJ7AEcjCMLif9LzAURhqFJB4JrKxfuXKP'
  name: 'anchor_counter'
  version: '0.1.0'
  metadata: {
    name: 'anchor_counter'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'decrement'
      accounts: [
        {
          name: 'counter'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isSigner: true
          isMut: false
        }
      ]
      args: []
    },
    {
      name: 'increment'
      accounts: [
        {
          name: 'counter'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isSigner: true
          isMut: false
        }
      ]
      args: []
    },
    {
      name: 'initialize'
      accounts: [
        {
          name: 'counter'
          isMut: true
          isSigner: true
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'system_program'
          address: '11111111111111111111111111111111'
          isSigner: false
          isMut: false
        }
      ]
      args: []
    }
  ]
  accounts: [
    {
      name: 'Counter'
      type: {
        kind: 'struct'
        fields: [{ name: 'count'; type: 'u64' }]
      }
    }
  ]
  types: [
    {
      name: 'Counter'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'count'
            type: 'u64'
          }
        ]
      }
    }
  ]
}

export const IDL: CounterProgram = {
  address: 'HAhgiYTV71vMJ7AEcjCMLif9LzAURhqFJB4JrKxfuXKP',
  name: 'anchor_counter',
  version: '0.1.0',
  metadata: {
    name: 'anchor_counter',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  instructions: [
    {
      name: 'decrement',
      accounts: [
        {
          name: 'counter',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isSigner: true,
          isMut: false,
        },
      ],
      args: [],
    },
    {
      name: 'increment',
      accounts: [
        {
          name: 'counter',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isSigner: true,
          isMut: false,
        },
      ],
      args: [],
    },
    {
      name: 'initialize',
      accounts: [
        {
          name: 'counter',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
          isSigner: false,
          isMut: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'Counter',
      type: {
        kind: 'struct',
        fields: [{ name: 'count', type: 'u64' }],
      },
    },
  ],
  types: [
    {
      name: 'Counter',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'count',
            type: 'u64',
          },
        ],
      },
    },
  ],
}

export type CounterAccount = IdlAccounts<CounterProgram>['Counter'] 
