DROP DATABASE IF EXISTS `catsdb`;
CREATE DATABASE `catsdb`;

USE catsdb;
CREATE TABLE `Cats`(
  `id` BIGINT(20) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `addedAt` TIMESTAMP NOT NULL,
  `breed` VARCHAR(255),
  `birthdate` DATE,
  `imageUrl` VARCHAR(255),
  `lastSeenAt` TIMESTAMP NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `weight` FLOAT NOT NULL
);

INSERT INTO `Cats`
  (`id`, `name`, `addedAt`, `breed`, `birthdate`, `imageUrl`, `lastSeenAt`, `password`, `username`, `weight`)
VALUES
  (1, 'Meow', NOW(), 'Yellow', '2018-08-01', 'https://placekitten.com/200/300',  NOW(), 'me0w', 'meow', 22),
  (1, 'Purr', NOW(), 'Gray', '2012-01-23', 'https://placekitten.com/200/300',  NOW(), 'puRR', 'purr', 19.1),
  (1, 'Hiss', NOW(), 'Orange', '2015-05-20', 'https://placekitten.com/200/300',  NOW(), 'hi55', 'hiss', 15.2);
