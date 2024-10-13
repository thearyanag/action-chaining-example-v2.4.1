import { CompletedAction } from "@solana/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);

  const { signature, account } = body;

  console.log(signature, account);

  //   logic to verify the signature

  const response: CompletedAction = {
    type: "completed",
    title: "Signing was successful!",
    icon: new URL("/message.webp", new URL(req.url).origin).toString(),
    label: "Action Signature Label!",
    description:
      `You have now completed an action chain! ` +
      `Here was the signature ${signature}`,
  };

  return NextResponse.json(response);
}
