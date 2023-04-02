import web3 = require("@solana/web3.js")
require("dotenv").config()


async function main() {
  const payer = initializeKeypair(process.env.PRIVATE_KEY ?? "");
  const receiver = initializeKeypair(process.env.RECEIVER_PRIVATE_KEY ?? "");
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

  await connection.requestAirdrop(payer.publicKey, web3.LAMPORTS_PER_SOL * 1);
  await pingProgram(connection, payer, receiver);
}

// Initialize a keypair using private key
function initializeKeypair(private_key: string): web3.Keypair {

  const secret = JSON.parse(private_key) as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}

// sending the transaction with the transfer SOL system program instruction to the Solana devnet network
async function pingProgram(connection: web3.Connection, payer: web3.Keypair, receiver: web3.Keypair) {
  const transaction = new web3.Transaction();

  transaction.add(web3.SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: receiver.publicKey,
    lamports: web3.LAMPORTS_PER_SOL * 1,
  }));

  const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);

  console.log(signature);

}

main()
  .then(() => {
    console.log("Finished successfully")
  })
  .catch((error) => {
    console.error(error)
  })

