import { NextResponse } from "next/server";
import { getPublicProfile } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const data = await getPublicProfile(params.slug);
  if (!data) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { company } = data;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${company.name}`,
    company.email ? `EMAIL;TYPE=INTERNET:${company.email}` : null,
    company.phone ? `TEL;TYPE=CELL:${company.phone}` : null,
    company.website ? `URL:${company.website}` : null,
    company.whatsapp ? `TEL;TYPE=WHATSAPP:${company.whatsapp}` : null,
    `ORG:${company.name}`,
    company.country ? `ADR;TYPE=WORK:;;${company.country}` : null,
    "END:VCARD"
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(lines, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${company.slug}.vcf"`
    }
  });
}

