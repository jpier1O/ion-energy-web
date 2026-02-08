# Ion Energy – Meter Telemetry Dashboard

Dashboard built with **Next.js (App Router) + TypeScript** that processes cumulative meter readings into **hourly consumption** and visualizes results.

## Live Demo
- Production: https://ion-energy-web.vercel.app/

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Recharts (charts)
- Vitest (unit tests)

## Requirements
- Node.js >= 20 (Project is deployed using Node 24 on Vercel)

## Getting Started

### Install
```bash
npm install
```

# Run Locally

```bash
npm run dev
```


# Run Tests

```bash
npm test
```


# Production Build

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Tradeoff / assumption
When consecutive readings span more than one hour, the consumption delta is distributed evenly across each missing hour bucket and flagged as `gap_estimated`. This is an approximation because the dataset does not include intermediate readings inside the gap, this approach preserves total consumption while making estimated segments explicit.
