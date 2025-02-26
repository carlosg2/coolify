import cuid from 'cuid';
import type { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify';
import { decrypt, encrypt, errorHandler, prisma } from '../../../../lib/common';

export async function listSources(request: FastifyRequest) {
    try {
        const teamId = request.user?.teamId;
        const sources = await prisma.gitSource.findMany({
            where: { teams: { some: { id: teamId === '0' ? undefined : teamId } } },
            include: { teams: true, githubApp: true, gitlabApp: true }
        });
        return {
            sources
        }
    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}
export async function saveSource(request, reply) {
    try {
        const { id } = request.params
        let { name, htmlUrl, apiUrl, customPort } = request.body
        if (customPort) customPort = Number(customPort)
        await prisma.gitSource.update({
            where: { id },
            data: { name, htmlUrl, apiUrl, customPort }
        });
        return reply.code(201).send()
    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}
export async function getSource(request: FastifyRequest) {
    try {
        const { id } = request.params
        const { teamId } = request.user

        const settings = await prisma.setting.findFirst({});
        if (settings.proxyPassword) settings.proxyPassword = decrypt(settings.proxyPassword);

        if (id === 'new') {
            return {
                source: {
                    name: null,
                    type: null,
                    htmlUrl: null,
                    apiUrl: null,
                    organization: null,
                    customPort: 22,
                },
                settings
            }
        }

        const source = await prisma.gitSource.findFirst({
            where: { id, teams: { some: { id: teamId === '0' ? undefined : teamId } } },
            include: { githubApp: true, gitlabApp: true }
        });
        if (!source) {
            throw { status: 404, message: 'Source not found.' }
        }

        if (source?.githubApp?.clientSecret)
            source.githubApp.clientSecret = decrypt(source.githubApp.clientSecret);
        if (source?.githubApp?.webhookSecret)
            source.githubApp.webhookSecret = decrypt(source.githubApp.webhookSecret);
        if (source?.githubApp?.privateKey) source.githubApp.privateKey = decrypt(source.githubApp.privateKey);
        if (source?.gitlabApp?.appSecret) source.gitlabApp.appSecret = decrypt(source.gitlabApp.appSecret);

        return {
            source,
            settings
        };

    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}

export async function deleteSource(request) {
    try {
        const { id } = request.params
        const source = await prisma.gitSource.delete({
            where: { id },
            include: { githubApp: true, gitlabApp: true }
        });
        if (source.githubAppId) {
            await prisma.githubApp.delete({ where: { id: source.githubAppId } });
        }
        if (source.gitlabAppId) {
            await prisma.gitlabApp.delete({ where: { id: source.gitlabAppId } });
        }
        return {}
    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }

}
export async function saveGitHubSource(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { teamId } = request.user

        const { id } = request.params
        let { name, type, htmlUrl, apiUrl, organization, customPort } = request.body

        if (customPort) customPort = Number(customPort)
        if (id === 'new') {
            const newId = cuid()
            await prisma.gitSource.create({
                data: {
                    id: newId,
                    name,
                    htmlUrl,
                    apiUrl,
                    organization,
                    customPort,
                    type: 'github',
                    teams: { connect: { id: teamId } }
                }
            });
            return {
                id: newId
            }
        }
        throw { status: 500, message: 'Wrong request.' }
    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}
export async function saveGitLabSource(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id } = request.params
        const { teamId } = request.user
        let { type, name, htmlUrl, apiUrl, oauthId, appId, appSecret, groupName, customPort } =
            request.body

        if (oauthId) oauthId = Number(oauthId);
        if (customPort) customPort = Number(customPort)
        const encryptedAppSecret = encrypt(appSecret);

        if (id === 'new') {
            const newId = cuid()
            await prisma.gitSource.create({ data: { id: newId, type, apiUrl, htmlUrl, name, customPort, teams: { connect: { id: teamId } } } });
            await prisma.gitlabApp.create({
                data: {
                    teams: { connect: { id: teamId } },
                    appId,
                    oauthId,
                    groupName,
                    appSecret: encryptedAppSecret,
                    gitSource: { connect: { id: newId } }
                }
            });
            return {
                status: 201,
                id: newId
            }
        } else {
            await prisma.gitSource.update({ where: { id }, data: { type, apiUrl, htmlUrl, name, customPort } });
            await prisma.gitlabApp.update({
                where: { id },
                data: {
                    appId,
                    oauthId,
                    groupName,
                    appSecret: encryptedAppSecret,
                }
            });
        }
        return { status: 201 };

    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}

export async function checkGitLabOAuthID(request: FastifyRequest) {
    try {
        const { oauthId } = request.body
        const found = await prisma.gitlabApp.findFirst({ where: { oauthId: Number(oauthId) } });
        if (found) {
            throw { status: 500, message: 'OAuthID already configured in Coolify.' }
        }
        return {}
    } catch ({ status, message }) {
        return errorHandler({ status, message })
    }
}