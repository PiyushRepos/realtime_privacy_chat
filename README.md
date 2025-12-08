<div align="center">
  <h1>💬 Realtime Chat</h1>
  <p><strong>A blazingly fast, modern real-time chat application</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Upstash-Redis-00e9a3?style=for-the-badge&logo=redis" alt="Upstash" />
  </p>
</div>

---

## ✨ Features

- 🚀 **Real-time messaging** - Instant message delivery powered by Upstash Realtime
- 🎨 **Modern UI** - Clean and responsive design with Tailwind CSS 4
- 🔐 **Authentication** - Secure auth system with Elysia
- 💾 **Redis Backend** - Fast data persistence with Upstash Redis
- 🏠 **Room-based Chat** - Create and join different chat rooms
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Type-safe** - Full TypeScript support across the stack
- 🎯 **Server Actions** - Leveraging Next.js 16 capabilities

## 🛠️ Tech Stack

**Frontend:**

- [Next.js 16](https://nextjs.org) - React framework with App Router
- [React 19](https://react.dev) - Latest React with React Compiler
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com) - Utility-first styling
- [TanStack Query](https://tanstack.com/query) - Powerful async state management

**Backend:**

- [Elysia](https://elysiajs.com) - Fast and ergonomic web framework
- [Upstash Redis](https://upstash.com) - Serverless Redis database
- [Upstash Realtime](https://upstash.com) - Real-time messaging infrastructure
- [Zod](https://zod.dev) - Schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm (recommended) or npm
- Upstash account ([Sign up here](https://upstash.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/piyushrepos/realtime_privacy_chat.git
   cd realtime_chat
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
realtime_chat/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── [[...slug]]/   # Auth API
│   │   │   └── realtime/      # Realtime API
│   │   ├── room/          # Chat room pages
│   │   └── lib/           # Core utilities
│   │       ├── client.ts        # API client
│   │       ├── realtime-client.ts
│   │       ├── realtime.ts
│   │       └── redis.ts
│   ├── components/        # React components
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── ...config files
```

## 🎯 Usage

### Creating a Chat Room

1. Open the application in your browser
2. Enter your username
3. Create a new room or join an existing one
4. Start chatting in real-time!

### Joining an Existing Room

Simply share the room URL with others, and they can join instantly.

## 🔧 Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🌟 Key Features Explained

### Real-time Communication

Messages are delivered instantly using Upstash Realtime, providing a seamless chat experience with minimal latency.

### Auto Expiring Rooms

Chat rooms and their content are automatically deleted after 10 minutes of creation, ensuring privacy and reducing data retention.

### Secure Authentication

User authentication is handled securely using Elysia, ensuring that only authorized users can access chat rooms.

### Type Safety

Every part of the application is fully typed, from the API routes to the frontend components, ensuring reliability and great developer experience.

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy your app:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

Or manually:

```bash
pnpm build
vercel --prod
```

Don't forget to add your environment variables in the Vercel dashboard!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React Framework
- [Upstash](https://upstash.com) - Serverless Database Platform
- [Elysia](https://elysiajs.com) - Ergonomic Framework
- [Vercel](https://vercel.com) - Deployment Platform

---

<div align="center">
  <p>Built with ❤️ using Next.js and Upstash</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
