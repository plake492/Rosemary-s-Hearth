export const projectContext = (dbSchema: string) => `
Project Name: Rosemary-s-Hearth
Project Description: 
A micro-bakery online storefront built with React, TypeScript, Tailwind, and Vite. The site currently shows products, media, and price tiers, and pushes users to an external ordering platform. Admin can manage products, media, and pricing, and view order windows. Future plans include a full Stripe checkout and eventual SaaS expansion.

Tech Stack:
- Frontend: React, TypeScript, Vite, TailwindCSS, Tanstack Router
- Backend: Supabase (DB, auth, file storage)
- Hosting: Vercel
- AI Integration: MCP Server + GitHub Copilot as “AI intern”

Admin Dashboard Features:
- Login via Supabase auth
- Add/edit/delete products
- Manage product media
- Manage price-quantity tiers
- Set order windows (with countdown logic)
- Assign ingredients to products (future)

Frontend Features:
- Product grid with thumbnails and price tiers
- Countdown timer to order window
- External order link per product
- Product detail page with media gallery and ingredient list

Database Schema:
${dbSchema}

Current Tasks / Phase 1:
1. DB Migration: add ingredients & product_ingredients tables
2. Admin: CRUD for ingredients
3. Admin: improve product form (support ingredients + order link)
4. Storefront: product grid with countdown + order CTA
5. Storefront: product detail page (media, price tiers, ingredients)
6. QA: verify order-window logic

Future Tasks / Phase 2:
1. Implement Stripe checkout
2. Admin order management panel
3. SaaS readiness: multi-bakery support
4. Enhanced search/filter for storefront
5. Notifications for order windows opening/closing
`;
