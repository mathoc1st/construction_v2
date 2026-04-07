import { SESSION_COOKIE_NAME } from '$env/static/private';
import { getSessionsService } from '$lib/server/api/auth/session/session.service';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const sessionService = getSessionsService();

	const result = await sessionService.validateSession({
		token: sessionToken
	});

	if (result.status === 'expired') {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		event.locals.user = null;
		event.locals.session = null;

		await sessionService.invalidateSession({
			token: sessionToken
		});

		return resolve(event);
	}

	if (result.status === 'invalid') {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const user = await sessionService.getUserBySessionToken(sessionToken);

	if (!user) {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

		await sessionService.invalidateSession({
			token: sessionToken
		});
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	event.locals.user = user;
	event.locals.session = result.session;
	return resolve(event);
};

export const handle: Handle = handleAuth;
