## Build Contract
### For project_management
> cd contract/project_management

> cargo build --release --target wasm32-unknown-unknown

> cp target/wasm32-unknown-unknown/release/project_management.wasm artifacts/

> docker run --rm -v "$(pwd)":/code --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/optimizer:0.16.0


### For xp_tracking
> cd contract/xp_tracking

> cargo build --release --target wasm32-unknown-unknown

> cp target/wasm32-unknown-unknown/release/xp_tracking.wasm artifacts/

> docker run
   --rm -v "$(pwd)":/code
   --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target
   --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry
   cosmwasm/optimizer:0.16.0


## Upload Contract to Blockchain

> xiond keys list

> WALLET="your-wallet-address-or-key-name-here"

> cd contract/project_management

> RES=$(xiond tx wasm store ./artifacts/project_management.wasm \
      --chain-id xion-testnet-2 \
      --gas-adjustment 1.3 \
      --gas-prices 0.1uxion \
      --gas auto \
      -y --output json \
      --node https://rpc.xion-testnet-2.burnt.com:443 \
      --from $WALLET)

> echo $RES

> Copy txhash

> TXHASH="your-txhash-here"

> CODE_ID=$(xiond query tx $TXHASH \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --output json | jq -r '.events[-1].attributes[1].value')

> echo $CODE_ID

> MSG='{}'
  xiond tx wasm instantiate $CODE_ID "$MSG" \
  --from $WALLET \
  --label "project-management-contract" \
  --gas-prices 0.025uxion \
  --gas auto \
  --gas-adjustment 1.3 \
  -y --no-admin \
  --chain-id xion-testnet-2 \
  --node https://rpc.xion-testnet-2.burnt.com:443

> Copy TXHASH

> TXHASH="your-txhash-here"

> Query blockchain to get contract address:
CONTRACT=$(xiond query tx $TXHASH \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --output json | jq -r '.events[] | select(.type == "instantiate") | .attributes[] | select(.key == "_contract_address") | .value')

> echo $CONTRACT


## Sending Balance to Treasury Contract

> xiond tx bank send <key_wallet_address> <treasury_contract_address> 50000uxion --node https://rpc.xion-testnet-2.burnt.com:443 --chain-id xion-testnet-2 --fees 200uxion


## Executing Project Management Contract

### Creating Project

> MSG='{"CreateProject": {"title":"CollabSpaceX", "description":"A space for builders to connect, collab & create", "skills_required":["Rust", "Blockchain", "Smart Contracts"]}}'


> xiond tx wasm execute <contract_address> "$MSG" \
 --from <key_wallet_address> \
 --gas-prices 0.025uxion \
 --gas auto \
 --gas-adjustment 1.3 \
 -y \
 --node https://rpc.xion-testnet-2.burnt.com:443 \
 --chain-id xion-testnet-2

 ### Querying Project List

 > QUERY='{"ListProjects":{}}'

 > xiond query wasm contract-state smart <contract_address> "$QUERY" --output json --node https://rpc.xion-testnet-2.burnt.com:443

 ## Example

 ```
 ironyaditya@ironyaditya:~/project-files/XionBuildathonBuildX/project-peer-connect/contract/project_management$  QUERY='{"ListProjects":{}}'

ironyaditya@ironyaditya:~/project-files/XionBuildathonBuildX/project-peer-connect/contract/project_management$  xiond query wasm contract-state smart <contract_address> "$QUERY" --output json --node https://rpc.xion-testnet-2.burnt.com:443

{"data":[]}

ironyaditya@ironyaditya:~/project-files/XionBuildathonBuildX/project-peer-connect/contract/project_management$ MSG='{"CreateProject": {"title":"CollabSpaceX", "description":"A space for builders to connect, collab & create", "skills_required":["Rust", "Blockchain", "Smart Contracts"]}}'

ironyaditya@ironyaditya:~/project-files/XionBuildathonBuildX/project-peer-connect/contract/project_management$ xiond tx wasm execute <contract_address> "$MSG" \
 --from <key_wallet_address> \
 --gas-prices 0.025uxion \
 --gas auto \
 --gas-adjustment 1.3 \
 -y \
 --node https://rpc.xion-testnet-2.burnt.com:443 \
 --chain-id xion-testnet-2

gas estimate: 145473
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: ""
timestamp: ""
tx: null
txhash: 581C711F1F2782D88DF8A49CA41861CE937B258959E4EA22E019CB1F8723D75E

ironyaditya@ironyaditya:~/project-files/XionBuildathonBuildX/project-peer-connect/contract/project_management$ xiond query wasm contract-state smart <contract_address> "$QUERY" --output json --node https://rpc.xion-testnet-2.burnt.com:443


{"data":[{"id":"CollabSpaceX","title":"CollabSpaceX","description":"A space for builders to connect, collab \u0026 create","owner":"xion1k2j3f0lvnye9nrszytxwtkmq40p9p0rrj49px5","skills_required":["Rust","Blockchain","Smart Contracts"],"status":"Open"}]}
 ```
