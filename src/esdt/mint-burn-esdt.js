import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const Bignumber = require('bignumber.js');
const { Transaction, BytesValue, BigUIntValue, ContractCallPayloadBuilder, ContractFunction, TypedValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, specialOpertationsGasLimit } = require('../config');

const promptQuestions = [
  {
    type: 'select',
    name: 'type',
    message: 'Do you want to mint or burn supply?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Mint', value: 'mint' },
      { title: 'Burn', value: 'burn' },
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
    name: 'supply',
    message: (prev, values) =>
      `Please provide the amount to ${values.type} (Remember about decimal places)\n`,
    validate: (value) =>
      !value || new Bignumber(value).isNaN() ? 'Required number!' : true,
  },
];

const mintBurnEsdt = async () => {
  try {
    const { ticker, supply, type } = await prompts(promptQuestions);

    if (!ticker || !supply) {
      console.log('You have to provide the ticker and supply!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [
      BytesValue.fromUTF8(ticker),
      new BigUIntValue(new Bignumber(supply)),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(
        new ContractFunction(
          type === 'mint' ? 'ESDTLocalMint' : 'ESDTLocalBurn'
        )
      )
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit,
      receiver,
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
