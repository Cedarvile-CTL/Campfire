
-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
`personID` int(11) NOT NULL,
  `accessLevelID` int(11) NOT NULL DEFAULT '1',
PRIMARY KEY(`personID`)
) ENGINE=MyISAM;


-- --------------------------------------------------------

--
-- Table structure for table `Access_Level`
--

CREATE TABLE `Access_Level` (
  `accessLevelID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `order` int(11) NOT NULL DEFAULT '1',
PRIMARY KEY(`accessLevelID`)
) ENGINE=MyISAM;