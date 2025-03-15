const { areYouSureAnswer, setup, commonTxOperations } = require('./utils');
import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, ContractCallPayloadBuilder, ContractFunction, Address,  } = require('@multiversx/sdk-core');
const { chain, shortChainId, commonBuiltInOpertationsGasLimit,  } = require('./config');

const claimDeveloperRewards = async () => {
  const promptQuestion = [
    {
      type: 'text',
      name: 'smartContractAddress',
      message:
        'Please provide the smart contract address where the wallet (PEM) you use is an owner.\n',
      validate: (value) => (!value ? 'Required!' : true),
    },
  ];

  try {
    const { smartContractAddress } = await prompts(promptQuestion);

    if (!smartContractAddress) {
      console.log('You have to provide the smart contract address!');
      exit();
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('ClaimDeveloperRewards'))
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
