import { describe, expect, it, beforeEach } from 'vitest';
import { Listing } from '../../listing.domain';
import {
	EmptyStringError,
	InvalidUrlError,
	NonPositiveValueError
} from '../../../common/errors/errors.domain';

describe('Listing Domain Unit', () => {
	let listing: Listing;

	beforeEach(() => {
		listing = Listing.fromPersistence({
			id: 1,
			title: 'Test Listing',
			description: 'This is a test listing.',
			price: 100,
			originalPrice: 150,
			images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
			views: 0,
			createdAt: new Date(),
			updatedAt: null,
			deletedAt: null,
			createdByUserId: 1,
			updatedByUserId: null,
			deletedByUserId: null
		});
	});

	describe('Listing Creation', () => {
		it('should create a listing with valid parameters', () => {
			const listing = Listing.create({
				title: 'Test Listing',
				description: 'This is a test listing.',
				price: 100,
				originalPrice: 150,
				images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
				createdByUserId: 1
			});

			expect(listing).toBeInstanceOf(Listing);
			expect(listing.title).toBe('Test Listing');
			expect(listing.description).toBe('This is a test listing.');
			expect(listing.price).toBe(100);
			expect(listing.originalPrice).toBe(150);
			expect(listing.images).toEqual([
				'http://example.com/image1.jpg',
				'http://example.com/image2.jpg'
			]);
			expect(listing.createdByUserId).toEqual(1);
		});

		it('should create a building from persistence', () => {
			const listing = Listing.fromPersistence({
				id: 1,
				title: 'Test Listing',
				description: 'This is a test listing.',
				price: 100,
				originalPrice: 150,
				images: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
				views: 0,
				createdAt: new Date(),
				updatedAt: null,
				deletedAt: null,
				createdByUserId: 1,
				updatedByUserId: null,
				deletedByUserId: null
			});

			expect(listing).toBeInstanceOf(Listing);
			expect(listing.id).toBe(1);
			expect(listing.title).toBe('Test Listing');
			expect(listing.description).toBe('This is a test listing.');
			expect(listing.price).toBe(100);
			expect(listing.originalPrice).toBe(150);
			expect(listing.images).toEqual([
				'http://example.com/image1.jpg',
				'http://example.com/image2.jpg'
			]);
			expect(listing.views).toBe(0);
			expect(listing.createdByUserId).toEqual(1);
			expect(listing.updatedByUserId).toBeNull();
			expect(listing.deletedByUserId).toBeNull();
			expect(listing.createdAt).toBeInstanceOf(Date);
			expect(listing.updatedAt).toBeNull();
			expect(listing.deletedAt).toBeNull();
		});
	});

	describe('Change Title', () => {
		it('should change the title of the listing', () => {
			listing.changeTitle('New Title', 2);
			expect(listing.title).toBe('New Title');
			expect(listing.updatedByUserId).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting title to an empty string', () => {
			expect(() => listing.changeTitle('   ', 2)).toThrow(EmptyStringError);
		});
	});

	describe('Change Description', () => {
		it('should change the description of the listing', () => {
			listing.changeDescription('New Description', 2);
			expect(listing.description).toBe('New Description');
			expect(listing.updatedByUserId).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting description to an empty string', () => {
			expect(() => listing.changeDescription('   ', 2)).toThrow(EmptyStringError);
		});
	});

	describe('Change Price', () => {
		it('should change the price of the listing', () => {
			listing.changePrice(200, 2);
			expect(listing.price).toBe(200);
			expect(listing.updatedByUserId).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting price to zero or negative', () => {
			expect(() => listing.changePrice(0, 2)).toThrow(NonPositiveValueError);
			expect(() => listing.changePrice(-50, 2)).toThrow(NonPositiveValueError);
		});
	});

	describe('Change Original Price', () => {
		it('should change the original price of the listing', () => {
			listing.changeOriginalPrice(200, 2);
			expect(listing.originalPrice).toBe(200);
			expect(listing.updatedByUserId).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting original price to zero or negative', () => {
			expect(() => listing.changeOriginalPrice(0, 2)).toThrow(NonPositiveValueError);
			expect(() => listing.changeOriginalPrice(-50, 2)).toThrow(NonPositiveValueError);
		});
	});

	describe('Change Images', () => {
		it('should change the images of the listing', () => {
			const newImages = ['http://example.com/image3.jpg', 'http://example.com/image4.jpg'];
			listing.changeImages(newImages, 2);
			expect(listing.images).toEqual(newImages);
			expect(listing.updatedByUserId).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting images to an array with invalid URLs', () => {
			expect(() => listing.changeImages(['invalid-url'], 2)).toThrow(InvalidUrlError);
		});
	});

	describe('Mark Deleted', () => {
		it('should mark the listing as deleted', () => {
			listing.markDeleted(3);
			expect(listing.isDeleted()).toBe(true);
			expect(listing.deletedByUserId).toBe(3);
			expect(listing.deletedAt).toBeInstanceOf(Date);
		});
	});
});
