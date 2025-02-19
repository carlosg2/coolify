<script lang="ts">
	export let source: any;
	export let settings: any;
	import { page } from '$app/stores';
	import { post } from '$lib/api';
	import Explainer from '$lib/components/Explainer.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { t } from '$lib/translations';
	import { dashify, errorNotification, getDomain } from '$lib/common';
	import { appSession } from '$lib/store';
	import { dev } from '$app/env';

	const { id } = $page.params;

	$: selfHosted = source.htmlUrl !== 'https://github.com';

	let loading = false;

	async function handleSubmit() {
		loading = true;
		try {
			await post(`/sources/${id}`, {
				name: source.name,
				htmlUrl: source.htmlUrl.replace(/\/$/, ''),
				apiUrl: source.apiUrl.replace(/\/$/, '')
			});
			toast.push('Configuration saved.');
		} catch (error) {
			return errorNotification(error);
		} finally {
			loading = false;
		}
	}

	async function installRepositories(source: any) {
		const { htmlUrl } = source;
		const left = screen.width / 2 - 1020 / 2;
		const top = screen.height / 2 - 1000 / 2;
		const newWindow = open(
			`${htmlUrl}/apps/${source.githubApp.name}/installations/new`,
			'GitHub',
			'resizable=1, scrollbars=1, fullscreen=0, height=1000, width=1020,top=' +
				top +
				', left=' +
				left +
				', toolbar=0, menubar=0, status=0'
		);
		const timer = setInterval(() => {
			if (newWindow?.closed) {
				clearInterval(timer);
				window.location.reload();
			}
		}, 100);
	}

	async function newGithubApp() {
		loading = true;
		try {
			const { id } = await post(`/sources/new/github`, {
				type: 'github',
				name: source.name,
				htmlUrl: source.htmlUrl.replace(/\/$/, ''),
				apiUrl: source.apiUrl.replace(/\/$/, ''),
				organization: source.organization,
				customPort: source.customPort
			});
			const { organization, htmlUrl } = source;
			const { fqdn } = settings;
			const host = dev
				? 'http://localhost:3001'
				: fqdn
				? fqdn
				: `http://${window.location.host}` || '';
			const domain = getDomain(fqdn);

			let url = 'settings/apps/new';
			if (organization) url = `organizations/${organization}/settings/apps/new`;
			const name = dashify(domain) || 'app';
			const data = JSON.stringify({
				name: `coolify-${name}`,
				url: host,
				hook_attributes: {
					url: dev
						? 'https://webhook.site/0e5beb2c-4e9b-40e2-a89e-32295e570c21/events'
						: `${host}/webhooks/github/events`
				},
				redirect_url: `${host}/webhooks/github`,
				callback_urls: [`${host}/login/github/app`],
				public: false,
				request_oauth_on_install: false,
				setup_url: `${host}/webhooks/github/install?gitSourceId=${id}`,
				setup_on_update: true,
				default_permissions: {
					contents: 'read',
					metadata: 'read',
					pull_requests: 'read',
					emails: 'read'
				},
				default_events: ['pull_request', 'push']
			});
			const form = document.createElement('form');
			form.setAttribute('method', 'post');
			form.setAttribute('action', `${htmlUrl}/${url}?state=${id}`);
			const input = document.createElement('input');
			input.setAttribute('id', 'manifest');
			input.setAttribute('name', 'manifest');
			input.setAttribute('type', 'hidden');
			input.setAttribute('value', data);
			form.appendChild(input);
			document.getElementsByTagName('body')[0].appendChild(form);
			form.submit();
		} catch (error) {
			return errorNotification(error);
		}
	}
</script>

<div class="mx-auto max-w-4xl px-6">
	{#if !source.githubAppId}
		<form on:submit|preventDefault={newGithubApp} class="py-4">
			<div class="flex space-x-1 pb-7 font-bold">
				<div class="title">General</div>
				{#if !source.githubAppId}
					<button class="bg-orange-600" type="submit">Save</button>
				{/if}
			</div>
			<div class="grid grid-flow-row gap-2 px-10">
				<div class="grid grid-flow-row gap-2">
					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="name" class="text-base font-bold text-stone-100">Name</label>
						<input name="name" id="name" required bind:value={source.name} />
					</div>
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="htmlUrl" class="text-base font-bold text-stone-100">HTML URL</label>
					<input name="htmlUrl" id="htmlUrl" required bind:value={source.htmlUrl} />
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="apiUrl" class="text-base font-bold text-stone-100">API URL</label>
					<input name="apiUrl" id="apiUrl" required bind:value={source.apiUrl} />
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="customPort" class="text-base font-bold text-stone-100">Custom SSH Port</label>
					<input
						name="customPort"
						id="customPort"
						disabled={!selfHosted || source.githubAppId}
						readonly={!selfHosted || source.githubAppId}
						required
						value={source.customPort}
					/>
					<Explainer
						text="If you use a self-hosted version of Git, you can provide custom port for all the Git related actions."
					/>
				</div>
				<div class="grid grid-cols-2">
					<div class="flex flex-col">
						<label for="organization" class="pt-2 text-base font-bold text-stone-100"
							>Organization</label
						>
						<Explainer
							text="Fill it if you would like to use an organization's as your Git Source. Otherwise your user will be used."
						/>
					</div>
					<input
						name="organization"
						id="organization"
						placeholder="eg: coollabsio"
						bind:value={source.organization}
					/>
				</div>
			</div>
		</form>
	{:else if source.githubApp?.installationId}
		<form on:submit|preventDefault={handleSubmit} class="py-4">
			<div class="flex space-x-1 pb-5 font-bold">
				<div class="title">{$t('general')}</div>
				{#if $appSession.isAdmin}
					<button
						type="submit"
						class:bg-orange-600={!loading}
						class:hover:bg-orange-500={!loading}
						disabled={loading}>{loading ? 'Saving...' : 'Save'}</button
					>
					<a
						class="no-underline button justify-center flex items-center"
						href={`${source.htmlUrl}/apps/${source.githubApp.name}/installations/new`}
						>{$t('source.change_app_settings', { name: 'GitHub' })}</a
					>
				{/if}
			</div>
			<div class="grid grid-flow-row gap-2 px-10">
				<div class="grid grid-flow-row gap-2">
					<div class="mt-2 grid grid-cols-2 items-center">
						<label for="name" class="text-base font-bold text-stone-100">{$t('forms.name')}</label>
						<input name="name" id="name" required bind:value={source.name} />
					</div>
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="htmlUrl" class="text-base font-bold text-stone-100">HTML URL</label>
					<input
						name="htmlUrl"
						id="htmlUrl"
						disabled={source.githubAppId}
						readonly={source.githubAppId}
						required
						bind:value={source.htmlUrl}
					/>
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="apiUrl" class="text-base font-bold text-stone-100">API URL</label>
					<input
						name="apiUrl"
						id="apiUrl"
						required
						disabled={source.githubAppId}
						readonly={source.githubAppId}
						bind:value={source.apiUrl}
					/>
				</div>
				<div class="grid grid-cols-2 items-center">
					<label for="customPort" class="text-base font-bold text-stone-100">Custom SSH Port</label>
					<input
						name="customPort"
						id="customPort"
						disabled={!selfHosted}
						readonly={!selfHosted}
						required
						value={source.customPort}
					/>
					<Explainer
						text="If you use a self-hosted version of Git, you can provide custom port for all the Git related actions."
					/>
				</div>
				<div class="grid grid-cols-2">
					<div class="flex flex-col">
						<label for="organization" class="pt-2 text-base font-bold text-stone-100"
							>Organization</label
						>
					</div>
					<input
						readonly
						disabled
						name="organization"
						id="organization"
						placeholder="eg: coollabsio"
						bind:value={source.organization}
					/>
				</div>
			</div>
		</form>
	{:else}
		<div class="text-center">
			<a href={`${source.htmlUrl}/apps/${source.githubApp.name}/installations/new`}>
				<button class="box-selection bg-orange-600 hover:bg-orange-500 text-xl"
					>Install Repositories</button
				></a
			>
		</div>
	{/if}
</div>
