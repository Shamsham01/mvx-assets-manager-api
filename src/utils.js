const { accessSync, constants, readFileSync } = require('fs');
const { exit, cwd } = require('process');
import prompts, { PromptObject } from 'prompts';
const { Transaction, TransactionWatcher, Account, SmartContract, Address,  } = require('@multiversx/sdk-core');
const ora = require('ora');
const keccak = require('keccak');
const { parseUserKey, UserSigner } = require('@multiversx/sdk-wallet');
const { ApiNetworkProvider } = require('@multiversx/sdk-network-providers');
const { publicApi, chain, multiversxExplorer } = require('./config');

const baseDir = cwd();

const getFileContents = (
  relativeFilePath,
  options: { isJSON?: boolean; noExitOnError?: boolean }
) => {
  const isJSON = options.isJSON === undefined ? true : options.isJSON;
  const noExitOnError =
    options.noExitOnError === undefined ? false : options.noExitOnError;

  const filePath = `${baseDir}/${relativeFilePath}`;

  try {
    accessSync(filePath, constants.R_OK | constants.W_OK);
  } catch (err) {
    if (!noExitOnError) {
      console.error(`There is no ${relativeFilePath}!`);
      exit(9);
    } else {
      return undefined;
    }
  }

  const rawFile = readFileSync(filePath);
  const fileString = rawFile.toString('utf8');

  if (isJSON) {
    return JSON.parse(fileString);
  }
  return fileString;
};

const getProvider = () => {
  return new ApiNetworkProvider(publicApi[chain], {
    timeout,
  });
};

const prepareUserSigner = (walletPemKey) => {
  return UserSigner.fromPem(walletPemKey);
};

// Prepare main user account from the wallet PEM file
const prepareUserAccount = async (walletPemKey) => {
  const userKey = parseUserKey(walletPemKey);
  const address = userKey.generatePublicKey().toAddress();
  return new Account(address);
};

const setup = async () => {
  const walletPemKey = getFileContents('walletKey.pem', { isJSON: false });
  // Provider type based on initial configuration
  const provider = getProvider();

  const userAccount = await prepareUserAccount(walletPemKey);
  const userAccountOnNetwork = await provider.getAccount(userAccount.address);
  userAccount.update(userAccountOnNetwork);

  const signer = prepareUserSigner(walletPemKey);

  return {
    signer,
    userAccount,
    provider,
  };
};

const commonConfirmationPrompt = [
  {
    type: 'select',
    name: 'areYouSureAnswer',
    message: 'Are you sure?',
    choices: [
      { title: 'Yes', value: 'yes' },
      { title: 'No', value: 'no' },
    ],
  },
];

const areYouSureAnswer = async () => {
  const { areYouSureAnswer } = await prompts(commonConfirmationPrompt);

  if (areYouSureAnswer !== 'yes') {
    console.log('Aborted!');
    exit(9);
  }
};

const commonTxOperations = async (
  tx,
  account,
  signer,
  provider) => {
  const spinner = ora('Processing the transaction...');

  try {
    tx.setNonce(account.nonce);
    account.incrementNonce();

    const serialized = tx.serializeForSigning();
    const signature = await signer.sign(serialized);
    tx.applySignature(signature);

    spinner.start();

    await provider.sendTransaction(tx);

    const watcher = new TransactionWatcher(provider);
    const transactionOnNetwork = await watcher.awaitCompleted(tx);

    const txHash = transactionOnNetwork.hash;
    const txStatus = transactionOnNetwork.status;

    spinner.stop();

    console.log(`\nTransaction status: ${txStatus}`);
    console.log(
      `Transaction link: ${multiversxExplorer[chain]}/transactions/${txHash}\n`
    );
  } catch (e) {
    spinner.stop();
    throw new Error(
      (e )?.message ||
        'Something wen wrond when processing the transaction!'
    );
  }
};

const dnsScAddressForHerotag = (herotag) => {
  const hashedHerotag = keccak('keccak256').update(herotag).digest();

  const initialAddress = Buffer.from(Array(32).fill(1));
  const initialAddressSlice = initialAddress.slice(0, 30);
  const scId = hashedHerotag.slice(31);

  const deployer_pubkey = Buffer.concat([
    initialAddressSlice,
    Buffer.from([0, scId.readUIntBE(0, 1)]),
  ]);

  const scAddress = SmartContract.computeAddress(
    new Address(deployer_pubkey),
    0
  );

  return scAddress;
};
