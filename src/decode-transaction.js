import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { inspect } = require('util');
const { Buffer } = require('buffer');
const { TransactionDecoder } = require('@multiversx/sdk-transaction-decoder/lib/src/transaction.decoder.js');

const promptQuestions = [
  {
    type: 'text',
    name: 'senderAddress',
    message: 'Please provide the sender address\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'receiverAddress',
    message:
      'Please provide the receiver address. (The same (including SFTs and NFTs))\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'text',
    name: 'dataString',
    message:
      'Please provide the data string in base64 encoded form or not encoded\n',
    validate: (value) => (!value ? 'Required!' : true),
  },
  {
    type: 'number',
    name: 'value',
    message:
      'Please provide the value for the transaction (only for EGLD transactions, otherwise 0)\n',
    initial,
  },
];

const decodeTransaction = async () => {
  try {
    const { senderAddress, receiverAddress, dataString, value } =
      await prompts(promptQuestions);

    if (!senderAddress || !receiverAddress || !dataString) {
      console.log(
        'You must provide at least the sender, receiver, and data string!'
      );
      exit(9);
    }

    const transactionDecoder = new TransactionDecoder();

    const isBase64Encoded =
      Buffer.from(dataString, 'base64').toString('base64') === dataString;

    const decoded = transactionDecoder.getTransactionMetadata({
      sender,
      receiver,
      data: isBase64Encoded
        ? dataString
        : Buffer.from(dataString).toString('base64'),
      value,
    });

    const parsed = JSON.parse(
      JSON.stringify(
        decoded,
        (_, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      )
    );

    // Print parsed result to the console
    console.log('\nDecoded transaction metadata:\n');
    console.log(
      inspect(parsed, { showHidden, depth, colors: true })
    );
    console.log('\n');
  } catch (e) {
    console.log((e )?.message);
  }
};
