# KenaKata - E-Commerce Storefront

A modern lifestyle and fashion e-commerce storefront built with Next.js. KenaKata delivers product discovery, filtering, authentication, cart and wishlist management, and a multi-step checkout flow with Bangladesh-focused mobile wallet options (bKash, Nagad, Rocket) alongside card payments.

## Getting Started

### Prerequisites

- Node.js 20+
- A running backend API (see `NEXT_PUBLIC_API_BASE_URL`)

### Setup

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm start      # run production server
```

## Project Overview

KenaKata is a full-featured storefront oriented around a premium shopping experience:

- **Catalog:** Homepage highlights, category browsing, searchable product listing with filters (category, price range, sort), and product detail pages with galleries and related items.
- **Account:** Registration, login, profile management (including avatar upload), and JWT-based session handling with token refresh.
- **Cart & checkout:** Per-user cart persisted in `localStorage`, selective checkout of cart items, shipping form validation, and a simulated payment flow for card and mobile-wallet methods.
- **UX:** Dark/light theming, route-level loading skeletons, debounced search, URL-synced filters, and responsive layouts from mobile through desktop.

The UI talks to an external REST API through a decoupled `lib/api/` layer. Checkout and payment processing are simulated on the client; no real payment gateway is wired yet.

## Architecture Explanation

The app follows a component-driven Next.js App Router structure:

| Layer | Role |
| --- | --- |
| **`app/`** | Routes, layouts, metadata, and loading UI (`loading.tsx` per segment). |
| **`components/`** | Feature UI (products, checkout, auth, layout) and Shadcn primitives under `components/ui/`. |
| **`lib/api/`** | Typed API client (`client.ts`, `products.ts`, `categories.ts`, `auth.ts`, `users.ts`) isolated from UI. |
| **`lib/*-context.tsx`** | Global client state: `AuthProvider`, `CartProvider`, `WishlistProvider`. |
| **`lib/hooks/`** | Shared hooks such as `useDebounce` for search. |

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Shadcn UI (Radix primitives), `react-hook-form` + Zod, `next-themes`, Lucide icons.

**State management:** React Context for auth, cart, and wishlist. Cart data is keyed by user ID in `localStorage`; auth tokens and profile live in `localStorage` with a `user-session` cookie for lightweight session hints.

**Data flow:** Server Components call `getProducts` / `getCategories` on the homepage. Interactive routes (product listing, detail, cart, profile) fetch via the same API modules from the client. Fetches use `next: { revalidate }` on the server and an in-memory cache (60s TTL) in `lib/api/client.ts` to reduce duplicate requests.

## Rendering Strategy Decisions

Rendering is hybrid—optimized for SEO where it matters and interactivity where filters and forms demand it.

- **ISR on the homepage:** `app/page.tsx` is a Server Component with `export const revalidate = 60`. Product and category data are fetched in parallel (`Promise.all`) and rendered as static HTML, revalidated every 60 seconds.
- **Server-side fetch caching:** API helpers use `fetch(..., { next: { revalidate: 60 } })` (products) and `300` (categories). Combined with the in-memory cache, this limits load on the external API during server renders.
- **Client-heavy catalog UX:** `app/products/page.tsx` and `app/products/[id]/page.tsx` are Client Components. Filters, debounced search, pagination, and URL query sync require browser state; listing and detail data are loaded client-side after hydration.
- **SEO without client metadata:** Product detail pages cannot export `metadata` from a Client Component. `app/products/[id]/layout.tsx` is a Server Component that runs `generateMetadata` (title, description, OpenGraph image) while the page handles interactivity.
- **Server shells for protected flows:** Checkout (`app/checkout/page.tsx`) exports static metadata and wraps `CheckoutContent` in `ProtectedRoute` + `Suspense`. The checkout form itself stays client-side.
- **Localized `"use client"`:** Interactive leaves—cart actions, filters, forms, gallery, navbar—are client components; root layout, homepage, and metadata layouts remain server-side where possible.

## Tradeoffs Made

- **Context API vs. Redux/Zustand:** Native Context keeps dependencies light and fits auth/cart/wishlist scope. Tradeoff: providers must be split and consumers scoped carefully to avoid broad re-renders as the app grows.
- **Client product listing vs. server rendering:** The products page prioritizes instant filter/search UX and URL-driven state over SSR for every filter combination. Tradeoff: first paint shows skeletons; SEO for filtered listing URLs is weaker than a fully server-rendered catalog.
- **External API + local persistence:** Products and auth hit a real REST backend; carts and wishlists use `localStorage`. Tradeoff: fast iteration without order/cart tables, but carts do not sync across devices or browsers until a backend cart API exists.
- **Client-side checkout validation:** Zod + `superRefine` enforces card vs. mobile-wallet fields with immediate feedback. Tradeoff: a production backend must re-validate all submissions; payment today is a timed UI simulation only.
- **Client-side sorting:** Sort (price low/high, newest) runs in the browser because the API does not expose sort parameters. Tradeoff: simple implementation, but only the current page of results is sorted.

## Performance Considerations

- **`next/image`:** Product cards, galleries, hero, and category grids use optimized images with remote patterns configured in `next.config.ts` (Unsplash, placeholders, API hosts, etc.) and explicit `sizes` / `quality` where needed.
- **Debounced search:** `useDebounce` (500ms) on the product listing reduces API calls while typing.
- **Caching:** Server `revalidate`, in-memory API cache, and skeleton loading states keep perceived latency low.
- **Code splitting:** Client boundaries are pushed to leaves; checkout and product listing use `Suspense` with dedicated loading components.
- **Concurrent homepage fetch:** Categories and products load in parallel on the server.
- **Pagination:** Listing requests use `offset` / `limit` (12 per page) instead of loading the full catalog at once.

## Challenges Faced

- **Metadata on client pages:** Next.js does not allow `metadata` exports from Client Components. Product detail SEO required a server `layout.tsx` with `generateMetadata` while keeping the interactive page as `"use client"`.
- **Conditional checkout validation:** Card and mobile-wallet flows need different required fields. Zod `superRefine` plus `form.watch("paymentMethod")` keeps one schema in sync with the UI without duplicate forms.
- **Input formatting vs. form state:** Card number, expiry, and phone fields need display formatting while `react-hook-form` stores normalized values—handled with controlled overrides on specific inputs.
- **Responsive hero layout:** Fixed hero heights clipped CTAs on small screens; resolved with fluid `min-h` breakpoints (`min-h-[450px]` through `lg:h-[66vh]`).
- **Unreliable upstream images:** Some API image URLs are malformed or blocked. `sanitizeImageUrl` and `sanitizeProduct` in `lib/api/client.ts` fall back to placeholders to avoid broken galleries.
- **Auth hydration:** Restoring JWT from `localStorage`, validating via profile fetch, and refreshing expired tokens on load required careful loading states so protected routes do not flash or redirect incorrectly.

## Future Improvements

- **Server-rendered catalog:** Move product listing (and optionally detail) to Server Components with `searchParams` for filters to improve SEO and first contentful paint.
- **Backend cart & orders:** Persist carts, wishlists, and order history in a database instead of `localStorage` only.
- **Real payments:** Integrate Stripe and/or local gateways (bKash, Nagad) with server-side payment intents and webhooks.
- **API sort & pagination metadata:** Add server-side sort and total-count headers so client-side sorting and page estimation are unnecessary.
- **Stronger global state:** Consider Zustand (or similar) if cart/auth subscriptions cause performance issues at scale.
- **E2E tests:** Add Playwright or Cypress for registration, add-to-cart, and checkout happy paths.
- **Environment template:** Ship `.env.example` documenting `NEXT_PUBLIC_API_BASE_URL` and any future secrets.
