/*
Navicat MySQL Data Transfer

Source Server         : mb
Source Server Version : 50644
Source Host           : localhost:3306
Source Database       : load

Target Server Type    : MYSQL
Target Server Version : 50644
File Encoding         : 65001

Date: 2020-07-24 15:44:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `username` varchar(20) NOT NULL,
  `nickname` varchar(8) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
