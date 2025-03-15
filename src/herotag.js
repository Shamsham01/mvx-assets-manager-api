import prompts, { PromptObject } from 'prompts';
const { exit } = require('process');
const { Transaction, ContractCallPayloadBuilder, ContractFunction, TypedValue, BytesValue, SmartContract,  } = require('@multiversx/sdk-core');

const axios = require('axios');

const { areYouSureAnswer, setup, commonTxOperations, dnsScAddressForHerotag,  } = require('./utils');
const { chain, shortChainId, publicApi } = require('./config');

const promptQuestions = [
  {
    type: 'select',
    name: 'type',
    message: 'What do you want to do with the herotag?\n',
    validate: (value) => (!value ? 'Required!' : true),
    choices: [
      { title: 'Create one', value: 'create' },
      { title: 'Check the address for one', value: 'check' },
    ],
  },
  {
    type: 'text',
    name: 'herotag',
    message: 'Please provide the herotag name (without .elrond suffix)\n',
    validate: (value) => {
      if (!value) return 'Required!';
      if (value.length > 25 || value.length  {
  const { herotag, type } = await prompts(promptQuestions);

  if (!herotag) {
    console.log('You have to provide the herotag name!');
    exit(9);
  }

  if (type === 'check') {
    try {
      const response = await axios.get(
        `${publicApi[chain]}/usernames/${herotag.trim()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      console.log(
        `\nAddress of ${herotag}.elrond is: ${response?.data?.address}\n`
      );
    } catch {
      console.log(
        '\nThere is no such herotag registered. Please also check the chain type. By default it checks on the devnet.\n'
      );
    }
  } else {
    try {
      await areYouSureAnswer();

      const dnsScAddress = dnsScAddressForHerotag(`${herotag}.elrond`);
      const heroBytes = BytesValue.fromUTF8(`${herotag}.elrond`);

      const { signer, userAccount, provider } = await setup();

      const dnsSc = new SmartContract({ address: dnsScAddress });
      const dnsCanRegisterQuery = dnsSc.createQuery({
        func: new ContractFunction('canRegister'),
        args,
      });

      await provider.queryContract(dnsCanRegisterQuery);

      const args = [heroBytes];

      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('register'))
        .setArgs(args)
        .build();

      const tx = new Transaction({
        data,
        value,
        gasLimit: 50000 + 1500 * data.length() + 20000000,
        receiver,
        sender: signer.getAddress(),
        chainID,
      });

      await commonTxOperations(tx, userAccount, signer, provider);
    } catch (e) {
      console.log((e )?.message);
    }
  }
};
