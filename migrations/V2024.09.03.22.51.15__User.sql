 START TRANSACTION;
  DROP TABLE IF EXISTS `User`;
  CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') DEFAULT 'USER' NOT NULL
  PRIMARY KEY (`id`),
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
COMMIT;