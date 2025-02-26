<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ stuff }) => {
		return {
			props: { ...stuff }
		};
	};
</script>

<script lang="ts">
	import Services from './_Services/_Services.svelte';
	import { get } from '$lib/api';
	import { page } from '$app/stores';
	import { status } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import ServiceLinks from './_ServiceLinks.svelte';

	export let service: any;
	export let readOnly: any;
	export let settings: any;

	const { id } = $page.params;
	let loading = {
		usage: false
	};
	let usage = {
		MemUsage: 0,
		CPUPerc: 0,
		NetIO: 0
	};
	let usageInterval: any;

	async function getUsage() {
		if (loading.usage) return;
		if (!$status.service.isRunning) return;
		loading.usage = true;
		const data = await get(`/services/${id}/usage`);
		usage = data.usage;
		loading.usage = false;
	}

	onDestroy(() => {
		clearInterval(usageInterval);
	});
	onMount(async () => {
		await getUsage();
		usageInterval = setInterval(async () => {
			await getUsage();
		}, 1000);
	});
</script>

<div class="flex h-20 items-center space-x-2 p-5 px-6 font-bold">
	<div class="-mb-5 flex-col">
		<div class="md:max-w-64 truncate text-base tracking-tight md:text-2xl lg:block">
			Configuration
		</div>
		<span class="text-xs">{service.name}</span>
	</div>

	{#if service.fqdn}
		<a
			href={service.fqdn}
			target="_blank"
			class="icons tooltip-bottom flex items-center bg-transparent text-sm"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
				<line x1="10" y1="14" x2="20" y2="4" />
				<polyline points="15 4 20 4 20 9" />
			</svg></a
		>
	{/if}

	<ServiceLinks {service} />
</div>
<div class="mx-auto max-w-4xl px-6 py-4">
	<div class="text-2xl font-bold">Service Usage</div>
	<div class="mx-auto">
		<dl class="relative mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div class="overflow-hidden rounded px-4 py-5 text-center sm:p-6 sm:text-left">
				<dt class=" text-sm font-medium text-white">Used Memory / Memory Limit</dt>
				<dd class="mt-1 text-xl font-semibold text-white">
					{usage?.MemUsage}
				</dd>
			</div>

			<div class="overflow-hidden rounded px-4 py-5 text-center sm:p-6 sm:text-left">
				<dt class="truncate text-sm font-medium text-white">Used CPU</dt>
				<dd class="mt-1 text-xl font-semibold text-white ">
					{usage?.CPUPerc}
				</dd>
			</div>

			<div class="overflow-hidden rounded px-4 py-5 text-center sm:p-6 sm:text-left">
				<dt class="truncate text-sm font-medium text-white">Network IO</dt>
				<dd class="mt-1 text-xl font-semibold text-white ">
					{usage?.NetIO}
				</dd>
			</div>
		</dl>
	</div>
</div>
<Services bind:service bind:readOnly bind:settings />
