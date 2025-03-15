import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { TokenTransfer, Transaction, TransactionPayload, Address,  } = require('@multiversx/sdk-core');

const { areYouSureAnswer, setup, commonTxOperations } = require('../utils');
const { chain, shortChainId } = require('../config');

const promptQuestions = [
  {
    type: 'text',
    name: 'address',
    message: 'Please provide the receiver address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'amount',
    message:
      'Please provide the amount of EGLD to send (ex. 1.5 is 1.5 EGLD)\n',
    validate: (value) =>
      value && !Number.isNaN(value) && Number(value) > 0
        ? true
        : `Please provide a number, should be a proper EGLD amount, bigger than 0`,
  },
  {
    type: 'text',
    name: 'msg',
    message: 'Do you want to attach the note? (you can leave it blank)\n',
  },
];

const sendEgld = async () => {
  try {
    const { address, amount, msg } = await prompts(promptQuestions);

    if (!address || !amount) {
      console.log('You have to provide the address and amount!');
      exit(9);
    }

    await areYouSureAnswer();

    const { signer, userAccount, provider } = await setup();

    const payment = TokenTransfer.egldFromAmount(amount);

    const data = new TransactionPayload(msg || '');

    const tx = new Transaction({
      data,
      gasLimit: 50000 + 1500 * data.length(),
      sender: signer.getAddress(),
      receiver: new Address(address.trim()),
      value,
      chainID,
    });

    await commonTxOperations(tx, userAccount, signer, provider);
  } catch (e) {
    console.log((e )?.message);
  }
};
