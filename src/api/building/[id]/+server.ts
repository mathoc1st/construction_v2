import { BuildingPolicy } from '$lib/server/api/auth/policies/buildings.policy';
import { buildingService } from '$lib/server/api/buildings/buildings.service';
import { EntityNotFoundError } from '$lib/server/api/common/errors/errors.service';
import type { User } from '$lib/server/api/users/user.domain';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toApiErrorResponse, toApiOkResponse } from '$lib/utils';

export const GET: RequestHandler = async ({ params, locals }) => {
	const user: User = locals.user;

	if (!user) {
		return json(toApiErrorResponse('Unauthorized'), { status: 401 });
	}

	const id = Number(params.id);

	if (Number.isNaN(id)) {
		return json(toApiErrorResponse('Invalid id'), { status: 400 });
	}

	if (!BuildingPolicy.canRead(user)) {
		return json(toApiErrorResponse('Forbidden'), { status: 403 });
	}

	try {
		const building = await buildingService.getBuildingById(id);

		return json(toApiOkResponse(building), {
			status: 200
		});
	} catch (error) {
		if (error instanceof EntityNotFoundError) {
			return json(toApiErrorResponse('Building not found'), {
				status: 404
			});
		}
		return json(toApiErrorResponse('An unexpected error occurred while fetching the building'), {
			status: 500
		});
	}
};
