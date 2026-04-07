import prisma from '../prisma';

export async function getImagesByBuildingId(id: number) {
	return prisma.image.findMany({ where: { buildingId: id } });
}
