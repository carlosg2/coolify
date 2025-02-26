import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
export default {
    plugins: [sveltekit()],
    define: {
        'GITPOD_WORKSPACE_URL': JSON.stringify(process.env.GITPOD_WORKSPACE_URL)
    },
    server: {
        hmr: process.env.GITPOD_WORKSPACE_URL
        ? {
            // Due to port fowarding, we have to replace
            // 'https' with the forwarded port, as this
            // is the URI created by Gitpod.
            host: process.env.GITPOD_WORKSPACE_URL.replace("https://", "3000-"),
            protocol: "wss",
            clientPort: 443
          }
        : true,
        fs: {
            allow: ['./src/lib/locales/']
        }
    },
}