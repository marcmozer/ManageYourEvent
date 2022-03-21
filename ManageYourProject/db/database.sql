-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: meinecooledb
-- Erstellungszeit: 21. Mrz 2022 um 16:06
-- Server-Version: 10.7.3-MariaDB-1:10.7.3+maria~focal
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
  `geplantes_datum` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`eventid`, `titel`, `beschreibung`, `adminid`, `geplantes_datum`) VALUES
(1, 'Test-Event', 'Dieses Event soll zur Absprache unter allen Interessierten dienen.', 1, '2022-03-18');

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
(1, 1, 1, 'Ich nehme gerne daran teil', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `login`
--

CREATE TABLE `login` (
  `loginid` int(11) NOT NULL,
  `userid` int(11) NOT NULL DEFAULT 0,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `table1`
--

CREATE TABLE `table1` (
  `task_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `table1`
--

INSERT INTO `table1` (`task_id`, `title`, `description`, `created_at`) VALUES
(1, 'Super titel', 'langer text', '2020-04-09 12:18:07'),
(2, 'Anderer Titel', 'Super Text', '2020-04-09 12:18:43'),
(3, 'Anderer Titel2', 'noch mehr text', '2020-04-09 12:18:57');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `userid` int(11) NOT NULL,
  `vname` varchar(20) NOT NULL,
  `nname` varchar(20) NOT NULL,
  `email` text NOT NULL,
  `reg_datum` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`userid`, `vname`, `nname`, `email`, `reg_datum`) VALUES
(1, 'testname', 'testnachname', 'testperson@test.de', '2022-03-16');

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
-- Indizes für die Tabelle `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`loginid`),
  ADD KEY `userid` (`userid`);

--
-- Indizes für die Tabelle `table1`
--
ALTER TABLE `table1`
  ADD PRIMARY KEY (`task_id`);

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
  MODIFY `eventid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `eventzusage`
--
ALTER TABLE `eventzusage`
  MODIFY `ezid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `login`
--
ALTER TABLE `login`
  MODIFY `loginid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `table1`
--
ALTER TABLE `table1`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
