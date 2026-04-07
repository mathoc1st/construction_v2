import { describe, expect, it, beforeEach } from 'vitest';
import { Listing } from '../../listing.domain';
import { EmptyStringError, InvalidImageExtensionError } from '../../../common/errors/errors.domain';

describe('Listing Domain Unit', () => {
	let listing: Listing;

	beforeEach(() => {
		listing = Listing.fromPersistence({
			title: 'Test Listing',
			images: ['image1.jpg', 'image2.jpg'],
			views: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			createdById: 1,
			updatedById: 1,
			deletedById: null
		});
	});

	describe('Listing Creation', () => {
		it('should create a listing with valid parameters', () => {
			const listing = Listing.create({
				title: 'Test Listing',
				images: ['image1.jpg', 'image2.jpg'],
				createdById: 1
			});

			expect(listing).toBeInstanceOf(Listing);
			expect(listing.title).toBe('Test Listing');

			expect(listing.images).toEqual(['image1.jpg', 'image2.jpg']);
			expect(listing.createdById).toEqual(1);
		});

		it('should create a building from persistence', () => {
			const listing = Listing.fromPersistence({
				title: 'Test Listing',
				images: ['image1.jpg', 'image2.jpg'],
				views: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
				createdById: 1,
				updatedById: 1,
				deletedById: null
			});

			expect(listing).toBeInstanceOf(Listing);
			expect(listing.title).toBe('Test Listing');
			expect(listing.images).toEqual(['image1.jpg', 'image2.jpg']);
			expect(listing.views).toBe(0);
			expect(listing.createdById).toEqual(1);
			expect(listing.updatedById).toBe(1);
			expect(listing.deletedById).toBeNull();
			expect(listing.createdAt).toBeInstanceOf(Date);
			expect(listing.updatedAt).toBeInstanceOf(Date);
			expect(listing.deletedAt).toBeNull();
		});

		it('should throw an error when creating a listing with empty title', () => {
			expect(() =>
				Listing.create({
					title: '   ',
					images: ['image1.jpg'],
					createdById: 1
				})
			).toThrow(EmptyStringError);
		});
	});

	describe('Change Title', () => {
		it('should change the title of the listing', () => {
			listing.changeTitle('New Title', 2);
			expect(listing.title).toBe('New Title');
			expect(listing.updatedById).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting title to an empty string', () => {
			expect(() => listing.changeTitle('   ', 2)).toThrow(EmptyStringError);
		});

		it('should throw an error when updating a deleted listing', () => {
			listing.markDeleted(2);
			expect(() => listing.changeImages(['image5.jpg'], 2)).toThrow(Error);
		});
	});

	describe('Change Images', () => {
		it('should change the images of the listing', () => {
			const newImages = ['image3.jpg', 'image4.jpg'];
			listing.changeImages(newImages, 2);
			expect(listing.images).toEqual(newImages);
			expect(listing.updatedById).toBe(2);
			expect(listing.updatedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when setting images to an array with invalid paths', () => {
			expect(() => listing.changeImages(['invalid-exst.ss'], 2)).toThrow(
				InvalidImageExtensionError
			);
		});

		it('should throw an error when updating a deleted listing', () => {
			listing.markDeleted(2);
			expect(() => listing.changeImages(['image5.jpg'], 2)).toThrow(Error);
		});
	});

	describe('Mark Deleted', () => {
		it('should mark the listing as deleted', () => {
			listing.markDeleted(3);
			expect(listing.isDeleted).toBe(true);
			expect(listing.deletedById).toBe(3);
			expect(listing.deletedAt).toBeInstanceOf(Date);
		});

		it('should throw an error when marking an already deleted listing as deleted', () => {
			listing.markDeleted(3);
			expect(() => listing.markDeleted(4)).toThrow(Error);
		});

		it('should throw an error if marking deleted building twice', () => {
			listing.markDeleted(3);
			expect(() => listing.markDeleted(3)).toThrow(Error);
		});
	});
});
