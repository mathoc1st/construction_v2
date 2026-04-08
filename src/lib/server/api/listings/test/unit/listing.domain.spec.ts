import { describe, it, type Mocked } from 'vitest';
import { Listing } from '../../listing.domain';
import type { Building } from '$lib/server/api/buildings/building.domain';

describe('Listing Domain Unit Tests', () => {
	describe('Listing Creation', () => {
		it('should create a listing for a building with valid parameters', () => {
			const building = {} as Mocked<Building>;
			const listing = Listing.create({
				building: building,
				title: 'Test Listing',
				images: ['image1.jpg', 'image2.jpg'],
				createdById: 1
			});
		});
	});
});
