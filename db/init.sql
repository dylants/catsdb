DROP DATABASE IF EXISTS `catsdb`;
CREATE DATABASE `catsdb`;

USE catsdb;

CREATE TABLE `Users`(
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `lastLogin` TIMESTAMP,
  `password` VARCHAR(255) NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

INSERT INTO `Users`
  (`id`, `username`, `password`, `lastLogin`)
VALUES
  (1, 'sally', 'spiffy123', NOW()),
  (2, 'john', 'password', NULL);

CREATE TABLE `Cats`(
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `breed` VARCHAR(255),
  `birthdate` DATE,
  `imageUrl` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `ownedBy` VARCHAR(255) NOT NULL,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `weight` VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (ownedBy) REFERENCES Users(username)
);

INSERT INTO `Cats`
  (`id`, `name`, `ownedBy`, `breed`, `birthdate`, `imageUrl`, `weight`)
VALUES
  (1, 'Meow', 'sally', 'Yellow', '2018-08-01', 'https://placekitten.com/200/300', 22),
  (2, 'Purr', 'sally', 'Gray', '2012-01-23', 'https://placekitten.com/200/300', 19.1),
  (3, 'Hiss', 'john', 'Orange', '2015-05-20', 'https://placekitten.com/200/300', 15.2);
