-- Align the original games table with the catalog API while preserving its rows.
ALTER TABLE `jogos`
  CHANGE COLUMN `nome` `titulo` VARCHAR(100) NOT NULL,
  CHANGE COLUMN `jogo` `genero` VARCHAR(80) NOT NULL,
  ADD COLUMN `plataforma` VARCHAR(80) NOT NULL DEFAULT 'Não informado',
  ADD COLUMN `anoLancamento` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `preco` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `updatedAt` DATETIME(3) NULL;

UPDATE `jogos` SET `updatedAt` = `createdAt`;
ALTER TABLE `jogos` MODIFY COLUMN `updatedAt` DATETIME(3) NOT NULL;

CREATE TABLE `usuarios` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `senhaHash` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `usuarios_email_key` (`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
