## Using the app

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following apps:

### Apps

- `web`: a [Next.js](https://nextjs.org/) app, deployed on _Vercel_. The app was located here previously: [the old repo 🚧](https://github.com/vvvvvvvector/social-network-client)
- `server`: a [NestJS](https://nestjs.com/) app, deployed on _Render_ using _Docker Runtime_. I use **free tier** on _Render_ - this means that app will spin down with inactivity, which can delay requests by **50 seconds** or **more**, so user can experience **serverless function timeout** error on a client. 🚨 **WebSockets** don't work in **production**! 🚨 **User profile activation via email** (profile is activated by default now) feature isn't implemented **yet** 🚨. The app was located here previously: [the old repo 🚧](https://github.com/vvvvvvvector/social-network-server)

### Develop

To develop all apps and packages, run the following command:

```
cd social-network-turborepo
pnpm dev
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
