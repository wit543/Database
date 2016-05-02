-- MySQL dump 10.13  Distrib 5.7.12, for Linux (x86_64)
--
-- Host: localhost    Database: web
-- ------------------------------------------------------
-- Server version	5.7.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chapter`
--

DROP TABLE IF EXISTS `chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapter` (
  `chapter_id` int(11) NOT NULL,
  `chapter_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter`
--

LOCK TABLES `chapter` WRITE;
/*!40000 ALTER TABLE `chapter` DISABLE KEYS */;
INSERT INTO `chapter` VALUES (1,'SELECT basic'),(2,'SELECT intermediate'),(3,'ADVANCE'),(4,'coming soon™'),(5,'coming soon™'),(6,'coming soon™'),(7,'coming soon™'),(8,'coming soon™');
/*!40000 ALTER TABLE `chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grading_list`
--

DROP TABLE IF EXISTS `grading_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grading_list` (
  `username` varchar(20) NOT NULL,
  `problem_id` int(50) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_input` varchar(500) DEFAULT NULL,
  `correctness` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`username`,`problem_id`,`time`),
  KEY `fk_user_has_problems_problems1_idx` (`problem_id`),
  KEY `fk_user_has_problems_user1_idx` (`username`),
  CONSTRAINT `fk_user_has_problems_problems1` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_problems_user1` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grading_list`
--

LOCK TABLES `grading_list` WRITE;
/*!40000 ALTER TABLE `grading_list` DISABLE KEYS */;
INSERT INTO `grading_list` VALUES ('wit',1,'2016-04-30 22:21:51','select * from course',1),('wit',1,'2016-05-01 13:25:17','select * from course',1),('wit',1,'2016-05-01 13:34:59','select * from course',1),('wit',1,'2016-05-01 13:37:51','select * from course',1),('wit',1,'2016-05-01 13:38:39','select * from course',1),('wit',2,'2016-05-01 13:39:29','select ID,name from instructor',0),('wit',2,'2016-05-01 13:39:35','select ID,name from instructor',0),('wit',2,'2016-05-01 13:40:09','select ID,name from instructor',0),('wit',2,'2016-05-01 13:42:07','select ID,name from instructor',1);
/*!40000 ALTER TABLE `grading_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `problems`
--

DROP TABLE IF EXISTS `problems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `problems` (
  `problem_id` int(50) NOT NULL AUTO_INCREMENT,
  `problem` varchar(500) DEFAULT NULL,
  `solution` varchar(500) DEFAULT NULL,
  `header` varchar(50) DEFAULT NULL,
  `chapter_id` int(11) NOT NULL,
  PRIMARY KEY (`problem_id`),
  KEY `fk_problems_chapter1_idx` (`chapter_id`),
  CONSTRAINT `fk_problems_chapter1` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`chapter_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `problems`
--

LOCK TABLES `problems` WRITE;
/*!40000 ALTER TABLE `problems` DISABLE KEYS */;
INSERT INTO `problems` VALUES (1,'Show all data from table \"course\"','SELECT * FROM course','C1 Task 1',1),(2,'Show a table of “ID” and “name” from instructor','SELECT ID,name FROM instructor','C1 Task 2',1),(3,'Show all the data from instructor that name start with “E”','SELECT * FROM instructor  WHERE name LIKE ‘E%’','C1 Task 3',1),(4,'Show ID,name, and salary of every instructor that have salary more than salary of \"Gold\"','SELECT ID,name,salary FROM instructor  WHERE salary >      (SELECT salary FROM instructor       WHERE name=\'Gold\')','C2 Task 1',2),(5,'List the Bio course using like','SELECT * FROM course WHERE course_id LIKE \'BIO%\'','use Like',2),(6,'List the Bio Give the set of all courses taught in the Fall 2009 semestercourse using like','select course_id from section where semester = \"Fall\" and year= 2009','simple checking',2),(7,'Count number of course','select count (*) from course','counting',2),(8,'Find the average salary of instructor','select avg (salary) from instructor','average',2),(9,'\"Find the avaerage salary of each department (column: dept_name	avg_salary)\"','select dept_name, avg (salary) as avg_salary from instructor group by dept_name having avg (salary) > 42000','advance 1',3),(10,'Find all the courses taught in the both the Fall 2009 and Spring 2010 semesters.”','select distinct course_id  from section  where semester = \"Fall\" and year= 2009 and  course_id in (select course_id  from section  where semester = \"Spring\" and year= 2010)','advance 2',3),(11,'Find the total number of (distinct) students who have taken course sections taught by the instructor with ID 110011','select count (distinct ID) from takes  where (course_id, sec_id, semester, year) in (select course_id, sec_id, semester, year  from teaches  where teaches.ID= 10101)','advance 3',3),(12,'Find all courses taught in both the Fall 2009 semester and in the Spring 2010 semester','select course_id  from section as S  where semester = \"Fall\" and year= 2009 and  exists (select *  from section as T  where semester = \"Spring\" and year= 2010 and  S.course_id= T.course_id)','advance 4',3),(13,'\"List of all course sections offered by the Physics department in the Fall 2009 semester,with the building and room number of each section\"','select course.course_id, sec_id, building, room_number  from course, section  where course.course_id = section.course_id  and course.dept_name = \"Physics\"  and section.semester = \"Fall\"  and section.year = \"2009\"','advance 5',3),(14,'Find all students who have not taken a course','select ID  from student natural left outer join takes  where course_id is null','null',2);
/*!40000 ALTER TABLE `problems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('asd','$2a$10$Mx1GyKHpknPLx7ET8IdN8OHHgMQBWh.2C5XIXD4KpOy9urLsQmTtG'),('gafig','$2a$10$I5746lKLeIpjK3QxUdf6JepsEatLgKluBHw6myLB8nBVgd4oowTFq'),('prin','$2a$10$N2O7oi9STBfx8FTFvmANceO64DWlIY7adrry77deUsHKYOeuvDJOC'),('wit','$2a$10$DcWb0ztiV8Zq4KsS8dX4nOKLeUgCfKrrwAgi6J1/4B2nPkMDdG.Km'),('wit1','$2a$10$HepvLY12Hrg9ddcXdwnOquWoll6TMLg8gm3nT31Fe4JMLmzT9h9Jm'),('wits','$2a$10$WVhqbu0oKPO6JNvmXPUSh.L51GpGSOlnIyhOSLmBfJpiF17n7XS.W'),('witsad','$2a$10$4WLQPKyGO4v3tHOSOATNTOTwh0KLN3Q48PxZDBlfVZwg7adp3Pb2.');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-02  7:56:06
