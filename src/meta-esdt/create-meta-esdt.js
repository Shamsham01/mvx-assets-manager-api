import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, ContractCallPayloadBuilder, ContractFunction, TypedValue, BigUIntValue,  } = require('@multiversx/sdk-core');
const Bignumber = require('bignumber.js');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, nftCreateOpertationsGasLimit } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the existing collection token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'initialQuantity',
    message:
      'Please provide the initial supply (remember to take into consideration the number of decimals for example 100 with 2 decimal places will be 10000. You defined them when issuing.)\n',
    validate: (value) =>
      !value || new Bignumber(value).isNaN() ? 'Required number!' : true,
  },
  {
    type: 'text',
    name: 'name',
    message: 'Please provide the Meta ESDT token name\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'attributes',
    message:
      "Provide attributes. It's optional. (It can be any string. For example: 'someData:someValue;someArray:val1,val2,val3')\n",
  },
];

const createMetaEsdt = async () => {
  try {
    const { ticker, initialQuantity, name, attributes } =
      await prompts(promptQuestions);

    if (!initialQuantity || !ticker || !name) {
      console.log(
        'You have to provide the ticker, initial quantity and name for your token!'
      );
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [
      BytesValue.fromUTF8(ticker),
      new BigUIntValue(new Bignumber(initialQuantity)),
      BytesValue.fromUTF8(name),
      BytesValue.fromUTF8(''),
      BytesValue.fromUTF8(''),
      BytesValue.fromUTF8(attributes || ''),
      BytesValue.fromUTF8(''),
    ];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('ESDTNFTCreate'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit: nftCreateOpertationsGasLimit + data.length() * 1500 + 50000,
      receiver: signer.getAddress(),
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
