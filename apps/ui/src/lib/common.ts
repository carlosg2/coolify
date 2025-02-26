import { toast } from '@zerodevx/svelte-toast';
export const asyncSleep = (delay: number) =>
	new Promise((resolve) => setTimeout(resolve, delay));

export function errorNotification(error: any): void {
	if (error.message) {
		if (error.message === 'Cannot read properties of undefined (reading \'postMessage\')') {
			toast.push('Currently there is background process in progress. Please try again later.');
			return;
		}
		toast.push(error.message);
	} else {
		toast.push('Ooops, something is not okay, are you okay?');
	}
	console.error(JSON.stringify(error));
}

export function getDomain(domain: string) {
	return domain?.replace('https://', '').replace('http://', '');
}
export function dashify(str: string, options?: any): string {
	if (typeof str !== 'string') return str;
	return str
		.trim()
		.replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, (m) => (options && options.condense ? '-' : m))
		.toLowerCase();
}

export const dateOptions: any = {
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric',
	hour12: false
};

export const staticDeployments = [
	'react',
	'vuejs',
	'static',
	'svelte',
	'gatsby',
	'php',
	'astro',
	'eleventy'
];
export const notNodeDeployments = ['php', 'docker', 'rust', 'python', 'deno', 'laravel'];


export function generateRemoteEngine(destination: any) {
	return `ssh://${destination.user}@${destination.ipAddress}:${destination.port}`;
}

export function changeQueryParams(buildId: string) {
	const queryParams = new URLSearchParams(window.location.search);
	queryParams.set('buildId', buildId);
	// @ts-ignore
	return history.pushState(null, null, '?' + queryParams.toString());
}

// export const supportedDatabaseTypesAndVersions = [
// 	{
// 		name: 'mongodb',
// 		fancyName: 'MongoDB',
// 		baseImage: 'bitnami/mongodb',
// 		versions: ['5.0', '4.4', '4.2']
// 	},
// 	{ name: 'mysql', fancyName: 'MySQL', baseImage: 'bitnami/mysql', versions: ['8.0', '5.7'] },
// 	{
// 		name: 'mariadb',
// 		fancyName: 'MariaDB',
// 		baseImage: 'bitnami/mariadb',
// 		versions: ['10.7', '10.6', '10.5', '10.4', '10.3', '10.2']
// 	},
// 	{
// 		name: 'postgresql',
// 		fancyName: 'PostgreSQL',
// 		baseImage: 'bitnami/postgresql',
// 		versions: ['14.2.0', '13.6.0', '12.10.0	', '11.15.0', '10.20.0']
// 	},
// 	{
// 		name: 'redis',
// 		fancyName: 'Redis',
// 		baseImage: 'bitnami/redis',
// 		versions: ['6.2', '6.0', '5.0']
// 	},
// 	{ name: 'couchdb', fancyName: 'CouchDB', baseImage: 'bitnami/couchdb', versions: ['3.2.1'] }
// ];
// export const supportedServiceTypesAndVersions = [
// 	{
// 		name: 'plausibleanalytics',
// 		fancyName: 'Plausible Analytics',
// 		baseImage: 'plausible/analytics',
// 		images: ['bitnami/postgresql:13.2.0', 'yandex/clickhouse-server:21.3.2.5'],
// 		versions: ['latest', 'stable'],
// 		recommendedVersion: 'stable',
// 		ports: {
// 			main: 8000
// 		}
// 	},
// 	{
// 		name: 'nocodb',
// 		fancyName: 'NocoDB',
// 		baseImage: 'nocodb/nocodb',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 8080
// 		}
// 	},
// 	{
// 		name: 'minio',
// 		fancyName: 'MinIO',
// 		baseImage: 'minio/minio',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 9001
// 		}
// 	},
// 	{
// 		name: 'vscodeserver',
// 		fancyName: 'VSCode Server',
// 		baseImage: 'codercom/code-server',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 8080
// 		}
// 	},
// 	{
// 		name: 'wordpress',
// 		fancyName: 'Wordpress',
// 		baseImage: 'wordpress',
// 		images: ['bitnami/mysql:5.7'],
// 		versions: ['latest', 'php8.1', 'php8.0', 'php7.4', 'php7.3'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 80
// 		}
// 	},
// 	{
// 		name: 'vaultwarden',
// 		fancyName: 'Vaultwarden',
// 		baseImage: 'vaultwarden/server',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 80
// 		}
// 	},
// 	{
// 		name: 'languagetool',
// 		fancyName: 'LanguageTool',
// 		baseImage: 'silviof/docker-languagetool',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 8010
// 		}
// 	},
// 	{
// 		name: 'n8n',
// 		fancyName: 'n8n',
// 		baseImage: 'n8nio/n8n',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 5678
// 		}
// 	},
// 	{
// 		name: 'uptimekuma',
// 		fancyName: 'Uptime Kuma',
// 		baseImage: 'louislam/uptime-kuma',
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 3001
// 		}
// 	},
// 	{
// 		name: 'ghost',
// 		fancyName: 'Ghost',
// 		baseImage: 'bitnami/ghost',
// 		images: ['bitnami/mariadb'],
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 2368
// 		}
// 	},
// 	{
// 		name: 'meilisearch',
// 		fancyName: 'Meilisearch',
// 		baseImage: 'getmeili/meilisearch',
// 		images: [],
// 		versions: ['latest'],
// 		recommendedVersion: 'latest',
// 		ports: {
// 			main: 7700
// 		}
// 	},
// 	{
// 		name: 'umami',
// 		fancyName: 'Umami',
// 		baseImage: 'ghcr.io/mikecao/umami',
// 		images: ['postgres:12-alpine'],
// 		versions: ['postgresql-latest'],
// 		recommendedVersion: 'postgresql-latest',
// 		ports: {
// 			main: 3000
// 		}
// 	},
// 	{
// 		name: 'hasura',
// 		fancyName: 'Hasura',
// 		baseImage: 'hasura/graphql-engine',
// 		images: ['postgres:12-alpine'],
// 		versions: ['latest', 'v2.5.1'],
// 		recommendedVersion: 'v2.5.1',
// 		ports: {
// 			main: 8080
// 		}
// 	},
// 	{
// 		name: 'fider',
// 		fancyName: 'Fider',
// 		baseImage: 'getfider/fider',
// 		images: ['postgres:12-alpine'],
// 		versions: ['stable'],
// 		recommendedVersion: 'stable',
// 		ports: {
// 			main: 3000
// 		}
// 		// },
// 		// {
// 		// 	name: 'appwrite',
// 		// 	fancyName: 'AppWrite',
// 		// 	baseImage: 'appwrite/appwrite',
// 		// 	images: ['appwrite/influxdb', 'appwrite/telegraf', 'mariadb:10.7', 'redis:6.0-alpine3.12'],
// 		// 	versions: ['latest', '0.13.0'],
// 		// 	recommendedVersion: '0.13.0',
// 		// 	ports: {
// 		// 		main: 3000
// 		// 	}
// 		// }
// 	}
// ];

export const getServiceMainPort = (service: string) => {
	const serviceType = supportedServiceTypesAndVersions.find((s) => s.name === service);
	if (serviceType) {
		return serviceType.ports.main;
	}
	return null;
};

export const supportedServiceTypesAndVersions = [
	{
		name: 'plausibleanalytics',
		fancyName: 'Plausible Analytics',
		baseImage: 'plausible/analytics',
		images: ['bitnami/postgresql:13.2.0', 'yandex/clickhouse-server:21.3.2.5'],
		versions: ['latest', 'stable'],
		recommendedVersion: 'stable',
		ports: {
			main: 8000
		}
	},
	{
		name: 'nocodb',
		fancyName: 'NocoDB',
		baseImage: 'nocodb/nocodb',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 8080
		}
	},
	{
		name: 'minio',
		fancyName: 'MinIO',
		baseImage: 'minio/minio',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 9001
		}
	},
	{
		name: 'vscodeserver',
		fancyName: 'VSCode Server',
		baseImage: 'codercom/code-server',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 8080
		}
	},
	{
		name: 'wordpress',
		fancyName: 'Wordpress',
		baseImage: 'wordpress',
		images: ['bitnami/mysql:5.7'],
		versions: ['latest', 'php8.1', 'php8.0', 'php7.4', 'php7.3'],
		recommendedVersion: 'latest',
		ports: {
			main: 80
		}
	},
	{
		name: 'vaultwarden',
		fancyName: 'Vaultwarden',
		baseImage: 'vaultwarden/server',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 80
		}
	},
	{
		name: 'languagetool',
		fancyName: 'LanguageTool',
		baseImage: 'silviof/docker-languagetool',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 8010
		}
	},
	{
		name: 'n8n',
		fancyName: 'n8n',
		baseImage: 'n8nio/n8n',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 5678
		}
	},
	{
		name: 'uptimekuma',
		fancyName: 'Uptime Kuma',
		baseImage: 'louislam/uptime-kuma',
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 3001
		}
	},
	{
		name: 'ghost',
		fancyName: 'Ghost',
		baseImage: 'bitnami/ghost',
		images: ['bitnami/mariadb'],
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 2368
		}
	},
	{
		name: 'meilisearch',
		fancyName: 'Meilisearch',
		baseImage: 'getmeili/meilisearch',
		images: [],
		versions: ['latest'],
		recommendedVersion: 'latest',
		ports: {
			main: 7700
		}
	},
	{
		name: 'umami',
		fancyName: 'Umami',
		baseImage: 'ghcr.io/mikecao/umami',
		images: ['postgres:12-alpine'],
		versions: ['postgresql-latest'],
		recommendedVersion: 'postgresql-latest',
		ports: {
			main: 3000
		}
	},
	{
		name: 'hasura',
		fancyName: 'Hasura',
		baseImage: 'hasura/graphql-engine',
		images: ['postgres:12-alpine'],
		versions: ['latest', 'v2.5.1'],
		recommendedVersion: 'v2.5.1',
		ports: {
			main: 8080
		}
	},
	{
		name: 'fider',
		fancyName: 'Fider',
		baseImage: 'getfider/fider',
		images: ['postgres:12-alpine'],
		versions: ['stable'],
		recommendedVersion: 'stable',
		ports: {
			main: 3000
		}
	}
];

export function handlerNotFoundLoad(error: any, url: URL) {
	if (error?.status === 404) {
		return {
			status: 302,
			redirect: '/'
		};
	}
	return {
		status: 500,
		error: new Error(`Could not load ${url}`)
	};
}