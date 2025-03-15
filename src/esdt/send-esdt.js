import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, GasEstimator, TransferTransactionsFactory, Address,  } = require('@multiversx/sdk-core');
const axios = require('axios');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, publicApi } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'address',
    message: 'Please provide the receiver address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'token',
    message: 'Please provide the ESDT token ticker/id (ex. ABCD-ds323d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'amount',
    message:
      'Please provide the amount of ESDT to send (ex. 1.5 is 1.5 amount of an ESDT token)\n',
    validate: (value) =>
      value && !Number.isNaN(value) && Number(value) > 0
        ? true
        : `Please provide a number, should be a proper ESDT amount for that specific token, bigger than 0`,
  },
];

const sendEsdt = async () => {
  try {
    const { address, amount, token } = await prompts(promptQuestions);

    if (!address || !amount || !token) {
      console.log('You have to provide the address, token ticker and amount!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const esdtOnNetwork = await axios.get(
      `${publicApi[chain]}/tokens/${token.trim()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const numDecimals = esdtOnNetwork?.data?.decimals;

    if (numDecimals !== undefined && numDecimals !== null) {
      const transfer = TokenTransfer.fungibleFromAmount(
        token,
        amount,
        numDecimals
      );

      const factory = new TransferTransactionsFactory(new GasEstimator());

      const tx = factory.createESDTTransfer({
        tokenTransfer,
        sender: signer.getAddress(),
        receiver: new Address(address.trim()),
        chainID,
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } else {
      console.log(
        "Can't get the information about the ESDT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e )?.message);
  }
};
