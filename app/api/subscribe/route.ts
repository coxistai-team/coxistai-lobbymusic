import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      companyName,
      revenueMaking,
      mrr,
      investmentRaised,
      investmentAmount,
    } = await request.json();

    if (!name || !email || !companyName || !revenueMaking) {
      return NextResponse.json(
        { error: "Name, email, company name, and revenue status are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("subscribers").insert([
      {
        name,
        email,
        company_name: companyName,
        revenue_making: revenueMaking,
        mrr: mrr || null,
        investment_raised: investmentRaised || null,
        investment_amount: investmentAmount || null,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch {
    // Error saving subscriber
    return NextResponse.json(
      { error: "Failed to save subscriber" },
      { status: 500 }
    );
  }
}
