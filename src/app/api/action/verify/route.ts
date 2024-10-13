import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);

  const { signature, account } = body;

  console.log(signature, account);

//   logic to verify the signature

  return NextResponse.json(
    {
      error: "err",
    },
    {
      status: 500,
    }
  );
}
