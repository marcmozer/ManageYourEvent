-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: host1
-- Erstellungszeit: 08. Apr 2022 um 08:56
-- Server-Version: 10.7.3-MariaDB-1:10.7.3+maria~focal-log
-- PHP-Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `exampledb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE `event` (
  `eventid` int(11) NOT NULL,
  `titel` varchar(40) NOT NULL,
  `beschreibung` text NOT NULL,
  `adminid` int(11) NOT NULL DEFAULT 0,
  `geplantes_datum` date NOT NULL,
  `teilnehmer_anzahl` int(11) NOT NULL,
  `geplante_uhrzeit` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`eventid`, `titel`, `beschreibung`, `adminid`, `geplantes_datum`, `teilnehmer_anzahl`, `geplante_uhrzeit`) VALUES
(1, 'Geburtstag', 'Ich feiere meinen 20. Geburtstag im großen Rahmen.', 1, '2022-08-01', 50, '18:00:00'),
(2, 'Spontanes Treffen', 'wer hat Lust sich spontan zu einem Grillabend zu treffen?', 2, '2022-05-05', 8, '00:00:00'),
(3, 'Weiterbildung', 'Ich biete ein Seminar zum Thema \"Programmieren mit JS\" an', 1, '2022-06-02', 25, '18:00:00'),
(4, 'Nachholtermin ', 'Aufgrund früherer Krankheit wird der Termin nun nachgeholt.', 2, '2022-03-02', 13, '18:30:40'),
(5, 'Geschäftsessen', 'Wir treffen uns im Peter Pane in Stuttgart.', 3, '2022-05-27', 15, '17:00:00'),
(6, 'Geschäftsausflug', 'Ich plane einen Ausflug mit meinen Kollegen ins Disneyland.', 2, '2022-05-21', 6, '10:00:00'),
(7, 'Wanderausflug', 'Geplant ist eine Rundwanderung im Schwarzwald.', 3, '2022-06-14', 7, '11:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `eventzusage`
--

CREATE TABLE `eventzusage` (
  `ezid` int(11) NOT NULL,
  `userid` int(11) NOT NULL DEFAULT 0,
  `eventid` int(11) NOT NULL DEFAULT 0,
  `kommentar` text NOT NULL,
  `zusage` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `eventzusage`
--

INSERT INTO `eventzusage` (`ezid`, `userid`, `eventid`, `kommentar`, `zusage`) VALUES
(1, 1, 1, 'Eventersteller', 1),
(3, 1, 3, 'Eventersteller', 1),
(4, 1, 2, 'ich freue mich drauf', 1),
(5, 2, 2, 'unter Vorbehalt', 1),
(6, 3, 7, 'Eventersteller', 1),
(7, 3, 2, 'ich komme etwas später', 1),
(8, 3, 5, 'Eventersteller', 1),
(9, 2, 4, 'Eventersteller', 1),
(10, 2, 2, 'Eventersteller', 1),
(11, 2, 6, 'Eventersteller', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `userid` int(11) NOT NULL,
  `vname` varchar(20) NOT NULL,
  `nname` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `reg_datum` date NOT NULL DEFAULT current_timestamp(),
  `passwort` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`userid`, `vname`, `nname`, `email`, `reg_datum`, `passwort`) VALUES
(1, 'marc', 'mozer', 'marc.mozer@mail.de', '2022-04-08', '$2b$10$eNl3Qmby6iXbtkC4ewop4.9sbTAAgK5Ntt70xfz.0VDEefxE9Vkb.'),
(2, 'hannah', 'hirth', 'hannah.hirth@mail.de', '2022-04-08', '$2b$10$uP50kVPxJvL1J.Rz4IoKm.rkSuFE8r/Yq9IH8x/XHAxh.QuAOlNwa'),
(3, 'joeline', 'dobler', 'joeline.dobler@mail.de', '2022-04-08', '$2b$10$1Jrh/kBOywhcWsN.zrzTzOEk/I/NCFZZL8ftixFka1/UbunKUT2ny');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`eventid`),
  ADD KEY `userid` (`adminid`);

--
-- Indizes für die Tabelle `eventzusage`
--
ALTER TABLE `eventzusage`
  ADD PRIMARY KEY (`ezid`),
  ADD KEY `userid` (`userid`),
  ADD KEY `eventid` (`eventid`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userid`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `event`
--
ALTER TABLE `event`
  MODIFY `eventid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `eventzusage`
--
ALTER TABLE `eventzusage`
  MODIFY `ezid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


/*INSERT DATABASEDUMP ABOVE!!!!!!! */

/* SLEEP Slave
  Host2 waits until Host1 is ready*/
SELECT SLEEP(10);

CHANGE MASTER TO
  MASTER_HOST='host1',
  MASTER_USER='root',
  MASTER_PASSWORD='root',
  MASTER_PORT=3306,
  MASTER_LOG_FILE='master1-bin.000002',
  MASTER_CONNECT_RETRY=10;

START SLAVE;