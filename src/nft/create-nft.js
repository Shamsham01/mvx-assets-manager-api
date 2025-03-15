import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, BytesValue, ContractCallPayloadBuilder, ContractFunction, TypedValue, BigUIntValue,  } = require('@multiversx/sdk-core');
const Bignumber = require('bignumber.js');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId, nftCreateOpertationsGasLimit } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'ticker',
    message: 'Please provide the existing collection token ticker\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'name',
    message: 'Please provide the NFT token name\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'number',
    name: 'royalties',
    message: 'Please provide the royalties value (5 = 5%)\n',
    validate: (value) =>
      !value || value  100 ? 'Required number 0-100!' : true,
  },
  {
    type: 'list',
    name: 'uris',
    message:
      'Please provide URLs to a supported media file ending with the file extension (Example: https://ipfs.io/ipfs/{CID_HERE}/1.png). Separate with comma.\n',
    validate: (value) => (!value ? 'Required field!' : true),
  },
  {
    type: 'text',
    name: 'attributes',
    message:
      'Provide attributes. (String in format: "metadata:ipfsCID/fileName.json;tags:tag1,tag2,tag3")\n',
  },
  {
    type: 'text',
    name: 'hash',
    message:
      'Optionally you can provide a hash (of your image, attributes, etc)\n',
  },
];

const createNft = async () => {
  try {
    const { ticker, name, royalties, uris, attributes, hash } =
      await prompts(promptQuestions);

    if (!ticker) {
      console.log(
        'You have to provide the ticker, initial quantity, name, royalties and uris for your token!'
      );
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const args = [
      BytesValue.fromUTF8(ticker),
      new BigUIntValue(new Bignumber(1)),
      BytesValue.fromUTF8(name),
      new BigUIntValue(new Bignumber(Number(royalties) * 100 || 0)),
      BytesValue.fromUTF8(hash || ''),
      BytesValue.fromUTF8(attributes || ''),
    ];

    for (const uri of uris) {
      args.push(BytesValue.fromUTF8(uri));
    }

    const data = new ContractCallPayloadBuilder()
      .setFunction(new ContractFunction('ESDTNFTCreate'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      data,
      gasLimit:
        nftCreateOpertationsGasLimit +
        data.length() * 1500 +
        (attributes?.length || 0 + hash?.length || 0) * 50000,
      receiver: signer.getAddress(),
      sender: signer.getAddress(),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
