import {
  ActionPostResponse,
  createSignMessageText,
  createPostResponse,
  NextActionLink,
} from "@solana/actions";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

export const getCompletedAction = (type: string): NextActionLink => {
  return {
    type: "inline",
    action: {
      description: `Action ${type} completed`,
      icon: `https://action-chaining-example-v2-4-1.vercel.app/${type}.webp`,
      label: `Action ${type} Label`,
      title: `Action ${type} completed`,
      type: "completed",
    },
  };
};

export async function getTransactionResponse(
  account: string
): Promise<ActionPostResponse> {
  const sender = new PublicKey(account);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey("CRtPaRBqT274CaE5X4tFgjccx5XXY5zKYfLPnvitKdJx"),
      lamports: LAMPORTS_PER_SOL * 0,
    })
  );
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = sender;

  const response = createPostResponse({
    fields: {
      type: "transaction",
      links: {
        next: getCompletedAction("transaction"),
      },
      transaction: tx,
    },
  });

  return response;
}

export function getExternalLinkResponse(account: string): ActionPostResponse {
  return {
    type: "external-link",
    externalLink: `https://solscan.io/account/${account}`,
    links: {
      next: getCompletedAction("external-link"),
    },
  };
}

export function getSignMessageResponse(account: string): ActionPostResponse {
  const message = createSignMessageText({
    address: account,
    domain: "https://www.blinkathon.fun",
    issuedAt: "",
    nonce: "10",
    statement: "sup blink00rs",
  });

  return {
    type: "message",
    data: message,
    links: {
      // because signature can be spam, it's necessary to validate the signature via a post request
      // this inline type is not supported for this
      next: {
        href: "/api/action/verify",
        type: "post",
      },
    },
  };
}
