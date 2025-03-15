import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, TransferTransactionsFactory, GasEstimator, Address,  } = require('@multiversx/sdk-core');
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
    message: 'Please provide the SFT token id (ex. ABCD-ds323d-0d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'amount',
    message:
      'Please provide the amount of SFT to send (ex. 1 is 1 amount of an SFT token)\n',
    validate: (value) =>
      value && !Number.isNaN(value) && Number(value) > 0
        ? true
        : `Please provide a number, should be a proper SFT amount for that specific token, bigger than 0`,
  },
];

const sendSft = async () => {
  try {
    const { address, token, amount } = await prompts(promptQuestions);

    if (!address || !token || !amount) {
      console.log('You have to provide the address, SFT token id and amount!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const sftOnNetwork = await axios.get(
      `${publicApi[chain]}/nfts/${token.trim()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const nonce = sftOnNetwork?.data?.nonce;
    const collectionTicker = sftOnNetwork?.data?.ticker;

    if (
      nonce !== undefined &&
      nonce !== null &&
      collectionTicker !== undefined &&
      collectionTicker !== null
    ) {
      const transfer = TokenTransfer.semiFungible(
        collectionTicker,
        nonce,
        amount
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
        "Can't get the information about the SFT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e )?.message);
  }
};
