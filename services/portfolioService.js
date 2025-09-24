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
      currentCapital: {
        increment: parseFloat(amount),
      },
    },
  });

  return portfolio;
};

export const getPortfolio = async (userName) => {
  const portfolio = await prisma.portfolio.findUnique({
    where: { userName },
    include: {
      positions: true,
    },
  });

  return portfolio;
};

export const buyPosition = async (
  portfolioId,
  symbol,
  quantity,
  currentPrice
) => {
  const existingPosition = await prisma.position.findUnique({
    where: {
      portfolioId_symbol: {
        portfolioId,
        symbol,
      },
    },
  });

  if (existingPosition) {
    // Update existing position with weighted average price
    const currentTotalValue =
      existingPosition.quantity * existingPosition.avgPrice;
    const newTotalValue = currentTotalValue + quantity * currentPrice;
    const newTotalQuantity = existingPosition.quantity + quantity;
    const newAvgPrice = newTotalValue / newTotalQuantity;

    await prisma.position.update({
      where: {
        portfolioId_symbol: {
          portfolioId,
          symbol,
        },
      },
      data: {
        quantity: newTotalQuantity,
        avgPrice: newAvgPrice,
      },
    });
  } else {
    // Create new position
    await prisma.position.create({
      data: {
        portfolioId,
        symbol,
        quantity,
        avgPrice: currentPrice,
      },
    });
  }

  await Promise.all([
    // decrement portfolio capital
    prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        currentCapital: {
          decrement: quantity * currentPrice,
        },
      },
    }),

    // add trade record
    prisma.trade.create({
      data: {
        portfolioId,
        symbol,
        quantity,
        price: currentPrice,
        type: "BUY",
      },
    }),
  ]);
};

export const sellPosition = async (
  portfolioId,
  symbol,
  quantity,
  currentPrice
) => {
  await Promise.all([
    // delete the position because it is sold all quantity
    prisma.position.delete({
      where: {
        portfolioId_symbol: {
          portfolioId,
          symbol,
        },
      },
    }),

    // increment portfolio capital
    prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        currentCapital: {
          increment: quantity * currentPrice,
        },
      },
    }),

    // add trade record
    prisma.trade.create({
      data: {
        portfolioId,
        symbol,
        quantity,
        price: currentPrice,
        type: "SELL",
      },
    }),
  ]);
};
