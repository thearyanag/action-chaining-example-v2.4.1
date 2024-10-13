import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostResponse,
  ActionError,
} from "@solana/actions";
import { NextRequest, NextResponse } from "next/server";
import {
  getTransactionResponse,
  getSignMessageResponse,
  getExternalLinkResponse,
} from "@/app/helper";

export async function GET() {
  const response: ActionGetResponse = {
    type: "action",
    icon: `https://action-chaining-example.vercel.app/a.webp`,
    title: "Action A",
    description: "Enter anything",
    label: "Action A Label",
    links: {
      actions: [
        {
          // type is set to post, which indicates that the action is a post request and not a transaction
          type: "post",
          label: "Submit Form", // button text
          // stage is set to 0, which indicates that this is the first stage of the action
          href: "/api/action?type=post&stage=0&amount={amount}",
          parameters: [
            {
              name: "amount",
              label: "Enter a custom SOL amount",
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

// ensures cors
export const OPTIONS = GET;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = req.nextUrl.searchParams;
  const type = query.get("type");
  const amount = query.get("amount");
  const stage = query.get("stage");
  let response: ActionPostResponse;

  if (stage === "0") {
    response = {
      type: "post",
      message: `Form submitted by account ${body.account} with amount ${amount}`,
      links: {
        next: {
          type: "inline",
          action: {
            description: `Action B completed`,
            icon: `https://action-chaining-example.vercel.app/b.webp`,
            label: `Action B Label`,
            title: `Action B completed`,
            type: "action",
            links: {
              actions: [
                {
                  href: "/api/action?type=transaction&stage=1",
                  label: "Transaction",
                  type: "transaction",
                },
                {
                  href: "/api/action?type=external-link&stage=1",
                  label: "External Link",
                  type: "external-link",
                },
                {
                  href: "/api/action?type=message&stage=1",
                  label: "Message",
                  type: "message",
                },
              ],
            },
          },
        },
      },
    };
  } else if (stage === "1") {

    // it totally depends on your use-case on how you want to show the next action in the chain

    response =
      type === "transaction"
        ? await getTransactionResponse(body.account)
        : type === "external-link"
        ? getExternalLinkResponse(body.account)
        : getSignMessageResponse(body.account);

  } else {
    const error: ActionError = {
      message: "Invalid action, please contact the support team",
    };

    return NextResponse.json(error, {
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}
