import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, AddressValue, Address, ContractCallPayloadBuilder, ContractFunction, TypedValue,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, builtInSC, commonOpertationsGasLimit, sftTokenSpecialRoles,  } = require('../config');

type OperationType = 'set' | 'unset';

const promptQuestions = (type) => [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'address',
    message: `Please provide the address ${
      type === 'set' ? 'to assign' : 'with'
    } the role.\n`,
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'multiselect',
    name: 'specialRoles',
    message: `Please choose special roles to ${
      type === 'set' ? 'assign' : 'remove'
    }.\n`,
    choices: sftTokenSpecialRoles.map((property) => ({
      title,
      value,
      description,
    })),
  },
];

const toggleSpecialRolesSft = async (type) => {
  try {
    const { ticker, address, specialRoles } = await prompts(
      promptQuestions(type)
    );

    if (!ticker || !address) {
      console.log('You have to provide the ticker and address!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [
      BytesValue.fromUTF8(ticker),
      new AddressValue(new Address(address.trim())),
    ];

    for (const role of sftTokenSpecialRoles) {
      if (specialRoles.includes(role.name)) {
        args.push(BytesValue.fromUTF8(role.name));
      }
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(
        new ContractFunction(
          type === 'set' ? 'setSpecialRole' : 'unSetSpecialRole'
        )
      )
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
