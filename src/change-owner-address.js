const { areYouSureAnswer, setup, commonTxOperations } = require('./utils');
import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, ContractCallPayloadBuilder, ContractFunction, Address, TypedValue, AddressValue,  } = require('@multiversx/sdk-core');
const { chain, shortChainId, commonBuiltInOpertationsGasLimit,  } = require('./config');

const changeOwnerAddress = async () => {
  const promptQuestion = [
    {
      type: 'text',
      name: 'smartContractAddress',
      message:
        'Please provide the smart contract address where the wallet (PEM) you use is an owner.\n',
      validate: (value) => (!value ? 'Required!' : true),
    },
    {
      type: 'text',
      name: 'newOwnerAddress',
      message:
        'Please provide the wallet address of the new smart contract owner.\n',
      validate: (value) => (!value ? 'Required!' : true),
    },
  ];

  try {
    const { smartContractAddress, newOwnerAddress } =
      await prompts(promptQuestion);

    if (!smartContractAddress || !newOwnerAddress) {
      console.log(
        "You have to provide the smart contract address and the new owner's address!"
      );
      exit();
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [new AddressValue(new Address(newOwnerAddress))];

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('ChangeOwnerAddress'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit,
      receiver: new Address(smartContractAddress),
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log(e.message);
    exit();
  }
};
