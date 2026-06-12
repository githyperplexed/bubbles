<script lang="ts">
	import ChatPanel from "$playground/components/chat-panel.svelte";
	import DocsPanel from "$playground/components/docs-panel.svelte";
	import ChatIcon from "$playground/components/icons/chat-icon.svelte";
	import DocsIcon from "$playground/components/icons/docs-icon.svelte";
	import MusicIcon from "$playground/components/icons/music-icon.svelte";
	import MusicPanel from "$playground/components/music-panel.svelte";
	import type { BubbleManager } from "$src/index";
	import { mount, type Component } from "svelte";

	const { manager }: { manager: BubbleManager } = $props();

	interface Card {
		id: string;
		title: string;
		description: string;
		panel: Component;
		icon: Component<{ color?: string; size?: number }>;
		iconColor: string;
	}

	// Icon colors stay on the Tailwind palette via its CSS variables.
	const cards: Card[] = [
		{
			id: "chat",
			title: "Chat",
			description: "Support conversation",
			panel: ChatPanel,
			icon: ChatIcon,
			iconColor: "var(--color-sky-500)"
		},
		{
			id: "docs",
			title: "Docs",
			description: "Guides and reference",
			panel: DocsPanel,
			icon: DocsIcon,
			iconColor: "var(--color-amber-500)"
		},
		{
			id: "music",
			title: "Music",
			description: "Mini player",
			panel: MusicPanel,
			icon: MusicIcon,
			iconColor: "var(--color-violet-500)"
		}
	];

	let spawned = $state<Record<string, boolean>>({});

	// The library takes plain HTMLElements; display: contents keeps the
	// mounted component the real layout participant.
	const mountInto = (component: Component, props?: Record<string, unknown>): HTMLElement => {
		const holder = document.createElement("div");
		holder.style.display = "contents";
		mount(component, { target: holder, props });
		return holder;
	};

	const toggle = (card: Card) => {
		if (spawned[card.id]) {
			manager.remove(card.id);
			spawned[card.id] = false;
			return;
		}

		manager.add({
			id: card.id,
			icon: mountInto(card.icon, { color: card.iconColor }),
			content: mountInto(card.panel),
			onDismiss: () => (spawned[card.id] = false)
		});
		spawned[card.id] = true;
	};
</script>

<div class="fixed inset-0 flex flex-col items-center justify-center gap-4 font-sans sm:flex-row">
	{#each cards as card (card.id)}
		<button
			type="button"
			onclick={() => toggle(card)}
			class="flex w-48 cursor-pointer flex-col items-start gap-1 rounded-xl border p-6 text-left transition-colors {spawned[
				card.id
			]
				? 'border-zinc-600 bg-zinc-900'
				: 'border-zinc-800 bg-black hover:bg-zinc-900'}"
		>
			<card.icon color={card.iconColor} size={20} />
			<span class="mt-2 text-sm font-semibold text-white">{card.title}</span>
			<span class="text-xs text-zinc-400">{card.description}</span>
		</button>
	{/each}
</div>
