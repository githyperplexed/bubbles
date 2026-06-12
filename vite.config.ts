import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [svelte(), tailwindcss()],
	build: {
		// The playground site; "dist" is reserved for the library build.
		outDir: "dist-site"
	},
	resolve: {
		alias: {
			$src: fileURLToPath(new URL("./src", import.meta.url)),
			$playground: fileURLToPath(new URL("./playground", import.meta.url))
		}
	}
});
