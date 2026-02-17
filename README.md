# AI Shield Dashboard

<p align="center">
  <strong>Monitor, Guide, and Secure AI Usage Across Your Organization</strong>
</p>

<p align="center">
  <a href="https://ai-shield-dashboard.vercel.app/protected"><strong>Live Demo →</strong></a>
</p>

<p align="center">
  AI Shield is a Chrome extension and dashboard solution that provides real-time visibility into AI tool usage, 
  guides employees toward safer practices, and prevents accidental data leakage.
</p>

<br/>

## Overview

AI Shield addresses the critical gap between AI policy and employee behavior. While most organizations have AI usage policies, these are rarely enforced in real-time. AI Shield bridges this gap by:

- **Detecting** AI tool usage across known domains and embedded widgets
- **Guiding** users with contextual warnings and redirects to approved alternatives
- **Logging** AI interactions (metadata only, never content) for security visibility
- **Preventing** sensitive data exposure through configurable monitoring levels

## The Problem

Organizations face significant risks from unmanaged AI usage:

- Employees copying sensitive data into unapproved AI tools
- Accidental data leakage outside the organization
- Exposure of intellectual property and personal data
- Shadow AI usage that bypasses security controls

Traditional approaches (policy documents and binary block/allow tools) fail to balance security with productivity.

## The Solution

AI Shield provides a layered approach:

### Layer 1: Chrome Extension

- Detects AI domains and interactions
- Shows contextual warnings to users
- Redirects to approved AI environments
- Collects metadata logs (no content)

### Layer 2: Dashboard (This Repository)

- Real-time visibility into AI usage patterns
- User and manager role-based access
- Monitoring level configuration
- Domain approval workflow
- Comprehensive analytics and reporting

## Features

- **Real-time AI Detection**: Identify when users access AI tools
- **Contextual Guidance**: Show warnings without blocking productivity
- **Monitoring Levels**:
  - **Low**: Basic domain and interaction tracking
  - **High/Strict**: Content monitoring to prevent sensitive data entry
- **Role-Based Access**:
  - **Employees**: View their own activity logs
  - **Managers**: Full visibility, configuration, and analytics
- **Domain Management**: Approve/deny AI domains and configure categories
- **Analytics Dashboard**: Track compliance rates, top tools, and risk patterns

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (Auth, Database, Real-time)
- **Deployment**: Vercel-ready

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
```

> [!NOTE]
> This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
> Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
> See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
