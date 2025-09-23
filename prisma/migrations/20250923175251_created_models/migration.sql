-- CreateEnum
CREATE TYPE "Algo_Trading_System_Prototype"."TradeType" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "Algo_Trading_System_Prototype"."Portfolio" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "initialCapital" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Algo_Trading_System_Prototype"."Position" (
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Algo_Trading_System_Prototype"."Trade" (
    "id" SERIAL NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "Algo_Trading_System_Prototype"."TradeType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userName_key" ON "Algo_Trading_System_Prototype"."Portfolio"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Position_portfolioId_symbol_key" ON "Algo_Trading_System_Prototype"."Position"("portfolioId", "symbol");

-- AddForeignKey
ALTER TABLE "Algo_Trading_System_Prototype"."Position" ADD CONSTRAINT "Position_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Algo_Trading_System_Prototype"."Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algo_Trading_System_Prototype"."Trade" ADD CONSTRAINT "Trade_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Algo_Trading_System_Prototype"."Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
