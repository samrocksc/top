import prisma from './index';

export const createUser = async (email: string, auth0Id: string, name?: string) => {
  return await prisma.user.create({
    data: {
      email,
      auth0Id,
      name,
    },
  });
};

export const findUserByAuth0Id = async (auth0Id: string) => {
  return await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
