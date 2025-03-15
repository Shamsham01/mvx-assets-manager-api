import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, GasEstimator, TransferTransactionsFactory, Address, ITokenTransfer,  } = require('@multiversx/sdk-core');
const axios = require('axios');

const { areYouSureAnswer, setup, commonTxOperations } = require('./utils');
const { chain, shortChainId, publicApi } = require('./config');

enum TokenType {
  FungibleESDT = 'FungibleESDT',
  MetaESDT = 'MetaESDT',
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
}

const promptQuestions = [
  {
    type: 'text',
    name: 'address',
    message: 'Please provide the receiver address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'list',
    name: 'tokens',
    message:
      'Please provide tokens data to send. Separate with "," and "|". Example: ABCD-ds323d|1,ABCD-ds323d-0d|0.5 where: (tokenId|amount)\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
];

const multiTransfer = async () => {
  try {
    const { address, tokens } = await prompts(promptQuestions);

    if (!address || !tokens) {
      console.log('You have to provide the address and tokens list!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const getTokenTransfers: () => Promise = async () => {
      return tokens.map(async (tokenString) => {
        const tokenId = tokenString.split('|')?.[0];
        const amount = tokenString.split('|')?.[1];

        const tokenIdSegmentsLength = tokenId?.split('-').length;

        if (!tokenIdSegmentsLength) {
          console.log(
            'The input data is broken, please double check your input data.'
          );
          exit(9);
        }

        let decimals = 0;
        let nonce = 0;
        let collectionTicker = '';
        let tokenType = '';

        if (tokenIdSegmentsLength === 2) {
          const tokenOnNetwork = await axios.get(`${publicApi[chain]}/tokens/${tokenId.trim()}`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          nonce = tokenOnNetwork?.data?.nonce;
          collectionTicker = tokenOnNetwork?.data?.ticker;
          tokenType = tokenOnNetwork?.data?.type;
          decimals = tokenOnNetwork?.data?.decimals;
        }

        if (tokenIdSegmentsLength === 3) {
          const tokenOnNetwork = await axios.get(`${publicApi[chain]}/nfts/${tokenId.trim()}`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });

          nonce = tokenOnNetwork?.data?.nonce;
          collectionTicker = tokenOnNetwork?.data?.ticker;
          tokenType = tokenOnNetwork?.data?.type;
          decimals = tokenOnNetwork?.data?.decimals;
        }

        const checkAmount = () => {
          if (!amount || Number.isNaN(parseInt(amount))) {
            console.log(
              'The input data is broken, please double check your input data.'
            );
            exit(9);
          }
        };

        if (tokenType === TokenType.FungibleESDT) {
          checkAmount();
          return TokenTransfer.fungibleFromAmount(tokenId, amount, decimals);
        }

        if (tokenType === TokenType.NonFungibleESDT) {
          return TokenTransfer.nonFungible(collectionTicker, nonce);
        }

        if (tokenType === TokenType.SemiFungibleESDT) {
          checkAmount();
          return TokenTransfer.semiFungible(
            collectionTicker,
            nonce,
            parseInt(amount, 10)
          );
        }

        if (tokenType === TokenType.MetaESDT) {
          checkAmount();
          return TokenTransfer.metaEsdtFromAmount(
            collectionTicker,
            nonce,
            amount,
            decimals
          );
        }
      });
    };

    const factory = new TransferTransactionsFactory(new GasEstimator());

    const tokenTransfers = await Promise.all(
      await getTokenTransfers()
    );

    const tx = factory.createMultiESDTNFTTransfer({
      tokenTransfers,
      sender: signer.getAddress(),
      destination: new Address(address.trim()),
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
