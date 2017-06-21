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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `danhmuc`
--

LOCK TABLES `danhmuc` WRITE;
/*!40000 ALTER TABLE `danhmuc` DISABLE KEYS */;
INSERT INTO `danhmuc` VALUES (1,'Sách'),(2,'Điện thoại'),(3,'Máy chụp hình'),(4,'Quần áo - Giày dép'),(5,'Máy tính'),(6,'Đồ trang sức'),(7,'Khác');
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
  `giahientai` int(11) DEFAULT NULL,
  `giamuangay` int(11) DEFAULT NULL,
  `tgbatdau` datetime NOT NULL,
  `tgketthuc` datetime NOT NULL,
  `trangthai` bit(1) NOT NULL,
  `thongtin` text CHARACTER SET utf8 COLLATE utf8_vietnamese_ci,
  `manguoiban` int(11) NOT NULL,
  `solandaugia` int(11) DEFAULT '0',
  `danhmuc` int(11) DEFAULT NULL,
  `mota` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`madaugia`),
  KEY `NguoiBan_idx` (`manguoiban`),
  KEY `danhmuc_idx` (`danhmuc`),
  CONSTRAINT `NguoiBan` FOREIGN KEY (`manguoiban`) REFERENCES `taikhoan` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `danhmuc` FOREIGN KEY (`danhmuc`) REFERENCES `danhmuc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (1,'Freshwater Cultured Pearl',1500000,NULL,'2017-06-20 09:00:00','2017-06-25 09:01:00','','<UL>\n     <LI>Metal stamp: 14k </LI>\n     <LI>Metal: yellow-ld</LI>\n     <LI>Material Type: amethyst, citrine, ld, pearl, peridot</LI>\n     <LI>Gem Type: citrine, peridot, amethyst</LI>\n     <LI>Length: 7.5 inches</LI>\n     <LI>Clasp Type: filigree-box</LI>\n     <LI>Total metal weight: 0.6 Grams</LI>\n </UL>\n <STRONG>Pearl Information</STRONG><BR>\n <UL>\n     <LI>Pearl type: freshwater-cultured</LI>\n </UL>\n <STRONG>Packaging Information</STRONG><BR>\n <UL>\n     <LI>Package: Regal Blue Sueded-Cloth Pouch</LI>\n </UL>',1,10,6,'Freshwater Cultured Pearl, Citrine, Peridot & Amethyst Bracelet, 7.5\"'),(2,'Pink Sapphire Sterling Silver',300000,NULL,'2017-06-20 09:00:00','2017-06-25 09:00:00','','<P><STRONG>Jewelry Information</STRONG></P>\r\n<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n</UL>\r\n',1,0,6,'14 1/2 Carat Created Pink Sapphire Sterling Silver Bracelet w/ Diamond Accents'),(3,'Torrini KC241',1600000000,NULL,'2017-06-20 09:00:00','2017-06-27 09:00:00','','<P>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế. Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được.</P>\r\n<UL>\r\n    <LI>Kiểu sản phẩm: Nhẫn nữ</LI>\r\n    <LI>Loại đá: To paz</LI>\r\n    <LI>Chất liệu: kim cương, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Đơn giá: 2,110,250 VND / Chiếc</LI>\r\n</UL>\r\n',1,0,6,'Nhẫn kim cương - vẻ đẹp kiêu sa'),(4,'Torrini KC242',42000000,NULL,'2017-06-20 09:00:00','2017-06-29 09:00:00','','<P>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.<BR>\r\nVới sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị.</P>\r\n<UL>\r\n    <LI>Kiểu sản phẩm: Nhẫn nam</LI>\r\n    <LI>Loại đá: To paz</LI>\r\n    <LI>Chất liệu: Vàng tây 24K, nguyên liệu và công nghệ Italy...</LI>\r\n</UL>\r\n',1,0,6,'tinh xảo và sang trọng'),(5,'Nokia 7610',2900000,NULL,'2017-06-20 09:00:00','2017-06-28 09:00:00','','<UL>\r\n    <LI>Máy ảnh có độ phân giải 1 megapixel</LI>\r\n    <LI>Màn hình 65.536 màu, rộng 2,1 inch, 176 X 208 pixel với đồ họa sắc nét, độ phân giải cao</LI>\r\n    <LI>Quay phim video lên đến 10 phút với hình ảnh sắc nét hơn</LI>\r\n    <LI>Kinh nghiệm đa phương tiện được tăng cường</LI>\r\n    <LI>Streaming video &amp; âm thanh với RealOne Player (hỗ trợ các dạng thức MP3/AAC).</LI>\r\n    <LI>Nâng cấp cho những đoạn phim cá nhân của bạn bằng các tính năng chỉnh sửa tự động thông minh</LI>\r\n    <LI>In ảnh chất lượng cao từ nhà, văn phòng, kios và qua mạng</LI>\r\n    <LI>Dễ dàng kết nối vớI máy PC để lưu trữ và chia sẻ (bằng cáp USB, PopPort, công nghệ Bluetooth)</LI>\r\n    <LI>48 nhạc chuông đa âm sắc, True tones. Mạng GSM 900 / GSM 1800 / GSM 1900</LI>\r\n    <LI>Kích thước 109 x 53 x 19 mm, 93 cc</LI>\r\n    <LI>Trọng lượng 118 g</LI>\r\n    <LI>Hiển thị: Loại TFT, 65.536 màu</LI>\r\n    <LI>Kích cở: 176 x 208 pixels </LI>\r\n</UL>\r\n',1,0,2,'Độ phân giải cao, màn hình màu, chụp ảnh xuất sắc.'),(6,'Áo thun nữ',180000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n',1,0,4,'Màu sắc tươi tắn, kiểu dáng trẻ trung'),(7,'Simen AP75',2800000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Hình ảnh hoàn hảo, rõ nét ở mọi góc màn hình</LI>\r\n    <LI>Giảm thiểu sự phản chiếu ánh sáng</LI>\r\n    <LI>Menu hiển thị tiếng Việt</LI>\r\n    <LI>Hệ thống hình ảnh thông minh</LI>\r\n    <LI>Âm thanh Hifi Stereo mạnh mẽ</LI>\r\n    <LI>Hệ thống âm lượng thông minh</LI>\r\n    <LI>Bộ nhớ 100 chương trình</LI>\r\n    <LI>Chọn kênh ưa thích</LI>\r\n    <LI>Các kiểu sắp đặt sẵn hình ảnh / âm thanh</LI>\r\n    <LI>Kích thước (rộng x cao x dày): 497 x 458 x 487mm</LI>\r\n    <LI>Trọng lượng: 25kg</LI>\r\n    <LI>Màu: vàng, xanh, bạc </LI>\r\n</UL>\r\n',1,0,2,'Thiết kế tinh xảo, hiện đại'),(8,'Áo bé trai',270000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Quần áo bé trai</LI>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n',1,0,4,'Hóm hỉnh dễ thương'),(9,'Bông tai nạm hạt rubby',2400000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Tên sản phẩm: Bông tai nạm hạt rubby</LI>\r\n    <LI>Đóng nhãn hiệu: Torrini</LI>\r\n    <LI>Nguồn gốc, xuất xứ: Italy</LI>\r\n    <LI>Hình thức thanh toán: L/C T/T M/T CASH</LI>\r\n    <LI>Thời gian giao hàng: trong vòng 3 ngày kể từ ngày mua</LI>\r\n    <LI>Chất lượng/chứng chỉ: od</LI>\r\n</UL>\r\n',1,0,6,'Trẻ trung và quý phái'),(10,'Đầm dạ hội ánh kim',2800000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Màu sắc: Khuynh hướng ánh kim có thể thể hiện trên vàng, bạc, đỏ tía, xanh biển, vàng tím, trắng và đen.</LI>\r\n    <LI>Một số biến tấu mang tính vui nhộn là vàng chanh, màu hoa vân anh và ngọc lam; trong đó hoàng kim và nhũ bạc khá phổ biến.</LI>\r\n    <LI>Phong cách: Diềm đăng ten, rủ xuống theo chiều thẳng đứng, nhiều lớp, cổ chẻ sâu, eo chít cao tới ngực... được biến tấu tùy theo mỗi nhà thiết kế.</LI>\r\n</UL>\r\n',1,0,4,'Đủ màu sắc - kiểu dáng'),(11,'Dây chuyền ánh bạc',250000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Chất liệu chính: Bạc</LI>\r\n    <LI>Màu sắc: Bạc</LI>\r\n    <LI>Chất lượng: Mới</LI>\r\n    <LI>Phí vận chuyển: Liên hệ</LI>\r\n    <LI>Giá bán có thể thay đổi tùy theo trọng lượng và giá vàng của từng thời điểm.</LI>\r\n</UL>\r\n',1,0,6,'Kiểu dáng mới lạ'),(12,'Đồ bộ bé gái',120000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Màu sắc: đỏ tía, xanh biển, vàng tím, trắng và đen.</LI>\r\n    <LI>Xuất xứ: Tp. Hồ Chí Minh</LI>\r\n    <LI>Chất liệu: cotton</LI>\r\n    <LI>Loại hàng: hàng trong nước</LI>\r\n</UL>\r\n',1,0,4,'Đủ màu sắc - kiểu dáng'),(13,'Đầm dạ hội Xinh Xinh',2600000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<P>Những đường cong tuyệt đẹp sẽ càng được phô bày khi diện các thiết kế này.</P>\r\n<UL>\r\n    <LI>Nét cắt táo bạo ở ngực giúp bạn gái thêm phần quyến rũ, ngay cả khi không có trang&nbsp; sức nào trên người.</LI>\r\n    <LI>Đầm hai dây thật điệu đà với nơ xinh trước ngực nhưng trông bạn vẫn toát lên vẻ tinh nghịch và bụi bặm nhờ thiết kế đầm bí độc đáo cùng sắc màu sẫm.</LI>\r\n    <LI>Hãng sản xuất: NEM</LI>\r\n    <LI>Kích cỡ : Tất cả các kích cỡ</LI>\r\n    <LI>Kiểu dáng : Quây/Ống</LI>\r\n    <LI>Chất liệu : Satin</LI>\r\n    <LI>Màu : đen, đỏ</LI>\r\n    <LI>Xuất xứ : Việt Nam</LI>\r\n</UL>\r\n',1,0,4,'Đơn giản nhưng quý phái'),(14,'Đầm dạ hội NEM',1200000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<P>Những đường cong tuyệt đẹp sẽ càng được phô bày khi diện các thiết kế này.</P>\r\n<UL>\r\n    <LI>Nét cắt táo bạo ở ngực giúp bạn gái thêm phần quyến rũ, ngay cả khi không có trang&nbsp; sức nào trên người.</LI>\r\n    <LI>Đầm hai dây thật điệu đà với nơ xinh trước ngực nhưng trông bạn vẫn toát lên vẻ tinh nghịch và bụi bặm nhờ thiết kế đầm bí độc đáo cùng sắc màu sẫm.</LI>\r\n    <LI>Hãng sản xuất: NEM</LI>\r\n    <LI>Kích cỡ : Tất cả các kích cỡ</LI>\r\n    <LI>Kiểu dáng : Quây/Ống</LI>\r\n    <LI>Chất liệu : Satin</LI>\r\n    <LI>Màu : đen, đỏ</LI>\r\n    <LI>Xuất xứ : Việt Nam</LI>\r\n</UL>\r\n',1,0,4,'Táo bạo và quyến rũ'),(15,'Dây chuyền đá quý',1925000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Kiểu sản phẩm: Dây chuyền</LI>\r\n    <LI>Chất liệu: Vàng trắng 14K và đá quý, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 1.1 Chỉ </LI>\r\n</UL>\r\n',1,0,6,'Kết hợp vàng trắng và đá quý'),(16,'Nokia N72',3200000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Camera mega pixel : 2 mega pixel</LI>\r\n    <LI>Bộ nhớ trong : 16 - 31 mb</LI>\r\n    <LI>Chức năng : quay phim, ghi âm, nghe đài FM</LI>\r\n    <LI>Hỗ trợ: Bluetooth, thẻ nhớ nài, nhạc MP3 &lt;br/&gt;</LI>\r\n    <LI>Trọng lượng (g) : 124g</LI>\r\n    <LI>Kích thước (mm) : 109 x 53 x 21.8 mm</LI>\r\n    <LI>Ngôn ngữ : Có tiếng việt</LI>\r\n    <LI>Hệ điều hành: Symbian OS 8.1</LI>\r\n</UL>\r\n',1,0,2,'Sành điệu cùng N72'),(17,'Mặt dây chuyền Ruby',1820000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Kiểu sản phẩm:&nbsp; Mặt dây</LI>\r\n    <LI>Chất liệu: Vàng trắng 14K, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 0.32 Chỉ</LI>\r\n</UL>\r\n',1,0,6,'Toả sáng cùng Ruby'),(18,'1/2 Carat Pink Sapphire Silver',3400000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Brand Name: Ice.com</LI>\r\n    <LI>Material Type: sterling-silver, created-sapphire, diamond</LI>\r\n    <LI>Gem Type: created-sapphire, Diamond</LI>\r\n    <LI>Minimum total gem weight: 14.47 carats</LI>\r\n    <LI>Total metal weight: 15 Grams</LI>\r\n    <LI>Number of stones: 28</LI>\r\n    <LI>Created-sapphire Information</LI>\r\n    <LI>Minimum color: Not Available</LI>\r\n</UL>\r\n',1,0,6,'Created Pink Sapphire'),(19,'Netaya',1820000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Kiểu sản phẩm:&nbsp; Dây chuyền</LI>\r\n    <LI>Chất liệu: Vàng tây 18K, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 1 Chỉ</LI>\r\n</UL>\r\n',1,0,6,'Dây chuyền vàng trắng'),(20,'Giày nam GN16',540000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n    <LI>Giá: 300 000 VNĐ</LI>\r\n</UL>\r\n',1,0,4,'Êm - đẹp - bề'),(21,'G3.370A',300000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n',1,0,4,'Đen bóng, sang trọng'),(22,'Giày nữ GN1',290000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n',1,0,4,'Kiểu dáng thanh thoát'),(23,'NV002',3600000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<P><STRONG>Thông tin sản phẩm</STRONG></P>\r\n<UL>\r\n    <LI>Mã sản phẩm: NV002</LI>\r\n    <LI>Trọng lượng: 2 chỉ</LI>\r\n    <LI>Vật liệu chính: Vàng 24K</LI>\r\n</UL>\r\n',1,0,6,'Kiểu dáng độc đáo'),(24,'NV009',14900000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<P><STRONG>Thông tin sản phẩm</STRONG></P>\r\n<UL>\r\n    <LI>Mã sản phẩm: NV005</LI>\r\n    <LI>Trọng lượng: 1 cây</LI>\r\n    <LI>Vật liệu chính: Vàng 24K</LI>\r\n</UL>\r\n',1,0,6,'Sáng chói - mới lạ'),(25,'CK010',2147483647,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Kiểu dáng nam tính và độc đáo, những thiết kế dưới đây đáp ứng được mọi yêu cần khó tính nhất của người sở hữu.</LI>\r\n    <LI>Những hạt kim cương sẽ giúp người đeo nó tăng thêm phần sành điệu</LI>\r\n    <LI>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế.</LI>\r\n    <LI>Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được</LI>\r\n</UL>\r\n',1,0,6,'Độc đáo, sang trọng'),(26,'CK009',1850000000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.</LI>\r\n    <LI>Với sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị</LI>\r\n    <LI>Nhà sản xuất: Torrini</LI>\r\n</UL>\r\n<P>Cái này rất phù hợp cho bạn khi tặng nàng</P>\r\n',1,0,6,'Nữ tính - đầy quí phái'),(27,'CK007',2147483647,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.</LI>\r\n    <LI>Với sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị</LI>\r\n    <LI>Nhà sản xuất: Torrini</LI>\r\n</UL>\r\n<P>Cái này rất phù hợp cho bạn khi tặng nàng</P>\r\n',1,0,6,'Sự kết hợp khéo léo, độc đáo'),(28,'CK005',1800000000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Kim cương luôn là đồ trang sức thể hiện đẳng cấp của người sử dụng.</LI>\r\n    <LI>Không phải nói nhiều về những kiểu nhẫn dưới đây, chỉ có thể gói gọn trong cụm từ: tinh xảo và sang trọng</LI>\r\n    <LI>Thông tin nhà sản xuất: Torrini</LI>\r\n    <LI>Thông tin chi tiết: Cái này rất phù hợp cho bạn khi tặng nàng</LI>\r\n</UL>\r\n',1,0,6,'Tinh xảo - sang trọng'),(29,'NV01TT',500000000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>Tinh xảo và sang trọng</LI>\r\n    <LI>Thông tin nhà sản xuất: Torrini</LI>\r\n    <LI>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế.</LI>\r\n    <LI>Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được</LI>\r\n</UL>\r\n',1,0,6,'Tinh tế đến không ngờ'),(30,'Motorola W377',2400000,NULL,'2017-06-20 09:00:00','2017-06-30 09:00:00','','<UL>\r\n    <LI>General: 2G Network, GSM 900 / 1800 / 1900</LI>\r\n    <LI>Size:&nbsp; 99 x 45 x 18.6 mm, 73 cc</LI>\r\n    <LI>Weight: 95 g</LI>\r\n    <LI>Display: type TFT, 65K colors</LI>\r\n    <LI>Size: 128 x 160 pixels, 28 x 35 mm</LI>\r\n</UL>\r\n',1,0,2,'Nữ tính - trẻ trung');
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
-- Table structure for table `xinduocban`
--

DROP TABLE IF EXISTS `xinduocban`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `xinduocban` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nguoixin` int(11) NOT NULL,
  `thoigianxin` datetime NOT NULL,
  `thoigianhet` datetime NOT NULL,
  `trangthai` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xinduocban`
--

LOCK TABLES `xinduocban` WRITE;
/*!40000 ALTER TABLE `xinduocban` DISABLE KEYS */;
/*!40000 ALTER TABLE `xinduocban` ENABLE KEYS */;
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

-- Dump completed on 2017-06-21 17:24:23
