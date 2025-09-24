import prisma from "../config/prisma.js";

export const createPortfolio = async (userName, initialCapital) => {
  const portfolio = await prisma.portfolio.create({
    data: {
      userName,
      initialCapital,
    },
  });

  return portfolio;
};

export const addCapital = async (userName, amount) => {
  const portfolio = await prisma.portfolio.update({
    where: { userName },
    data: {
      initialCapital: {
        increment: parseFloat(amount),
      },
    },
  });

  return portfolio;
};
