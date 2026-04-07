import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUsersService } from '$lib/server/api/users/users.service';
import { getPasswordService } from '$lib/server/api/auth/password.service';
import { getSessionsService } from '$lib/server/api/auth/session/session.service';
import { SESSION_COOKIE_NAME } from '$env/static/private';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userWithId = await getUsersService().getUserByUsername(username);

		if (!userWithId) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await getPasswordService().comparePassword(
			password,
			userWithId.user.passwordHash
		);

		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const { session, token } = await getSessionsService().createSession({
			userId: userWithId.id
		});

		event.cookies.set(SESSION_COOKIE_NAME, token, {
			expires: session.expiresAt,
			secure: true,
			path: '/'
		});

		return redirect(302, '/');
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
