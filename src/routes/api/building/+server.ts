import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	handleGetBuildingsByType,
	handleUpdateBuilding,
	handleAddBuilding,
	handleDeleteBuilding
} from '$lib/server/services/building';

import { logger } from '$lib/server/logger';

const log = logger.child({ module: 'BuildingApi' });

export const GET: RequestHandler = async ({ url }) => {
	log.info('Received building GET request: %s', url.toString());

	const getBuildingsResult = await handleGetBuildingsByType(url);

	if (getBuildingsResult.error) {
		log.error('Failed to process building GET request: %s', url.toString());
		throw error(getBuildingsResult.error.status, getBuildingsResult.error.message);
	}

	log.debug('Got following data from building GET request');
	log.debug('%s', JSON.stringify(getBuildingsResult.result));

	return json({ data: getBuildingsResult.result }, { status: 200 });
};

export const POST: RequestHandler = async ({ request, url }) => {
	log.info('Received building POST request: %s', url.toString());

	const addBuildingResult = await handleAddBuilding(request);

	if (addBuildingResult.error) {
		log.error('Failed to process building POST request: %s', url.toString());
		throw error(addBuildingResult.error.status, addBuildingResult.error.message);
	}

	return json({ data: addBuildingResult.result }, { status: 200 });
};

export const PUT: RequestHandler = async ({ request, url }) => {
	log.info('Received building PUT request: %s', url.toString());

	const updateBuildingResult = await handleUpdateBuilding(request);

	if (updateBuildingResult.error) {
		log.error('Failed to process building PUT request: %s', url.toString());
		throw error(updateBuildingResult.error.status, updateBuildingResult.error.message);
	}

	return json({ data: updateBuildingResult.result }, { status: 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
	log.info('Received building DELETE request: %s', url.toString());

	const deleteBuildingResult = await handleDeleteBuilding(url);

	if (deleteBuildingResult.error) {
		log.error('Failed to process building DELETE request: %s', url.toString());
		throw error(deleteBuildingResult.error.status, deleteBuildingResult.error.message);
	}

	return json({}, { status: 200 });
};
