import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, ContractCallPayloadBuilder, ContractFunction, TypedValue, Address, AddressValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, commonOpertationsGasLimit, builtInSC,  } = require('../config');

const promptQuestions = [
  {
    type: 'select',
    name: 'type',
    message:
      'Do you want to freeze or unfreeze the token balance in a specific account, preventing transfers to and from that account?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Freeze', value: 'freeze' },
      { title: 'Unfreeze', value: 'unfreeze' },
    ],
  },
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'address',
    message: (prev, values) => `Please provide the address to ${values.type}\n`,
    validate: (value) => (!value ? 'Required!' : true),
  },
];

const freezeUnfreezeEsdt = async () => {
  try {
    const { ticker, address, type } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker and address!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [
      BytesValue.fromUTF8(ticker),
      new AddressValue(new Address(address)),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(
        new ContractFunction(type === 'freeze' ? 'freeze' : 'unFreeze')
      )
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit,
      receiver: new Address(builtInSC),
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
