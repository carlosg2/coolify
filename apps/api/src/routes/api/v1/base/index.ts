import { FastifyPluginAsync } from 'fastify';
import { errorHandler, version } from '../../../../lib/common';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async (request) => {
        try {
            return {
                version,
                whiteLabeled: process.env.COOLIFY_WHITE_LABELED === 'true',
                whiteLabeledIcon: process.env.COOLIFY_WHITE_LABELED_ICON,
            }
        } catch ({ status, message }) {
            return errorHandler({ status, message })
        }
    });

};

export default root;
