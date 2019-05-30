DROP DATABASE IF EXISTS `catsdb`;
CREATE DATABASE IF NOT EXISTS `catsdb`;

USE catsdb;
CREATE TABLE `Cats`(
  `id` BIGINT(20) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `addedAt` TIMESTAMP,
  `lastSeenAt` TIMESTAMP
);

INSERT INTO `Cats`(`id`, `name`, `addedAt`, `lastSeenAt`)
VALUES
  (1, 'Meow', NOW(), NOW());
