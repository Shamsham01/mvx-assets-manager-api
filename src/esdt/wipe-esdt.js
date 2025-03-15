import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, ContractCallPayloadBuilder, ContractFunction, TypedValue, Address, AddressValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, commonOpertationsGasLimit, builtInSC,  } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'address',
    message:
      'Please provide the frozen address from which the token will be wiped\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

const wipeEsdt = async () => {
  try {
    const { ticker, address } = await prompts(promptQuestions);

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
      .setFunction(new ContractFunction('wipe'))
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
