# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

```
shpe-website-2025
├─ .next
│  ├─ app-build-manifest.json
│  ├─ build
│  │  └─ chunks
│  │     ├─ [root-of-the-server]__23dcc81a._.js
│  │     ├─ [root-of-the-server]__23dcc81a._.js.map
│  │     ├─ [root-of-the-server]__8d1c356d._.js
│  │     ├─ [root-of-the-server]__8d1c356d._.js.map
│  │     ├─ [turbopack]_runtime.js
│  │     ├─ [turbopack]_runtime.js.map
│  │     ├─ postcss_config_js_transform_ts_c2e3f562._.js
│  │     └─ postcss_config_js_transform_ts_c2e3f562._.js.map
│  ├─ build-manifest.json
│  ├─ cache
│  │  └─ .rscinfo
│  ├─ fallback-build-manifest.json
│  ├─ package.json
│  ├─ server
│  │  ├─ app
│  │  │  ├─ _not-found
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ alumni
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ api
│  │  │  │  └─ auth
│  │  │  │     └─ [...nextauth]
│  │  │  │        ├─ route
│  │  │  │        │  ├─ app-build-manifest.json
│  │  │  │        │  ├─ app-paths-manifest.json
│  │  │  │        │  ├─ build-manifest.json
│  │  │  │        │  ├─ next-font-manifest.json
│  │  │  │        │  ├─ react-loadable-manifest.json
│  │  │  │        │  └─ server-reference-manifest.json
│  │  │  │        ├─ route.js
│  │  │  │        ├─ route.js.map
│  │  │  │        └─ route_client-reference-manifest.js
│  │  │  ├─ board
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ calendar
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ dev-team
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  ├─ page
│  │  │  │  ├─ app-build-manifest.json
│  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  └─ server-reference-manifest.json
│  │  │  ├─ page.js
│  │  │  ├─ page.js.map
│  │  │  ├─ page_client-reference-manifest.js
│  │  │  ├─ shop
│  │  │  │  ├─ page
│  │  │  │  │  ├─ app-build-manifest.json
│  │  │  │  │  ├─ app-paths-manifest.json
│  │  │  │  │  ├─ build-manifest.json
│  │  │  │  │  ├─ next-font-manifest.json
│  │  │  │  │  ├─ react-loadable-manifest.json
│  │  │  │  │  └─ server-reference-manifest.json
│  │  │  │  ├─ page.js
│  │  │  │  ├─ page.js.map
│  │  │  │  └─ page_client-reference-manifest.js
│  │  │  └─ sponsors
│  │  │     ├─ page
│  │  │     │  ├─ app-build-manifest.json
│  │  │     │  ├─ app-paths-manifest.json
│  │  │     │  ├─ build-manifest.json
│  │  │     │  ├─ next-font-manifest.json
│  │  │     │  ├─ react-loadable-manifest.json
│  │  │     │  └─ server-reference-manifest.json
│  │  │     ├─ page.js
│  │  │     ├─ page.js.map
│  │  │     └─ page_client-reference-manifest.js
│  │  ├─ app-paths-manifest.json
│  │  ├─ chunks
│  │  │  ├─ [root-of-the-server]__d62440b3._.js
│  │  │  ├─ [root-of-the-server]__d62440b3._.js.map
│  │  │  ├─ [turbopack]_runtime.js
│  │  │  ├─ [turbopack]_runtime.js.map
│  │  │  ├─ e044d_@auth_core_66f24a4e._.js
│  │  │  ├─ e044d_@auth_core_66f24a4e._.js.map
│  │  │  ├─ e044d_jose_dist_node_esm_e9323528._.js
│  │  │  ├─ e044d_jose_dist_node_esm_e9323528._.js.map
│  │  │  └─ ssr
│  │  │     ├─ [root-of-the-server]__17a5cd94._.js
│  │  │     ├─ [root-of-the-server]__17a5cd94._.js.map
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js
│  │  │     ├─ [root-of-the-server]__50a7c09c._.js.map
│  │  │     ├─ [root-of-the-server]__86e7898f._.js
│  │  │     ├─ [root-of-the-server]__86e7898f._.js.map
│  │  │     ├─ [root-of-the-server]__8ae45f38._.js
│  │  │     ├─ [root-of-the-server]__8ae45f38._.js.map
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js
│  │  │     ├─ [root-of-the-server]__c75c51b7._.js.map
│  │  │     ├─ [root-of-the-server]__dec9bec1._.js
│  │  │     ├─ [root-of-the-server]__dec9bec1._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_030d5414._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_030d5414._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1338b7de._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1338b7de._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4aed7dc3._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4aed7dc3._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4fdb2def._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_4fdb2def._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_59fa4ecd._.js.map
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_a0239794._.js
│  │  │     ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_a0239794._.js.map
│  │  │     ├─ [turbopack]_runtime.js
│  │  │     ├─ [turbopack]_runtime.js.map
│  │  │     ├─ _033ce00a._.js
│  │  │     ├─ _033ce00a._.js.map
│  │  │     ├─ _06da9437._.js
│  │  │     ├─ _06da9437._.js.map
│  │  │     ├─ _1834aab0._.js
│  │  │     ├─ _1834aab0._.js.map
│  │  │     ├─ _23bf90d7._.js
│  │  │     ├─ _23bf90d7._.js.map
│  │  │     ├─ _25218095._.js
│  │  │     ├─ _25218095._.js.map
│  │  │     ├─ _2b82d346._.js
│  │  │     ├─ _2b82d346._.js.map
│  │  │     ├─ _3ee8eb4b._.js
│  │  │     ├─ _3ee8eb4b._.js.map
│  │  │     ├─ _40f39922._.js
│  │  │     ├─ _40f39922._.js.map
│  │  │     ├─ _664ac1f0._.js
│  │  │     ├─ _664ac1f0._.js.map
│  │  │     ├─ _6c522125._.js
│  │  │     ├─ _6c522125._.js.map
│  │  │     ├─ _76802092._.js
│  │  │     ├─ _76802092._.js.map
│  │  │     ├─ _7edd6770._.js
│  │  │     ├─ _7edd6770._.js.map
│  │  │     ├─ _9b7d1009._.js
│  │  │     ├─ _9b7d1009._.js.map
│  │  │     ├─ _9bddf9a8._.js
│  │  │     ├─ _9bddf9a8._.js.map
│  │  │     ├─ _a7eca4fb._.js
│  │  │     ├─ _a7eca4fb._.js.map
│  │  │     ├─ _be09f433._.js
│  │  │     ├─ _be09f433._.js.map
│  │  │     ├─ _c291745b._.js
│  │  │     ├─ _c291745b._.js.map
│  │  │     ├─ _c7dae3b0._.js
│  │  │     ├─ _c7dae3b0._.js.map
│  │  │     ├─ _ce4b3e74._.js
│  │  │     ├─ _ce4b3e74._.js.map
│  │  │     ├─ _d150afc4._.js
│  │  │     ├─ _d150afc4._.js.map
│  │  │     ├─ _db01204a._.js
│  │  │     ├─ _db01204a._.js.map
│  │  │     ├─ _ec15bb34._.js
│  │  │     ├─ _ec15bb34._.js.map
│  │  │     ├─ _ef2e2294._.js
│  │  │     ├─ _ef2e2294._.js.map
│  │  │     ├─ _f34ca2f7._.js
│  │  │     ├─ _f34ca2f7._.js.map
│  │  │     ├─ _f5971a8f._.js
│  │  │     ├─ _f5971a8f._.js.map
│  │  │     ├─ _f88e84fd._.js
│  │  │     ├─ _f88e84fd._.js.map
│  │  │     ├─ e044d_@auth_core_37b41ef8._.js
│  │  │     ├─ e044d_@auth_core_37b41ef8._.js.map
│  │  │     ├─ e044d_jose_dist_node_esm_7eaeda25._.js
│  │  │     ├─ e044d_jose_dist_node_esm_7eaeda25._.js.map
│  │  │     ├─ src_app__components_NavBar_tsx_aa3d0ef7._.js
│  │  │     ├─ src_app__components_NavBar_tsx_aa3d0ef7._.js.map
│  │  │     ├─ src_app__components_navBar_tsx_ca74624c._.js
│  │  │     ├─ src_app__components_navBar_tsx_ca74624c._.js.map
│  │  │     ├─ src_app__components_post_tsx_f3bf30c7._.js
│  │  │     └─ src_app__components_post_tsx_f3bf30c7._.js.map
│  │  ├─ edge
│  │  │  └─ chunks
│  │  │     ├─ [root-of-the-server]__20689123._.js
│  │  │     ├─ [root-of-the-server]__20689123._.js.map
│  │  │     ├─ _e8520708._.js
│  │  │     ├─ _e8520708._.js.map
│  │  │     ├─ edge-wrapper_3e63ff91.js
│  │  │     └─ edge-wrapper_3e63ff91.js.map
│  │  ├─ interception-route-rewrite-manifest.js
│  │  ├─ middleware
│  │  │  └─ middleware-manifest.json
│  │  ├─ middleware-build-manifest.js
│  │  ├─ middleware-manifest.json
│  │  ├─ next-font-manifest.js
│  │  ├─ next-font-manifest.json
│  │  ├─ pages
│  │  │  ├─ _app
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _app.js
│  │  │  ├─ _app.js.map
│  │  │  ├─ _document
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _document.js
│  │  │  ├─ _document.js.map
│  │  │  ├─ _error
│  │  │  │  ├─ build-manifest.json
│  │  │  │  ├─ next-font-manifest.json
│  │  │  │  ├─ pages-manifest.json
│  │  │  │  └─ react-loadable-manifest.json
│  │  │  ├─ _error.js
│  │  │  └─ _error.js.map
│  │  ├─ pages-manifest.json
│  │  ├─ server-reference-manifest.js
│  │  └─ server-reference-manifest.json
│  ├─ static
│  │  ├─ chunks
│  │  │  ├─ [next]_internal_font_google_geist_31c89cc1_module_css_f9ee138c._.single.css
│  │  │  ├─ [next]_internal_font_google_geist_31c89cc1_module_css_f9ee138c._.single.css.map
│  │  │  ├─ [root-of-the-server]__49fd8634._.js
│  │  │  ├─ [root-of-the-server]__49fd8634._.js.map
│  │  │  ├─ [root-of-the-server]__698e6b9e._.css
│  │  │  ├─ [root-of-the-server]__698e6b9e._.css.map
│  │  │  ├─ [root-of-the-server]__8df7605f._.js
│  │  │  ├─ [root-of-the-server]__8df7605f._.js.map
│  │  │  ├─ [root-of-the-server]__923cb372._.js
│  │  │  ├─ [root-of-the-server]__923cb372._.js.map
│  │  │  ├─ [root-of-the-server]__e2c08166._.js
│  │  │  ├─ [root-of-the-server]__e2c08166._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_61dcf9ba._.js.map
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_66796270._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js
│  │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_fd44f5a4._.js.map
│  │  │  ├─ _14f674b5._.js
│  │  │  ├─ _14f674b5._.js.map
│  │  │  ├─ _43ef4566._.js
│  │  │  ├─ _43ef4566._.js.map
│  │  │  ├─ _93808211._.js
│  │  │  ├─ _93808211._.js.map
│  │  │  ├─ _b63fad72._.js
│  │  │  ├─ _b63fad72._.js.map
│  │  │  ├─ _e69f0d32._.js
│  │  │  ├─ pages
│  │  │  │  ├─ _app.js
│  │  │  │  └─ _error.js
│  │  │  ├─ pages__app_5771e187._.js
│  │  │  ├─ pages__app_9114105e._.js
│  │  │  ├─ pages__app_9114105e._.js.map
│  │  │  ├─ pages__error_5771e187._.js
│  │  │  ├─ pages__error_ec6747c0._.js
│  │  │  ├─ pages__error_ec6747c0._.js.map
│  │  │  ├─ src_app_board_page_tsx_0b69dad7._.js
│  │  │  ├─ src_app_calendar_page_tsx_0b69dad7._.js
│  │  │  ├─ src_app_layout_tsx_c0237562._.js
│  │  │  ├─ src_app_page_tsx_0b69dad7._.js
│  │  │  ├─ src_app_shop_page_tsx_0b69dad7._.js
│  │  │  ├─ src_app_sponsors_page_tsx_0b69dad7._.js
│  │  │  ├─ src_styles_globals_css_f9ee138c._.single.css
│  │  │  ├─ src_styles_globals_css_f9ee138c._.single.css.map
│  │  │  ├─ src_trpc_c5525986._.js
│  │  │  └─ src_trpc_c5525986._.js.map
│  │  ├─ development
│  │  │  ├─ _buildManifest.js
│  │  │  ├─ _clientMiddlewareManifest.json
│  │  │  └─ _ssgManifest.js
│  │  └─ media
│  │     ├─ gyByhwUxId8gMEwSGFWNOITddY4-s.81df3a5b.woff2
│  │     ├─ gyByhwUxId8gMEwYGFWNOITddY4-s.b7d310ad.woff2
│  │     └─ gyByhwUxId8gMEwcGFWNOITd-s.p.da1ebef7.woff2
│  ├─ trace
│  ├─ transform.js
│  ├─ transform.js.map
│  └─ types
├─ README.md
├─ drizzle.config.ts
├─ eslint.config.js
├─ next.config.js
├─ notes.txt
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ prettier.config.js
├─ public
│  ├─ assets
│  │  ├─ accen.svg
│  │  ├─ adobe.svg
│  │  ├─ background-mobile.svg
│  │  ├─ background.svg
│  │  ├─ blue.svg
│  │  ├─ bny_mellon.svg
│  │  ├─ boa.svg
│  │  ├─ contact-mobile.svg
│  │  ├─ contact.svg
│  │  ├─ dark-blue.svg
│  │  ├─ dark-orange.svg
│  │  ├─ disney.svg
│  │  ├─ event.svg
│  │  ├─ events-mobile.svg
│  │  ├─ events.svg
│  │  ├─ github.svg
│  │  ├─ gmail.svg
│  │  ├─ google.svg
│  │  ├─ intel.svg
│  │  ├─ join-mobile.svg
│  │  ├─ join.svg
│  │  ├─ light-blue.svg
│  │  ├─ linkedin.svg
│  │  ├─ logo-footer.svg
│  │  ├─ logo.svg
│  │  ├─ menu.svg
│  │  ├─ micron.svg
│  │  ├─ microsoft.svg
│  │  ├─ nasa.svg
│  │  ├─ northrop.svg
│  │  ├─ nvidia.svg
│  │  ├─ orange.svg
│  │  ├─ pattern-mobile.svg
│  │  ├─ pattern.svg
│  │  ├─ qorvo.svg
│  │  ├─ tesla.svg
│  │  ├─ verizon.svg
│  │  ├─ wave1.svg
│  │  ├─ wave2-mobile.svg
│  │  ├─ wave2.svg
│  │  ├─ wave3-mobile.svg
│  │  ├─ wave3.svg
│  │  ├─ wavepattern-mobile.svg
│  │  ├─ wavepattern.svg
│  │  ├─ yellow-plain.svg
│  │  └─ yellow.svg
│  └─ favicon.ico
├─ src
│  ├─ app
│  │  ├─ _components
│  │  │  ├─ AboutSection.tsx
│  │  │  ├─ ContactSection.tsx
│  │  │  ├─ EventsSection.tsx
│  │  │  ├─ FooterSection.tsx
│  │  │  ├─ HeroSection.tsx
│  │  │  ├─ JoinBanner.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ PartnersSection.tsx
│  │  │  ├─ TeamSection.tsx
│  │  │  └─ post.tsx
│  │  ├─ alumni
│  │  │  └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ [...nextauth]
│  │  │  │     └─ route.ts
│  │  │  └─ trpc
│  │  │     └─ [trpc]
│  │  │        └─ route.ts
│  │  ├─ board
│  │  │  └─ page.tsx
│  │  ├─ calendar
│  │  │  └─ page.tsx
│  │  ├─ dev-team
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ shop
│  │  │  └─ page.tsx
│  │  └─ sponsors
│  │     └─ page.tsx
│  ├─ env.js
│  ├─ server
│  │  ├─ api
│  │  │  ├─ root.ts
│  │  │  ├─ routers
│  │  │  │  └─ post.ts
│  │  │  └─ trpc.ts
│  │  ├─ auth
│  │  │  ├─ config.ts
│  │  │  └─ index.ts
│  │  └─ db
│  │     ├─ index.ts
│  │     └─ schema.ts
│  ├─ styles
│  │  └─ globals.css
│  └─ trpc
│     ├─ query-client.ts
│     ├─ react.tsx
│     └─ server.ts
├─ start-database.sh
└─ tsconfig.json

```