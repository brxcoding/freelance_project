import pptxgen from "pptxgenjs"

const pptx = new pptxgen()
pptx.layout = "LAYOUT_WIDE"
pptx.author = "FreelanceMKT"
pptx.subject = "Full-stack freelance service marketplace"
pptx.title = "FreelanceMKT — Product & Technical Presentation"
pptx.company = "FreelanceMKT"
pptx.lang = "en-US"
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "en-US",
}

const C = {
  aqua: "30525C",
  aqua2: "4C848D",
  copper: "C35627",
  peach: "D6794D",
  sand: "DCAA89",
  stone: "BFB9B5",
  ink: "173940",
  canvas: "F7F8F7",
  white: "FFFFFF",
  muted: "65777A",
  line: "DCE3E1",
}
const W = 13.333
const H = 7.5

function base(slide, section, title, subtitle = "") {
  slide.background = { color: C.canvas }
  slide.addText(section.toUpperCase(), {
    x: 0.65,
    y: 0.42,
    w: 5,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    charSpacing: 2,
    color: C.copper,
    margin: 0,
  })
  slide.addText(title, {
    x: 0.65,
    y: 0.75,
    w: 11.9,
    h: 0.55,
    fontFace: "Aptos Display",
    fontSize: 26,
    bold: true,
    color: C.ink,
    margin: 0,
  })
  if (subtitle)
    slide.addText(subtitle, {
      x: 0.65,
      y: 1.38,
      w: 11.5,
      h: 0.38,
      fontSize: 12,
      color: C.muted,
      margin: 0,
    })
  slide.addShape(pptx.ShapeType.line, {
    x: 0.65,
    y: 7.1,
    w: 12,
    h: 0,
    line: { color: C.line, width: 1 },
  })
  slide.addText("FreelanceMKT", {
    x: 0.65,
    y: 7.2,
    w: 2,
    h: 0.15,
    fontSize: 8,
    bold: true,
    color: C.aqua,
    margin: 0,
  })
  slide.addText(String(pptx._slides.length), {
    x: 12.3,
    y: 7.2,
    w: 0.35,
    h: 0.15,
    fontSize: 8,
    color: C.muted,
    align: "right",
    margin: 0,
  })
}

function card(slide, x, y, w, h, title, body, accent = C.aqua) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.line, width: 1 },
    shadow: {
      type: "outer",
      color: "AAB7B8",
      blur: 1,
      angle: 45,
      distance: 1,
      opacity: 0.14,
    },
  })
  slide.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.25,
    y: y + 0.25,
    w: 0.38,
    h: 0.38,
    fill: { color: accent, transparency: 5 },
    line: { color: accent },
  })
  slide.addText(title, {
    x: x + 0.25,
    y: y + 0.78,
    w: w - 0.5,
    h: 0.3,
    fontSize: 15,
    bold: true,
    color: C.ink,
    margin: 0,
  })
  slide.addText(body, {
    x: x + 0.25,
    y: y + 1.18,
    w: w - 0.5,
    h: h - 1.4,
    fontSize: 10.5,
    color: C.muted,
    breakLine: false,
    valign: "top",
    margin: 0.02,
    bullet: body.includes("\n") ? { type: "bullet" } : undefined,
  })
}

function bullets(slide, items, x = 0.85, y = 2, w = 5.7, h = 4.7) {
  const runs = items.map((item) => ({
    text: item,
    options: { bullet: { indent: 16 }, hanging: 4, breakLine: true },
  }))
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontSize: 16,
    color: C.ink,
    breakLine: false,
    paraSpaceAfterPt: 16,
    valign: "mid",
    margin: 0.04,
  })
}

{
  const slide = pptx.addSlide()
  slide.background = { color: C.aqua }
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.2,
    y: -1.8,
    w: 5.5,
    h: 5.5,
    fill: { color: C.aqua2, transparency: 35 },
    line: { transparency: 100 },
  })
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 0.75,
    w: 0.55,
    h: 0.55,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { transparency: 100 },
  })
  slide.addText("M", {
    x: 0.8,
    y: 0.86,
    w: 0.55,
    h: 0.2,
    fontSize: 16,
    bold: true,
    color: C.aqua,
    align: "center",
    margin: 0,
  })
  slide.addText("FreelanceMKT", {
    x: 1.52,
    y: 0.9,
    w: 3.4,
    h: 0.28,
    fontSize: 18,
    bold: true,
    color: C.white,
    margin: 0,
  })
  slide.addText("FULL-STACK MARKETPLACE", {
    x: 0.8,
    y: 2.05,
    w: 5,
    h: 0.25,
    fontSize: 10,
    bold: true,
    charSpacing: 2.2,
    color: C.sand,
    margin: 0,
  })
  slide.addText("Where great work\nfinds the right people.", {
    x: 0.8,
    y: 2.45,
    w: 8.5,
    h: 1.45,
    fontSize: 36,
    bold: true,
    color: C.white,
    breakLine: false,
    margin: 0,
    valign: "mid",
  })
  slide.addText(
    "Product vision, experience design, system architecture, security, and deployment",
    {
      x: 0.8,
      y: 4.25,
      w: 7.5,
      h: 0.45,
      fontSize: 15,
      color: "D9E8E6",
      margin: 0,
    },
  )
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 5.35,
    w: 3.3,
    h: 0.62,
    rectRadius: 0.08,
    fill: { color: C.copper },
    line: { color: C.copper },
  })
  slide.addText("Production-ready foundation", {
    x: 0.8,
    y: 5.55,
    w: 3.3,
    h: 0.18,
    fontSize: 12,
    bold: true,
    color: C.white,
    align: "center",
    margin: 0,
  })
}

{
  const slide = pptx.addSlide()
  base(
    slide,
    "01 · Opportunity",
    "The problem FreelanceMKT solves",
    "A focused marketplace operating model for finding, buying, delivering, and governing freelance work.",
  )
  card(
    slide,
    0.65,
    2.0,
    3.85,
    3.9,
    "Clients",
    "Discovery is fragmented.\nScope and quality are unclear.\nPayment and delivery lack a shared record.",
    C.copper,
  )
  card(
    slide,
    4.75,
    2.0,
    3.85,
    3.9,
    "Freelancers",
    "Lead generation is inconsistent.\nOperations span too many tools.\nEarnings and reputation are hard to compound.",
    C.aqua2,
  )
  card(
    slide,
    8.85,
    2.0,
    3.85,
    3.9,
    "Marketplace teams",
    "Trust requires moderation.\nDisputes need context.\nCommission and activity must be measurable.",
    C.sand,
  )
}

{
  const slide = pptx.addSlide()
  base(slide, "02 · Product", "Three roles, one connected workflow")
  const roles = [
    ["CLIENT", "Search → evaluate → order → collaborate → review", C.copper],
    ["FREELANCER", "Publish → receive order → deliver → earn → grow", C.aqua2],
    ["ADMIN", "Monitor → moderate → resolve → configure → support", C.sand],
  ]
  roles.forEach(([name, text, color], i) => {
    const y = 1.9 + i * 1.45
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.85,
      y,
      w: 11.7,
      h: 1.05,
      rectRadius: 0.06,
      fill: { color: C.white },
      line: { color: C.line },
    })
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.12,
      y: y + 0.22,
      w: 1.65,
      h: 0.58,
      rectRadius: 0.05,
      fill: { color },
      line: { color },
    })
    slide.addText(name, {
      x: 1.12,
      y: y + 0.41,
      w: 1.65,
      h: 0.15,
      fontSize: 10,
      bold: true,
      color: C.white,
      align: "center",
      margin: 0,
    })
    slide.addText(text, {
      x: 3.15,
      y: y + 0.34,
      w: 8.7,
      h: 0.32,
      fontSize: 16,
      bold: true,
      color: C.ink,
      margin: 0,
    })
  })
}

{
  const slide = pptx.addSlide()
  base(
    slide,
    "03 · Experience",
    "Marketplace and transaction journey",
    "Every primary action is backed by an API resource and a permission boundary.",
  )
  const steps = [
    "Discover",
    "Evaluate",
    "Order",
    "Pay",
    "Chat",
    "Deliver",
    "Review",
  ]
  steps.forEach((step, i) => {
    const x = 0.65 + i * 1.78
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.32,
      y: 2.25,
      w: 0.78,
      h: 0.78,
      fill: { color: i % 2 ? C.aqua : C.copper },
      line: { transparency: 100 },
    })
    slide.addText(String(i + 1), {
      x: x + 0.32,
      y: 2.5,
      w: 0.78,
      h: 0.18,
      fontSize: 13,
      bold: true,
      color: C.white,
      align: "center",
      margin: 0,
    })
    slide.addText(step, {
      x,
      y: 3.25,
      w: 1.42,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: C.ink,
      align: "center",
      margin: 0,
    })
    if (i < steps.length - 1)
      slide.addShape(pptx.ShapeType.line, {
        x: x + 1.12,
        y: 2.64,
        w: 0.66,
        h: 0,
        line: {
          color: C.stone,
          width: 2,
          beginArrowType: "none",
          endArrowType: "triangle",
        },
      })
  })
  card(
    slide,
    1.25,
    4.25,
    3.3,
    1.55,
    "Trust",
    "Ratings, status tracking, secure checkout",
    C.copper,
  )
  card(
    slide,
    5.0,
    4.25,
    3.3,
    1.55,
    "Momentum",
    "Notifications and real-time collaboration",
    C.aqua2,
  )
  card(
    slide,
    8.75,
    4.25,
    3.3,
    1.55,
    "Resolution",
    "Dispute workflow with admin context",
    C.sand,
  )
}

{
  const slide = pptx.addSlide()
  base(
    slide,
    "04 · Design",
    "Copper aquamarine dream",
    "A warm, trustworthy visual system adapted from the provided marketplace references.",
  )
  const colors = [
    ["Aquamarine", C.aqua],
    ["Aqua", C.aqua2],
    ["Copper", C.copper],
    ["Peach", C.peach],
    ["Sand", C.sand],
    ["Stone", C.stone],
  ]
  colors.forEach(([name, color], i) => {
    const x = 0.8 + (i % 3) * 4.1,
      y = 2.0 + Math.floor(i / 3) * 1.65
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.75,
      h: 1.25,
      rectRadius: 0.06,
      fill: { color },
      line: { transparency: 100 },
    })
    slide.addText(name, {
      x: x + 0.25,
      y: y + 0.28,
      w: 2.3,
      h: 0.25,
      fontSize: 15,
      bold: true,
      color: [C.sand, C.stone].includes(color) ? C.ink : C.white,
      margin: 0,
    })
    slide.addText(`#${color}`, {
      x: x + 0.25,
      y: y + 0.72,
      w: 2,
      h: 0.18,
      fontSize: 10,
      color: [C.sand, C.stone].includes(color) ? C.ink : C.white,
      margin: 0,
    })
  })
  slide.addText("Typography: Manrope for hierarchy · DM Sans for product UI", {
    x: 0.8,
    y: 5.5,
    w: 11.7,
    h: 0.35,
    fontSize: 17,
    bold: true,
    color: C.ink,
    align: "center",
    margin: 0,
  })
}

{
  const slide = pptx.addSlide()
  base(
    slide,
    "05 · Collaboration",
    "Real-time messaging that preserves context",
  )
  bullets(
    slide,
    [
      "Persistent conversation and message history",
      "Cloudinary attachment URLs",
      "Online presence and live indicators",
      "Typing events over Channels",
      "Read timestamps and double-check receipts",
      "Unread counts and message notifications",
      "Enter to send and clear conversation",
    ],
    0.8,
    1.85,
    5.8,
    4.9,
  )
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.0,
    y: 1.8,
    w: 5.55,
    h: 4.65,
    rectRadius: 0.08,
    fill: { color: "EEF2F1" },
    line: { color: C.line },
  })
  ;[
    ["The first direction feels strong.", 7.35, 2.25, C.white, C.ink],
    ["Agreed — tightening the details.", 8.6, 3.25, C.copper, C.white],
    ["brand-board-v3.pdf", 7.35, 4.3, C.white, C.ink],
    ["This is exactly the direction.", 8.7, 5.3, C.copper, C.white],
  ].forEach(([text, x, y, fill, color]) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.45,
      h: 0.58,
      rectRadius: 0.08,
      fill: { color: fill },
      line: { color: fill === C.white ? C.line : fill },
    })
    slide.addText(text, {
      x: x + 0.16,
      y: y + 0.18,
      w: 3.1,
      h: 0.15,
      fontSize: 9.5,
      color,
      margin: 0,
    })
  })
}

{
  const slide = pptx.addSlide()
  base(slide, "06 · Dashboards", "Operational visibility for every role")
  card(
    slide,
    0.65,
    1.9,
    3.85,
    4.35,
    "Client dashboard",
    "Order table and status badges\nOrder detail and disputes\nReviews after completion\nSpending chart and totals\nProfile, password, payment settings",
    C.copper,
  )
  card(
    slide,
    4.75,
    1.9,
    3.85,
    4.35,
    "Freelancer dashboard",
    "Service creation and deletion\nIncoming order management\nEarnings chart and totals\nAverage rating\nStripe payout account settings",
    C.aqua2,
  )
  card(
    slide,
    8.85,
    1.9,
    3.85,
    4.35,
    "Admin portal",
    "Ban and unban users\nCategory management APIs\nDispute resolution\nCommission and maintenance settings\nDirect user support chat",
    C.sand,
  )
}

{
  const slide = pptx.addSlide()
  base(slide, "07 · Architecture", "Composable frontend, domain-driven backend")
  const layers = [
    [
      "React + Tailwind",
      "Routes · pages · reusable components · Context API",
      C.copper,
    ],
    [
      "Axios + WebSocket",
      "JWT interceptor · refresh · REST resources · Channels events",
      C.peach,
    ],
    [
      "Django REST Framework",
      "Serializers · viewsets · role permissions · workflows",
      C.aqua2,
    ],
    ["Data & services", "MySQL · Redis · Stripe · Cloudinary", C.aqua],
  ]
  layers.forEach(([name, text, color], i) => {
    const y = 1.85 + i * 1.18
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.2,
      y,
      w: 10.9,
      h: 0.86,
      rectRadius: 0.05,
      fill: { color },
      line: { color },
    })
    slide.addText(name, {
      x: 1.5,
      y: y + 0.25,
      w: 2.7,
      h: 0.22,
      fontSize: 14,
      bold: true,
      color: C.white,
      margin: 0,
    })
    slide.addText(text, {
      x: 4.15,
      y: y + 0.26,
      w: 7.4,
      h: 0.2,
      fontSize: 11,
      color: C.white,
      margin: 0,
    })
  })
}

{
  const slide = pptx.addSlide()
  base(slide, "08 · Data", "Core domain model and relationships")
  const entities = [
    ["User", "role · profile · Stripe"],
    ["Service", "freelancer · category · package"],
    ["Order", "client · service · status · total"],
    ["Conversation", "participants · messages"],
    ["Review", "completed order · rating"],
    ["Dispute", "order · reason · resolution"],
    ["Notification", "kind · payload · read"],
    ["PlatformSetting", "commission · maintenance"],
  ]
  entities.forEach(([name, fields], i) => {
    const x = 0.75 + (i % 4) * 3.12,
      y = 1.9 + Math.floor(i / 4) * 2.1
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.75,
      h: 1.45,
      rectRadius: 0.06,
      fill: { color: C.white },
      line: { color: i % 2 ? C.aqua2 : C.copper, width: 1.5 },
    })
    slide.addText(name, {
      x: x + 0.2,
      y: y + 0.25,
      w: 2.35,
      h: 0.25,
      fontSize: 14,
      bold: true,
      color: C.ink,
      align: "center",
      margin: 0,
    })
    slide.addText(fields, {
      x: x + 0.2,
      y: y + 0.72,
      w: 2.35,
      h: 0.35,
      fontSize: 9.5,
      color: C.muted,
      align: "center",
      margin: 0,
    })
  })
}

{
  const slide = pptx.addSlide()
  base(slide, "09 · Security", "Trust is a system property")
  bullets(
    slide,
    [
      "Short-lived JWT access tokens and rotating refresh flow",
      "Role-aware API permissions and object ownership checks",
      "Stripe webhook signature verification",
      "Server-calculated order totals from service pricing",
      "Environment-managed secrets and deploy-time configuration",
      "Restricted CORS and trusted origins",
      "Cloudinary preset constraints for uploads",
      "TLS, WSS, managed backups, and audit logging in production",
    ],
    0.9,
    1.75,
    11.5,
    4.95,
  )
}

{
  const slide = pptx.addSlide()
  base(slide, "10 · Deployment", "A practical production topology")
  const nodes = [
    ["Vercel", "React static app", 0.8, C.copper],
    ["Render / Fly.io", "Daphne ASGI API", 4.2, C.aqua2],
    ["Managed MySQL", "Durable records", 8.0, C.aqua],
    ["Managed Redis", "Channels fan-out", 8.0, C.peach],
    ["Stripe", "Checkout + webhook", 4.2, C.sand],
    ["Cloudinary", "Media delivery", 0.8, C.stone],
  ]
  nodes.forEach(([title, sub, x, color], i) => {
    const y = i < 3 ? 2.0 : 4.5
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 2.8,
      h: 1.25,
      rectRadius: 0.06,
      fill: { color },
      line: { color },
    })
    slide.addText(title, {
      x: x + 0.2,
      y: y + 0.27,
      w: 2.4,
      h: 0.25,
      fontSize: 14,
      bold: true,
      color: C.white,
      align: "center",
      margin: 0,
    })
    slide.addText(sub, {
      x: x + 0.2,
      y: y + 0.73,
      w: 2.4,
      h: 0.18,
      fontSize: 9.5,
      color: C.white,
      align: "center",
      margin: 0,
    })
  })
}

{
  const slide = pptx.addSlide()
  base(slide, "11 · Delivery", "What is included in this repository")
  card(
    slide,
    0.7,
    1.9,
    3.85,
    4.25,
    "Frontend",
    "JavaScript React application\nTailwind responsive UI\nAxios API layer\nContext API state\nRouter data-mode structure\nReusable components and hooks",
    C.copper,
  )
  card(
    slide,
    4.75,
    1.9,
    3.85,
    4.25,
    "Backend",
    "Django REST resources\nJWT authentication\nChannels consumers\nMySQL configuration\nStripe checkout and webhook\nRole and ownership permissions",
    C.aqua2,
  )
  card(
    slide,
    8.8,
    1.9,
    3.85,
    4.25,
    "Operations",
    "Frontend and backend env templates\nVercel SPA routing\nRender service definition\nStep-by-step README\nProduction checklist\nPresentation deck",
    C.sand,
  )
}

{
  const slide = pptx.addSlide()
  slide.background = { color: C.aqua }
  slide.addText("READY FOR THE NEXT MOVE", {
    x: 0.8,
    y: 1.1,
    w: 5,
    h: 0.25,
    fontSize: 10,
    bold: true,
    charSpacing: 2.2,
    color: C.sand,
    margin: 0,
  })
  slide.addText("FreelanceMKT", {
    x: 0.8,
    y: 1.65,
    w: 7,
    h: 0.7,
    fontSize: 40,
    bold: true,
    color: C.white,
    margin: 0,
  })
  slide.addText(
    "A cohesive foundation for trusted discovery, protected transactions, real-time collaboration, and marketplace operations.",
    {
      x: 0.8,
      y: 2.65,
      w: 7.8,
      h: 1.05,
      fontSize: 20,
      color: "D9E8E6",
      margin: 0,
      breakLine: false,
    },
  )
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 4.25,
    w: 4.5,
    h: 0,
    line: { color: C.copper, width: 5 },
  })
  slide.addText("Questions & discussion", {
    x: 0.8,
    y: 4.65,
    w: 4.8,
    h: 0.4,
    fontSize: 22,
    bold: true,
    color: C.white,
    margin: 0,
  })
}

await pptx.writeFile({ fileName: "PRESENTATION.pptx" })
