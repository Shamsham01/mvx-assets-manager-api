import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, Transaction, BytesValue, Address, ContractCallPayloadBuilder, ContractFunction, TypedValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, issueTokenPayment, builtInSC, commonOpertationsGasLimit, sftNftTokenProperties,  } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'name',
    message:
      'Please provide the collection token name (3-20 characters, alphanumeric)\n',
    validate: (value) => {
      if (!value) return 'Required!';
      if (value.length > 20 || value.length  {
      if (!value) return 'Required!';
      if (value.length > 10 || value.length  ({
      title,
      value,
      description,
    })),
  },
];

const issueNft = async () => {
  try {
    const { name, ticker, tokenProperties } = await prompts(promptQuestions);

    if (!name || !ticker) {
      console.log('You have to provide the name and ticker for your token!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const payment = TokenTransfer.egldFromAmount(issueTokenPayment);

    const args = [
      BytesValue.fromUTF8(name),
      BytesValue.fromUTF8(ticker),
    ];

    for (const property of sftNftTokenProperties) {
      let propertyEnabled = false;

      if (tokenProperties.includes(property.name)) {
        propertyEnabled = true;
      }

      args.push(BytesValue.fromUTF8(property.name));
      args.push(BytesValue.fromUTF8(propertyEnabled.toString()));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('issueNonFungible'))
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
