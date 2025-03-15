import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, ContractCallPayloadBuilder, ContractFunction, TypedValue, Address,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, commonOpertationsGasLimit, builtInSC,  } = require('../config');

const promptQuestions = [
  {
    type: 'select',
    name: 'type',
    message: 'Do you want to pause or unpause all transactions of the token?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Pause', value: 'pause' },
      { title: 'Unpause', value: 'unpause' },
    ],
  },
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

const pauseUnpauseEsdt = async () => {
  try {
    const { ticker, type } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [BytesValue.fromUTF8(ticker)];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction(type === 'pause' ? 'pause' : 'unPause'))
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
