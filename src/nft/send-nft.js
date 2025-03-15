import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, Address, TransferTransactionsFactory, GasEstimator,  } = require('@multiversx/sdk-core');
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
    message: 'Please provide the NFT token id (ex. ABCD-ds323d-0d)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

const sendNft = async () => {
  try {
    const { address, token } = await prompts(promptQuestions);

    if (!address || !token) {
      console.log(
        'You have to provide the address and NFT token id and amount!'
      );
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const nftOnNetwork = await axios.get(
      `${publicApi[chain]}/nfts/${token.trim()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    const nonce = nftOnNetwork?.data?.nonce;
    const collectionTicker = nftOnNetwork?.data?.ticker;

    if (
      nonce !== undefined &&
      nonce !== null &&
      collectionTicker !== undefined &&
      collectionTicker !== null
    ) {
      const transfer = TokenTransfer.nonFungible(collectionTicker, nonce);

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
        "Can't get the information about the NFT token on the network. Check configuration and chain type."
      );
    }
  } catch (e) {
    console.log((e )?.message);
  }
};
