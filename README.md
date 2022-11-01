## Buildo Begins 👷

Meet Buildo. He is here to help you start creating in the Elrond blockchain ecosystem. Here is where everything begins.

> I'm going on an adventure!
> The road goes ever on and on. \
&mdash; Buildo

> Buildo is a cool guy 👊 \
&mdash; Beniamin Mincu (@beniaminmincu) <a href="https://twitter.com/beniaminmincu/status/1532977949842059264?ref_src=twsrc%5Etfw">June 4, 2022</a></blockquote>

### Walkthrough videos

- sending tokens: https://youtu.be/NijTSZhswns
- issuing, minting and burning ESDT supply: https://youtu.be/_Jj0zCaATVU
- issuing and creating an SFT collection: https://youtu.be/ozOYli4qQx4
- creating and checking the herotag for wallet address without the Maiar App: https://youtu.be/nvda-zCffck
- Elrond data converters: https://youtu.be/soUq9eX9-0s

### Related articles

- [Setup erdjs and issue ESDT](https://elrond-dev-guild.gitbook.io/scrolls/erdjs/how-tos/setup-erdjs-and-issue-esdt-token)
- [Set special roles for ESDT tokens](https://elrond-dev-guild.gitbook.io/scrolls/erdjs/how-tos/set-special-roles-for-esdt-token)

### With what he will help you (not all is available yet!):

1. Deriving PEM files
2. Making transactions
3. Deploying smart contracts
4. Smart contracts interactions
5. Common API interactions and filtering
4. Sky is the limit...

### TODO

For now, the first version gives you basic stuff. But there will be much more:

- examples for interaction with smart contracts,
- proper erdjs interactions,
- ABI usage,
- custom operations on API
- Gandalf's wizarding shit and stuff, you will be amazed for sure!

### How to work with Buildo:

1. Install globally `npm install buildo-begins -g`
2. Derive the pem from seed phrase: `buildo-begins derive-pem`
3. The walletKey.pem file will be created
4. Check the commands with `buildo-begins --help`
5. Use one of available commands, check them below.
5. You will get some prompts, fill up the required data

### Available commands for Buildo (for now, there will be more):

Each command will display a set of self-explanatory prompts.

#### General operations

- `buildo-begins derive-pem` - derive PEM file from seed phrase
- `buildo-begins herotag` - create a herotag and assign it to addres and check addresses of existing ones
- `buildo-begins converters` - a set of converters based on excelent [Elrond Converters](http://207.244.241.38/elrond-converters/) but in the CLI, always at hand!
- `buildo-begins claim-developer-rewards` - Claim dev rewards from your smart contract. You have to use the owner's wallet address (PEM) when calling it
- `buildo-begins change-owner-address` - You can change the owner address of the smart contract you own

#### ESDT operations

- `buildo-begins issue-esdt` - issue new ESDT token
- `buildo-begins set-special-roles-esdt` - set/unset special ESDT roles
- `buildo-begins mint-burn-esdt` - mint/burn the ESDT token supply (requires `ESDTRoleLocalBurn`, `ESDTRoleLocalMint` roles)
- `buildo-begins pause-unpause-esdt` - pause/unpause all transactions of the token (requires `canPause` role)
- `buildo-begins freeze-unfreeze-esdt` - freeze/unfreeze the token balance in a specific account, preventing transfers to and from that account (requires `canFreeze` role)
- `buildo-begins wipe-esdt` - wipe out the tokens held by a previously frozen account, reducing the supply (Wiping the tokens of an Account is an operation designed to help token managers to comply with regulations.)
- `buildo-begins transfer-ownership-esdt` - The manager of an ESDT token may transfer the management rights to another Account. This operation requires that the `canChangeOwner` is set to true.
- `buildo-begins send-esdt` - send ESDT tokens

#### SFT operations (will be more...)

- `buildo-begins issue-sft` - issue a new SFT collection
- `buildo-begins set-sepacial-roles-sft` - set special roles for SFT
- `buildo-begins create-sft` - create a new SFT with initial quantity, assets, attributes, etc.
- `buildo-begins send-sft` - send SFT tokens

#### NFT operations (will be more...)

- `buildo-begins issue-nft` - issue a new NFT collection
- `buildo-begins set-sepacial-roles-nft` - set special roles for NFT
- `buildo-begins create-nft` - create a new NFT, assets, attributes, etc.
- `buildo-begins send-nft` - send NFT token

#### Meta ESDT operations (will be more...)
- `buildo-begins send-meta-esdt` - send Meta ESDT tokens

#### EGLD operations (will be more...)

- `buildo-begins send-egld` - send EGLD tokens

What is awesome here is that you don't have to worry about proper nonce, decimal places, or differentiation between the NFT token id and collection ticker.

### How to use the config file?

Internally Buildo uses the config.ts file, but when you use it as a globally installed npm CLI tool, you don't have to touch that file. What you need to do is to create the `.buildobeginsrc` file, where you can change values (here default values):

```json
{
  "chain": "devnet",
  "customApi": "https://devnet-api.elrond.com"
}
```

### Development:

1. Clone the repo
2. Each change needs `npm run build`
3. You can link the lib locally by `npm link`
4. If you want to build your version, find all the `buildo-begins` names and replace them with yours.

### Real live examples that use a similar approach: 

- [elven-tools](https://github.com/juliancwirko/elven-tools-cli)
- [nft-art-maker](https://github.com/juliancwirko/nft-art-maker)

### Other tools:

- [elven.js](https://www.elvenjs.com) - Authenticate, sign, and send transactions on the Elrond blockchain in the browser. No need for bundlers, frameworks, etc. Just import from the static script source, and you are ready to go. One static file to rule it all on the Elrond blockchain!
- [Elven Tools](https://www.elven.tools) - The PFP NFT toolset: NFT minter smart contract (decentralized way of minting), minter Nextjs dapp (interaction on the frontend side), CLI tool (deploy, configuration, interaction).
- [Next.js Dapp Template](https://github.com/ElrondDevGuild/nextjs-dapp-template) - general purpose Next.js dapp template
