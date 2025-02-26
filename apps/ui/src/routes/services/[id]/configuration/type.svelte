<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch, params, url, stuff }) => {
		try {
			const { service } = stuff;
			if (service?.type && !url.searchParams.get('from')) {
				return {
					status: 302,
					redirect: `/services/${params.id}`
				};
			}
			const response = await get(`/services/${params.id}/configuration/type`);
			return {
				props: {
					...response
				}
			};
		} catch (error) {
			return {
				status: 500,
				error: new Error(`Could not load ${url}`)
			};
		}
	};
</script>

<script lang="ts">
	export let types: any;

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get, post } from '$lib/api';
	import { t } from '$lib/translations';
	import { errorNotification } from '$lib/common';

	import PlausibleAnalytics from '$lib/components/svg/services/PlausibleAnalytics.svelte';
	import NocoDb from '$lib/components/svg/services/NocoDB.svelte';
	import MinIo from '$lib/components/svg/services/MinIO.svelte';
	import VsCodeServer from '$lib/components/svg/services/VSCodeServer.svelte';
	import Wordpress from '$lib/components/svg/services/Wordpress.svelte';
	import VaultWarden from '$lib/components/svg/services/VaultWarden.svelte';
	import LanguageTool from '$lib/components/svg/services/LanguageTool.svelte';
	import N8n from '$lib/components/svg/services/N8n.svelte';
	import UptimeKuma from '$lib/components/svg/services/UptimeKuma.svelte';
	import Ghost from '$lib/components/svg/services/Ghost.svelte';
	import MeiliSearch from '$lib/components/svg/services/MeiliSearch.svelte';
	import Umami from '$lib/components/svg/services/Umami.svelte';
	import Hasura from '$lib/components/svg/services/Hasura.svelte';
	import Fider from '$lib/components/svg/services/Fider.svelte';

	const { id } = $page.params;
	const from = $page.url.searchParams.get('from');

	async function handleSubmit(type: any) {
		try {
			await post(`/services/${id}/configuration/type`, { type });
			return await goto(from || `/services/${id}`);
		} catch (error) {
			return errorNotification(error);
		}
	}
</script>

<div class="flex space-x-1 p-6 font-bold">
	<div class="mr-4 text-2xl tracking-tight">{$t('forms.select_a_service')}</div>
</div>

<div class="flex flex-wrap justify-center">
	{#each types as type}
		<div class="p-2">
			<form on:submit|preventDefault={() => handleSubmit(type.name)}>
				<button type="submit" class="box-selection relative text-xl font-bold hover:bg-pink-600">
					{#if type.name === 'plausibleanalytics'}
						<PlausibleAnalytics isAbsolute />
					{:else if type.name === 'nocodb'}
						<NocoDb isAbsolute />
					{:else if type.name === 'minio'}
						<MinIo isAbsolute />
					{:else if type.name === 'vscodeserver'}
						<VsCodeServer isAbsolute />
					{:else if type.name === 'wordpress'}
						<Wordpress isAbsolute />
					{:else if type.name === 'vaultwarden'}
						<VaultWarden isAbsolute />
					{:else if type.name === 'languagetool'}
						<LanguageTool isAbsolute />
					{:else if type.name === 'n8n'}
						<N8n isAbsolute />
					{:else if type.name === 'uptimekuma'}
						<UptimeKuma isAbsolute />
					{:else if type.name === 'ghost'}
						<Ghost isAbsolute />
					{:else if type.name === 'meilisearch'}
						<MeiliSearch isAbsolute />
					{:else if type.name === 'umami'}
						<Umami isAbsolute />
					{:else if type.name === 'hasura'}
						<Hasura isAbsolute />
					{:else if type.name === 'fider'}
						<Fider isAbsolute />
					{/if}{type.fancyName}
				</button>
			</form>
		</div>
	{/each}
</div>
