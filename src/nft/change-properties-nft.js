import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, Address, ContractCallPayloadBuilder, ContractFunction, TypedValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, builtInSC, commonOpertationsGasLimit, sftNftTokenProperties,  } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'multiselect',
    name: 'tokenProperties',
    message: `Please choose a new set of the properties for the token.\n`,
    choices: sftNftTokenProperties.map((property) => ({
      title,
      value,
      description,
    })),
  },
];

const changePropertiesNft = async () => {
  try {
    const { ticker, tokenProperties } = await prompts(promptQuestions);

    if (!ticker) {
      console.log('You have to provide the ticker!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [BytesValue.fromUTF8(ticker)];

    for (const property of sftNftTokenProperties) {
      let propertyEnabled = false;

      if (tokenProperties.includes(property.name)) {
        propertyEnabled = true;
      }

      args.push(BytesValue.fromUTF8(property.name));
      args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('controlChanges'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit,
      receiver: new Address(builtInSC.trim()),
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
