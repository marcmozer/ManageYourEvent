# Client - (Web-)Server Extended mit einer Datenbank in Node.js

## Allgemein

In diesem Beispiel werden ein Node.js Webserver (mittels Express) gestartet und Zugriffspunkte (Pfäde) definiert. Darüber hinaus werden zwei 'mariaDB'-Datenbankcontainer angelegt, welche vom Webserver verwendet werden. Die Zugriffe auf den Server werden durch den Load Balancer nginx gesteuert.

### Datenbanken

Die Datenbankinitialisierung findet **nur** statt, wenn der Container das erste Mal gestartet wird, sprich, wenn man das erste Mal `docker-compose up --build` ausführt. Bei jedem weiteren Start mittels `docker-compose up --build` werden die vorhandenen Daten genommen und es wird das Backup `database.sql` **nicht** eingespielt.

Konkret bedeutet das, dass beim ersten Start der Datenbank dies etwas länger dauert, bei jedem weiteren Start geht es deutlich schneller. Wenn man möchte, dass die Datenbank komplett gelöscht wird, dann muss man die Container alle löschen mittels `docker-compose down`. Beim nächsten Start mit `docker-compose up --build` wird dann die Datenbank neu erstellt.

In diesem Programm wurden 2 Datenbanken von MariaDB nach dem Master Slave Prinzip eingesetzt.
Master-Datenbank host1: `http://localhost:8085/` (Nutzer:root; PW:root)
Slave-Datenbank host2: `http://localhost:8086/` (Nutzer:root; PW:root)

### Server

Bitte öffne nach dem Start folgende URL: `http://localhost:8080/`

Danach wird man automatisch auf die `startseite.html` geleitet und aufgefordert sich anzumelden.

### PhpMyAdmin

Im `docker-compose.yaml` werden auch zwei `phpMyAdmin`-Container gestartet, die als Hilfestellung zum Erstellen, Testen sowie Debuggen der Datenbank dienen. Diese können über:

`http://localhost:8085/` und `http://localhost:8086/`

erreicht werden. Hierbei muss man als Nutzername 'root' und als PW ebenfalls 'root' nutzen.

## Ausführung mit Docker und docker-compose

1.Start durch docker compose up --build

2.Mit dem Browser `http://localhost:8080/` aufrufen

3a.Anmelden mit schon angelegten Usern:
marc.mozer@mail.de; PW: 12345678 (Info:userid=1)
hannah.hirth@mail.de; PW: 12345678 (Infor:userid=2)
joeline.dobler@mail.de; PW: 12345678 (Info: userid=3)
3b.Anmelden durch neu registrieren

Um alle Container zu stoppen, können diese mittels [strg] + [c] beendet werden.
