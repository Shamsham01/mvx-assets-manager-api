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
    message:
      'Please provide the Meta ESDT token ticker/id (ex. ABCD-ds323d-0d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'amount',
    message:
      'Please provide the amount of Meta ESDT to send (ex. 0.1 is 0.1 amount of Meta ESDT token)\n',
    validate: (value) =>
      value && !Number.isNaN(value) && Number(value) > 0
        ? true
        : `Please provide a number, should be a proper Meta ESDT amount for that specific token, bigger than 0`,
  },
];

const sendMetaEsdt = async () => {
  try {
    const { address, amount, token } = await prompts(promptQuestions);

    if (!address || !amount || !token) {
      console.log('You have to provide the address, token ticker and amount!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const metaEsdtOnNetwork = await axios.get(`${publicApi[chain]}/nfts/${token.trim()}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const numDecimals = metaEsdtOnNetwork?.data?.decimals;
    const nonce = metaEsdtOnNetwork?.data?.nonce;
    const collectionTicker = metaEsdtOnNetwork?.data?.ticker;

    if (
      numDecimals !== undefined &&
      numDecimals !== null &&
      nonce !== undefined &&
      nonce !== null &&
      collectionTicker !== undefined &&
      collectionTicker !== null
    ) {
      const transfer = TokenTransfer.metaEsdtFromAmount(
        collectionTicker,
        nonce,
        amount,
        numDecimals
      );

      const factory = new TransferTransactionsFactory(new GasEstimator());

      const tx = factory.createESDTNFTTransfer({
        tokenTransfer,
        sender: signer.getAddress(),
        destination: new Address(address.trim()),
        chainID,
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } else {
      console.log(
        "Can't get the information about the Meta ESDT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e )?.message);
  }
};
