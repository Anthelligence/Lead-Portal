export const demoCompany = {
  id: "demo-company-id",
  name: "TechVision Solutions",
  slug: "demo-company",
  business_type: "Technology & Software Development",
  banner_url:
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80",
  logo_url:
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=300&q=80",
  website: "https://techvision.example.com",
  description:
    "TechVision Solutions is a leading provider of enterprise software solutions, specializing in cloud-based platforms and digital transformation services.",
  phone: "+1-555-234-5678",
  email: "info@techvision.example.com",
  whatsapp: "+15552345678",
  linkedin_url: "https://www.linkedin.com/company/example",
  messaging_url: "https://wa.me/15552345678",
  instagram_url: "https://instagram.com/example",
  tiktok_url: "https://www.tiktok.com/@example",
  x_url: "https://x.com/example",
  country: "United States",
  role: "Operations Lead",
  size: "200-500",
  monthly_orders: 3200,
  show_assessment_scores: true,
  additional_details:
    "Operating across North America and Europe with hybrid on-prem/cloud deployments. Looking for automation partnerships and regional logistics improvements."
};

export const demoAssessment = {
  total_score: 87,
  profile_label: "Operational Readiness Level: Advanced",
  strengths: [
    "Strong financial performance with 35% year-over-year revenue growth",
    "Highly skilled workforce with 92% employee retention rate",
    "Advanced technology infrastructure with 99.9% uptime reliability",
    "Excellent customer satisfaction with NPS score of 78",
    "Robust compliance and security frameworks meeting ISO 27001 standards"
  ],
  opportunities: [
    "Expand market presence in emerging Asian and Latin American markets",
    "Develop AI-powered features to enhance product competitiveness",
    "Strengthen strategic partnerships with major cloud service providers",
    "Invest in automation to improve operational efficiency by 25%"
  ]
};

export const demoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@cotit.test"
};

export const demoTokenState = {
  id: "demo-token-id",
  token: "ctl-demo-000",
  claimed: false,
  claimed_at: null as string | null,
  company_id: null as string | null,
  public_profile_enabled: true,
  companies: { slug: demoCompany.slug, name: demoCompany.name }
};

