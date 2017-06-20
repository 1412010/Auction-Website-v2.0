CREATE DATABASE  IF NOT EXISTS `qldaugia` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `qldaugia`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win32 (AMD64)
--
-- Host: localhost    Database: qldaugia
-- ------------------------------------------------------
-- Server version	5.7.17-log

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
-- Table structure for table `danhmuc`
--

DROP TABLE IF EXISTS `danhmuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `danhmuc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tendanhmuc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES (1,'Sách'),(2,'Điện thoại');
/*!40000 ALTER TABLE `danhmuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ketquadaugia`
--

DROP TABLE IF EXISTS `ketquadaugia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ketquadaugia` (
  `sanpham` int(11) NOT NULL,
  `nguoiban` int(11) NOT NULL,
  `nguoimua` int(11) NOT NULL,
  `giaban` int(11) DEFAULT NULL,
  `nhanxet` varchar(1000) DEFAULT NULL,
  `ketquadaugiacol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`sanpham`,`nguoiban`,`nguoimua`),
  KEY `nguoimua_idx` (`nguoimua`),
  KEY `nguoiban_idx` (`nguoiban`),
  CONSTRAINT `nguoiban_kq` FOREIGN KEY (`nguoiban`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `nguoimua` FOREIGN KEY (`nguoimua`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sanphamdaugia` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`madaugia`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ketquadaugia`
--

LOCK TABLES `ketquadaugia` WRITE;
/*!40000 ALTER TABLE `ketquadaugia` DISABLE KEYS */;
/*!40000 ALTER TABLE `ketquadaugia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sanpham` (
  `madaugia` int(11) NOT NULL AUTO_INCREMENT,
  `tensp` varchar(200) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `soluong` int(11) NOT NULL,
  `giahientai` int(11) DEFAULT NULL,
  `giamuangay` int(11) DEFAULT NULL,
  `tgbatdau` datetime NOT NULL,
  `tgketthuc` datetime NOT NULL,
  `trangthai` bit(1) NOT NULL,
  `thongtin` varchar(1000) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `manguoiban` int(11) NOT NULL,
  `solandaugia` int(11) DEFAULT '0',
  `danhmuc` int(11) DEFAULT NULL,
  PRIMARY KEY (`madaugia`),
  KEY `NguoiBan_idx` (`manguoiban`),
  KEY `danhmuc_idx` (`danhmuc`),
  CONSTRAINT `NguoiBan` FOREIGN KEY (`manguoiban`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `danhmuc` FOREIGN KEY (`danhmuc`) REFERENCES `danhmuc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taikhoan` (
  `email` varchar(254) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `matkhau` varchar(100) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `ten` varchar(100) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `ngaysinh` date NOT NULL,
  `gioitinh` bit(1) NOT NULL,
  `diemcong` int(11) DEFAULT '0',
  `diemtru` int(11) DEFAULT '0',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quyenhan` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES ('syaorer@gmail.com','1bbd886460827015e5d605ed44252251','test','2017-06-20','',0,0,1,0);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `theodoi`
--

DROP TABLE IF EXISTS `theodoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `theodoi` (
  `nguoitheodoi` int(11) NOT NULL,
  `sanpham` int(11) NOT NULL,
  PRIMARY KEY (`nguoitheodoi`,`sanpham`),
  KEY `sanpham_idx` (`sanpham`),
  KEY `sanphamtheodoi_idx` (`sanpham`),
  CONSTRAINT `nguoitheodoi` FOREIGN KEY (`nguoitheodoi`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sanphamtheodoi` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`madaugia`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theodoi`
--

LOCK TABLES `theodoi` WRITE;
/*!40000 ALTER TABLE `theodoi` DISABLE KEYS */;
/*!40000 ALTER TABLE `theodoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tragia`
--

DROP TABLE IF EXISTS `tragia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tragia` (
  `nguoitragia` int(11) NOT NULL,
  `sanpham` int(11) NOT NULL,
  `gia` int(11) NOT NULL,
  `daugia` bit(1) NOT NULL,
  PRIMARY KEY (`nguoitragia`,`sanpham`),
  KEY `sanpham_idx` (`sanpham`),
  CONSTRAINT `nguoidaugia` FOREIGN KEY (`nguoitragia`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sanphamtragia` FOREIGN KEY (`sanpham`) REFERENCES `sanpham` (`madaugia`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tragia`
--

LOCK TABLES `tragia` WRITE;
/*!40000 ALTER TABLE `tragia` DISABLE KEYS */;
/*!40000 ALTER TABLE `tragia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'qldaugia'
--

--
-- Dumping routines for database 'qldaugia'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-20 18:02:15
