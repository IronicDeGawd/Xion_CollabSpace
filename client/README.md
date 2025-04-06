# **Building and Deploying Project Management Smart Contract on Xion**

## **1. Building the Contract**
### **For `project_management` Contract**
```sh
cd contract/project_management

# Compile the contract to WebAssembly (WASM)
cargo build --release --target wasm32-unknown-unknown

# Move the built contract to artifacts folder
cp target/wasm32-unknown-unknown/release/project_management.wasm artifacts/

# Optimize the contract using Docker

docker run --rm \
  -v "$(pwd)":/code \
  --mount type=volume,source="$(basename \"$(pwd)\")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0
```

## **2. Uploading Contract to Blockchain**
```sh
# List wallet keys
xiond keys list

# Set wallet variable
WALLET="your-wallet-address-or-key-name-here"

# Navigate to the contract directory
cd contract/project_management

# Upload the contract to Xion testnet
RES=$(xiond tx wasm store ./artifacts/project_management.wasm \
      --chain-id xion-testnet-2 \
      --gas-adjustment 1.3 \
      --gas-prices 0.1uxion \
      --gas auto \
      -y --output json \
      --node https://rpc.xion-testnet-2.burnt.com:443 \
      --from $WALLET)

# Extract transaction hash
echo $RES
TXHASH="your-txhash-here"

# Query the transaction to get the contract's code ID
CODE_ID=$(xiond query tx $TXHASH \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --output json | jq -r '.events[-1].attributes[1].value')

echo $CODE_ID
```

## **3. Instantiating the Contract**
```sh
# Define an empty initialization message
MSG='{}'

# Instantiate the contract
xiond tx wasm instantiate $CODE_ID "$MSG" \
  --from $WALLET \
  --label "project-management-contract" \
  --gas-prices 0.025uxion \
  --gas auto \
  --gas-adjustment 1.3 \
  -y --no-admin \
  --chain-id xion-testnet-2 \
  --node https://rpc.xion-testnet-2.burnt.com:443

# Extract contract address
TXHASH="your-txhash-here"
CONTRACT=$(xiond query tx $TXHASH \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --output json | jq -r '.events[] | select(.type == "instantiate") | .attributes[] | select(.key == "_contract_address") | .value')

echo $CONTRACT
```

## **4. Funding the Treasury Contract**
```sh
xiond tx bank send <key_wallet_address> <treasury_contract_address> 50000uxion \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --chain-id xion-testnet-2 \
  --fees 200uxion
```

## **5. Executing the Project Management Contract**
### **Creating a Project**
```sh
MSG='{"CreateProject": {"title":"CollabSpaceX", "description":"A space for builders to connect, collab & create", "skills_required":["Rust", "Blockchain", "Smart Contracts"]}}'

xiond tx wasm execute <contract_address> "$MSG" \
  --from <key_wallet_address> \
  --gas-prices 0.025uxion \
  --gas auto \
  --gas-adjustment 1.3 \
  -y \
  --node https://rpc.xion-testnet-2.burnt.com:443 \
  --chain-id xion-testnet-2
```

### **Querying Project List**
```sh
QUERY='{"ListProjects":{}}'

xiond query wasm contract-state smart <contract_address> "$QUERY" \
  --output json \
  --node https://rpc.xion-testnet-2.burnt.com:443
```

## **Example Output**
```json
{
  "data": [
    {
      "id": "CollabSpaceX",
      "title": "CollabSpaceX",
      "description": "A space for builders to connect, collab & create",
      "owner": "xion1k2j3f0lvnye9nrszytxwtkmq40p9p0rrj49px5",
      "skills_required": ["Rust", "Blockchain", "Smart Contracts"],
      "status": "Open"
    }
  ]
}
```
