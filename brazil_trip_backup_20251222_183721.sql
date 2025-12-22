-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: brazil_trip
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_settings`
--

DROP TABLE IF EXISTS `app_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_settings` (
  `id` int NOT NULL DEFAULT '1',
  `exchange_rate` decimal(6,2) NOT NULL DEFAULT '5.40',
  `total_budget_brl` decimal(12,2) DEFAULT NULL,
  `number_of_travelers` int NOT NULL DEFAULT '3',
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_settings`
--

LOCK TABLES `app_settings` WRITE;
/*!40000 ALTER TABLE `app_settings` DISABLE KEYS */;
INSERT INTO `app_settings` VALUES (1,5.40,15000.00,2,'2025-11-28 01:57:55.216');
/*!40000 ALTER TABLE `app_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_days`
--

DROP TABLE IF EXISTS `calendar_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `region_id` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `calendar_days_date_key` (`date`),
  KEY `calendar_days_region_id_fkey` (`region_id`),
  CONSTRAINT `calendar_days_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_days`
--

LOCK TABLES `calendar_days` WRITE;
/*!40000 ALTER TABLE `calendar_days` DISABLE KEYS */;
INSERT INTO `calendar_days` VALUES (1,'2026-01-07',1,NULL,'2025-11-27 20:17:51.391','2025-11-27 22:36:55.104'),(2,'2026-01-08',1,NULL,'2025-11-27 20:17:51.391','2025-11-27 22:36:56.186'),(3,'2026-01-06',NULL,NULL,'2025-11-27 20:17:51.391','2025-11-27 20:17:51.391'),(4,'2026-01-09',1,NULL,'2025-11-27 20:17:51.391','2025-11-27 22:36:57.862'),(5,'2026-01-11',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:08.865'),(6,'2026-01-10',3,NULL,'2025-11-27 20:17:51.391','2025-11-27 22:36:59.488'),(7,'2026-01-12',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:09.803'),(8,'2026-01-13',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:10.829'),(9,'2026-01-14',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:11.679'),(10,'2026-01-15',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:12.649'),(11,'2026-01-16',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:13.500'),(12,'2026-01-17',2,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:02.687'),(13,'2026-01-18',2,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:07.396'),(14,'2026-01-19',2,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:06.375'),(15,'2026-01-20',2,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:05.193'),(16,'2026-01-21',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:27.282'),(17,'2026-01-22',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:28.216'),(18,'2026-01-23',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:29.029'),(19,'2026-01-24',3,NULL,'2025-11-27 20:17:51.393','2025-11-27 22:37:29.934'),(20,'2026-01-25',3,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:31.425'),(21,'2026-01-26',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:19.778'),(22,'2026-01-27',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:20.758'),(23,'2026-01-28',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:21.653'),(24,'2026-01-29',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:22.538'),(25,'2026-01-30',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:23.518'),(26,'2026-01-31',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:24.742'),(27,'2026-02-01',4,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:38.601'),(28,'2026-02-02',1,NULL,'2025-11-27 20:17:51.395','2025-11-27 22:37:40.315'),(29,'2026-02-03',NULL,NULL,'2025-11-27 20:17:51.395','2025-11-27 20:17:51.395');
/*!40000 ALTER TABLE `calendar_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calendar_day_id` int NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `events_calendar_day_id_fkey` (`calendar_day_id`),
  CONSTRAINT `events_calendar_day_id_fkey` FOREIGN KEY (`calendar_day_id`) REFERENCES `calendar_days` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense_categories`
--

DROP TABLE IF EXISTS `expense_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daily_budget_per_person` decimal(10,2) DEFAULT NULL,
  `warning_threshold_percent` int NOT NULL DEFAULT '80',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_categories_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense_categories`
--

LOCK TABLES `expense_categories` WRITE;
/*!40000 ALTER TABLE `expense_categories` DISABLE KEYS */;
INSERT INTO `expense_categories` VALUES (1,'Accommodation','bed','#8B5CF6',NULL,80,'2025-11-27 20:17:51.369'),(2,'Food','utensils','#EF4444',20.00,80,'2025-11-27 20:17:51.368'),(3,'Transportation','car','#3B82F6',NULL,80,'2025-11-27 20:17:51.369'),(4,'Other','more-horizontal','#6B7280',NULL,80,'2025-11-27 20:17:51.370'),(5,'Activities','ticket','#10B981',NULL,80,'2025-11-27 20:17:51.370'),(6,'Shopping','shopping-bag','#F59E0B',NULL,80,'2025-11-27 20:17:51.370');
/*!40000 ALTER TABLE `expense_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `amount_brl` decimal(10,2) NOT NULL,
  `category_id` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `calendar_day_id` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `expenses_category_id_fkey` (`category_id`),
  KEY `expenses_calendar_day_id_fkey` (`calendar_day_id`),
  CONSTRAINT `expenses_calendar_day_id_fkey` FOREIGN KEY (`calendar_day_id`) REFERENCES `calendar_days` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `expenses_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `airline` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flight_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departure_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrival_city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departure_datetime` datetime(3) NOT NULL,
  `arrival_datetime` datetime(3) NOT NULL,
  `confirmation_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BRL',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES (1,'LATAM','LA3210','GRU','UDI','2026-01-09 17:55:00.000','2026-02-09 19:10:00.000','SKWYKW',1100.00,'BRL','','2025-11-27 22:33:40.298','2025-11-27 22:36:11.141'),(2,'GOL','G31687','UDI','CGH','2026-01-26 15:25:00.000','2026-01-26 16:50:00.000','MRCFRX',800.00,'BRL','','2025-11-27 22:35:29.082','2025-11-28 01:18:28.393'),(3,'GOL','G31240','CGH','FLN','2026-01-26 18:25:00.000','2026-01-26 18:50:00.000','MRCFRX',600.00,'BRL','','2025-11-28 01:23:43.013','2025-11-28 01:23:43.013'),(4,'LATAM','LA4671','FLN','GRU','2026-02-01 17:35:00.000','2026-03-01 19:05:00.000','LWGWIA',750.00,'BRL','','2025-11-28 01:26:40.258','2025-11-28 01:26:40.258'),(5,'AMERICAN AIRLINES','AA951','JFK','GRU','2026-01-07 18:45:00.000','2026-01-07 06:05:00.000','HIUVDK',5977.00,'BRL','LBWYZL','2025-11-28 01:48:43.763','2025-11-28 01:49:14.525'),(6,'AMERICAN AIRLINES','AA950','GRU','JFK','2026-02-02 23:15:00.000','2026-02-02 07:00:00.000','HIUVDK',5977.00,'BRL','','2025-11-28 01:51:19.128','2025-11-28 01:51:19.128');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region_id` int DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `confirmation_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BRL',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hotels_region_id_fkey` (`region_id`),
  CONSTRAINT `hotels_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Jurerê Beach Village - Flat na Praia','Alameda César Nascimento Número 646, Jurere Leste, Florianópolis, CEP 88053-500, Brazil','Florianópolis ',NULL,'2026-01-26','2026-02-01','5111197925',1097.00,6582.00,'BRL','Confirmation: 5111197925\nPIN: 1795 (Confidential)','2025-11-28 01:31:10.048','2025-11-28 01:31:10.048'),(2,'diRoma Thermas direto com o Grupo diRoma com acesso ao Acqua Park e Café da manhã','R. São Cristóvão, 1110, Caldas Novas, CEP 75690-000, Brazil','Caldas Novas ',NULL,'2026-01-17','2026-01-19','6202049366',857.00,1714.00,'BRL','','2025-11-28 01:34:24.741','2025-11-28 01:34:24.741'),(3,'Apartamento Le Jardin','Rua Machado de Assis, 555 - Bairro Bandeirantes - Caldas Novas, Caldas Novas, CEP 75690-000, Brazil','Caldas Novas',NULL,'2026-01-19','2026-01-20','6614473486',849.00,849.00,'BRL','','2025-11-28 01:36:07.699','2025-11-28 01:36:07.699'),(4,'Mercure Plaza Shopping','Rua da Bandeira, 400, Uberlândia, CEP 38405-174, Brazil','Uberlândia',NULL,'2026-01-09','2026-01-11','5064598219',552.00,1104.00,'BRL','Pin: 7194','2025-11-28 01:39:41.623','2025-11-28 01:39:41.623');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_subscriptions`
--

DROP TABLE IF EXISTS `push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `endpoint` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p256dh` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `auth` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `push_subscriptions_endpoint_key` (`endpoint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_subscriptions`
--

LOCK TABLES `push_subscriptions` WRITE;
/*!40000 ALTER TABLE `push_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `regions_name_key` (`name`),
  UNIQUE KEY `regions_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (1,'São Paulo','sao-paulo','#FBBF24','2025-11-27 20:17:51.352'),(2,'Goiás','goias','#1E40AF','2025-11-27 20:17:51.352'),(3,'Minas Gerais','minas-gerais','#166534','2025-11-27 20:17:51.352'),(4,'Santa Catarina','santa-catarina','#F97316','2025-11-27 20:17:51.352');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 18:37:21
