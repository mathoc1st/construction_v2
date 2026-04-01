import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	handleGetBuildingsByType,
	handleUpdateBuilding,
	handleAddBuilding,
	handleDeleteBuilding
} from '$lib/server/services/building';

import { logger } from '$lib/server/logger';
import { sessionCookieName, validateSessionToken } from '$lib/server/services/auth';
import { buildingQueryOptionsDtoSchema } from '$lib/server/api/buildings/building.dto';
import { toApiErrorResponse, toApiOkResponse } from '$lib/utils';
import type { User } from '$lib/server/api/users/user.domain';
import { buildingService } from '$lib/server/api/buildings/buildings.service';

const log = logger.child({ module: 'BuildingApi' });

export const GET: RequestHandler = async ({ url, locals }) => {
	// log.info('Received building GET request: %s', url.toString());
	// const getBuildingsResult = await handleGetBuildingsByType(url);
	// if (getBuildingsResult.error) {
	// 	log.error('Failed to process building GET request: %s', url.toString());
	// 	throw error(getBuildingsResult.error.status, getBuildingsResult.error.message);
	// }
	// log.debug('Got following data from building GET request');
	// log.debug('%s', JSON.stringify(getBuildingsResult.result));
	// return json({ data: getBuildingsResult.result }, { status: 200 });

	const user: User = locals.user;

	if (!user) {
		return json(toApiErrorResponse('Unauthorized'), { status: 401 });
	}

	const parseResult = buildingQueryOptionsDtoSchema.safeParse({
		filters: {
			constructionType: url.searchParams.get('constructionType')?.toUpperCase(),
			outsideFinishes: url.searchParams.getAll('outsideFinishes').map((val) => val.toUpperCase()),
			width: url.searchParams.get('width'),
			length: url.searchParams.get('length'),
			height: url.searchParams.get('height'),
			bedrooms: url.searchParams.get('bedrooms'),
			bathrooms: url.searchParams.get('bathrooms'),
			floors: url.searchParams.get('floors'),
			veranda: url.searchParams.get('veranda')
		},
		sort: {
			sortBy: url.searchParams.get('sortBy'),
			sortOrder: url.searchParams.get('sortOrder')
		},
		pagination: {
			offset: url.searchParams.get('offset'),
			limit: url.searchParams.get('limit')
		}
	});

	if (!parseResult.success) {
		return json(toApiErrorResponse('Invalid query parameters'), {
			status: 400
		});
	}

	const buildings = await buildingService.findBuildings({
		performedBy: user,
		filters: parseResult.data.filters,
		sort: parseResult.data.sort,
		pagination: parseResult.data.pagination
	});

	return json(toApiOkResponse(buildings), {
		status: 200
	});
};

export const POST: RequestHandler = async ({ url, locals }) => {
	// log.info('Received building POST request: %s', url.toString());
	// const sessionToken = cookies.get(sessionCookieName);
	// if (!sessionToken) {
	// 	throw error(401);
	// }
	// const { session, user } = await validateSessionToken(sessionToken);
	// if (!session || !user) {
	// 	throw error(401);
	// }
	// const addBuildingResult = await handleAddBuilding(request);
	// if (addBuildingResult.error) {
	// 	log.error('Failed to process building POST request: %s', url.toString());
	// 	throw error(addBuildingResult.error.status, addBuildingResult.error.message);
	// }
	// return json({ data: addBuildingResult.result }, { status: 200 });

	const user: User = locals.user;

	if (!user) {
		return json(toApiErrorResponse('Unauthorized'), { status: 401 });
	}
};

export const PUT: RequestHandler = async ({ request, url, cookies }) => {
	log.info('Received building PUT request: %s', url.toString());

	const sessionToken = cookies.get(sessionCookieName);

	if (!sessionToken) {
		throw error(401);
	}

	const { session, user } = await validateSessionToken(sessionToken);

	if (!session || !user) {
		throw error(401);
	}

	const updateBuildingResult = await handleUpdateBuilding(request);

	if (updateBuildingResult.error) {
		log.error('Failed to process building PUT request: %s', url.toString());
		throw error(updateBuildingResult.error.status, updateBuildingResult.error.message);
	}

	return json({ data: updateBuildingResult.result }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ url, cookies }) => {
	log.info('Received building DELETE request: %s', url.toString());

	const sessionToken = cookies.get(sessionCookieName);

	if (!sessionToken) {
		throw error(401);
	}

	const { session, user } = await validateSessionToken(sessionToken);

	if (!session || !user) {
		throw error(401);
	}

	const deleteBuildingResult = await handleDeleteBuilding(url);

	if (deleteBuildingResult.error) {
		log.error('Failed to process building DELETE request: %s', url.toString());
		throw error(deleteBuildingResult.error.status, deleteBuildingResult.error.message);
	}

	return json({}, { status: 200 });
};
