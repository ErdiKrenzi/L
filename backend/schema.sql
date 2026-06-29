-- Krijimi i Databazës
CREATE DATABASE IF NOT EXISTS `lipjanmi_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lipjanmi_db`;

-- 1. Tabela NEWS (Njoftimet)
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `news` (`title`, `description`, `image`) VALUES
('Investimet e reja në rrugët e Lipjanit', 'Fillojnë punimet për asfaltimin dhe ndriçimin e rrugëve në qendër të qytetit për të lehtësuar qarkullimin.', 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800'),
('Aktivitetet për Ditën e Çlirimit', 'Komuna e Lipjanit organizon aktivitete të ndryshme kulturore dhe sportive për të gjithë qytetarët më 12 Qershor.', 'https://images.unsplash.com/photo-1531058020387-3be344559be6?w=800'),
('Seanca e re e Kuvendit Komunal', 'Mbahet mbledhja e radhës e Kuvendit Komunal për të diskutuar buxhetin dhe planet e reja rregulluese.', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800');

-- 2. Tabela ATTRACTIONS (Turizmi / Atraksionet)
DROP TABLE IF EXISTS `attractions`;
CREATE TABLE `attractions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `attractions` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Shpella e Gadimes (Shpella e Mermertë)', 'Një nga shpellat më të bukura në Kosovë, e pasur me kristale të mermerta unike dhe stalaktite të mrekullueshme.', 'Gadime e Ulët, Lipjan', '⭐ 4.8', 'https://images.unsplash.com/photo-1507163546605-a84d8ff1a09e?w=800', 42.47800000, 21.20100000),
('Kisha e Janjevës', 'Kishë historike me arkitekturë të veçantë dhe rëndësi të madhe kulturore për trashëgiminë e Lipjanit.', 'Janjevë, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1548625361-155de0cbb55a?w=800', 42.58000000, 21.25000000);

-- 3. Tabela RESTAURANTS (Restorantet dhe Kafenetë)
DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE `restaurants` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `restaurants` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Restorant Venus', 'Ushqime tradicionale dhe ndërkombëtare, shërbim i shkëlqyer dhe ambient komod për familje.', 'Magjistralja Prishtinë-Lipjan', '⭐ 4.7', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 42.53500000, 21.12000000),
('Kulla Grill', 'Mishi më i mirë në zgarë dhe specialitete shtëpiake në një ambient të ngrohtë.', 'Rr. Lidhja e Prizrenit, Lipjan', '⭐ 4.6', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 42.52050000, 21.12500000),
('Restaurant Shega', 'Pica të shijshme me furrë druri dhe pasta të freskëta çdo ditë.', 'Qendër, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 42.52250000, 21.12850000);

-- 4. Tabela HOTELS (Hotelet)
DROP TABLE IF EXISTS `hotels`;
CREATE TABLE `hotels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hotels` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Hotel Ulysses', 'Doma luksoze me të gjitha komoditetet, Wi-Fi falas, mëngjes i përfshirë dhe parking privat.', 'Rr. Skënderbeu, Lipjan', '⭐ 4.6', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 42.52000000, 21.12200000),
('Hotel Plaza Lipjan', 'Pozicionuar në qendër të qytetit, ideal për qëndrime biznesi dhe pushime.', 'Rruga e Lirisë, Lipjan', '⭐ 4.4', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 42.52300000, 21.13000000);

-- 5. Tabela FITNESS (Qendrat e Fitnesit)
DROP TABLE IF EXISTS `fitness`;
CREATE TABLE `fitness` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fitness` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Gym & Fitness Ulpiana', 'Pajisje moderne, trajnime personale dhe hapësirë e madhe për stërvitje.', 'Rr. Adem Jashari, Lipjan', '⭐ 4.8', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 42.52100000, 21.12350000),
('Flex Fitness', 'Klubi perfekt për fitnes dhe kardio me instruktorë profesionistë.', 'Qendër, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 42.52220000, 21.12920000);

-- 6. Tabela PARKS (Parqet)
DROP TABLE IF EXISTS `parks`;
CREATE TABLE `parks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `parks` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Parku i Qytetit të Lipjanit', 'Hapësirë e gjelbëruar me stola, kënd lojërash për fëmijë dhe shtigje për shëtitje.', 'Qendër, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800', 42.52150000, 21.12700000),
('Parku i Pishave', 'Ambient i qetë natyror mes pishave, ideal për rekreacion dhe ikje nga zhurma.', 'Afër Lipjanit', '⭐ 4.7', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 42.50500000, 21.11000000);

-- 7. Tabela PHARMACIES (Farmacitë)
DROP TABLE IF EXISTS `pharmacies`;
CREATE TABLE `pharmacies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `pharmacies` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Mentha Pharmacy (Kujdestare)', 'Shërbim profesional, gamë e gjerë barnash dhe kujdestari 24 orë.', 'Rr. Lidhja e Prizrenit, Lipjan', '⭐ 4.9', 'https://images.unsplash.com/photo-1607619056574-7b8d304f3c6f?w=800', 42.52100000, 21.12400000),
('Farmacia Rexall', 'Barnatore me shërbim cilësor dhe këshilla mjekësore profesionale.', 'Rr. Komandant Kumanova, Lipjan', '⭐ 4.6', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', 42.51950000, 21.12650000),
('Farmacia Lipjani', 'Gjeni të gjitha llojet e medikamenteve dhe produkteve kozmetike.', 'Qendër, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800', 42.52200000, 21.12780000);

-- 8. Tabela SUPERMARKETS (Supermarketet)
DROP TABLE IF EXISTS `supermarkets`;
CREATE TABLE `supermarkets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `supermarkets` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Viva Fresh Store', 'Zgjedhja juaj e përditshme për artikuj ushqimorë dhe shtëpiak me çmimet më të mira.', 'Rr. Gjergj Kastrioti, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800', 42.52400000, 21.12950000),
('ETC Lipjan', 'Hipermarket i madh me shumëllojshmëri produktesh dhe oferta javore.', 'Zona Industriale, Lipjan', '⭐ 4.6', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 42.52600000, 21.13500000),
('Interex', 'Cilësi franceze në produktet ushqimore dhe higjienike.', 'Qendër, Lipjan', '⭐ 4.4', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', 42.52350000, 21.12600000);

-- 9. Tabela ATMS (Bankomatet)
DROP TABLE IF EXISTS `atms`;
CREATE TABLE `atms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `atms` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('TEB Bankomat', 'Tërheqje dhe deponim parash 24/7 për klientët individual dhe bizneset.', 'Rr. Lidhja e Prizrenit, Lipjan', '⭐ 4.3', 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=800', 42.52120000, 21.12450000),
('NLB Bankomat', 'Shërbim i shpejtë i tërheqjes së parave dhe kontrollit të bilancit.', 'Sheshi i Qytetit, Lipjan', '⭐ 4.2', 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800', 42.52080000, 21.12820000),
('Raiffeisen Bankomat', 'Bankomat me siguri të lartë dhe qasje të lehtë në qendër.', 'Rr. Isa Boletini, Lipjan', '⭐ 4.4', 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800', 42.52020000, 21.12580000);

-- 10. Tabela EVENTS (Ngjarjet)
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `events` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Dita e Rinisë Lipjan', 'Koncert i madh festiv me artistë lokalë, aktivitete sportive dhe ekspozita arti.', 'Sheshi "Adem Jashari", Lipjan', '⭐ 4.9', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800', 42.52150000, 21.12700000),
('Panairi i Produkteve Vendore', 'Panair ku fermerët dhe bizneset e Lipjanit prezantojnë produktet e tyre tradicionale.', 'Parku i Qytetit, Lipjan', '⭐ 4.6', 'https://images.unsplash.com/photo-1464047753029-4e92d11c38a9?w=800', 42.52150000, 21.12700000);

-- 11. Tabela HEALTHCARE (Shëndetësia)
DROP TABLE IF EXISTS `healthcare`;
CREATE TABLE `healthcare` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `healthcare` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('QKMF Lipjan', 'Qendra Kryesore e Mjekësisë Familjare "Dr. Vezir Bajrami". Shërbim emergjent dhe kontrolle specialistike 24/7.', 'Rr. Komandant Kumanova, Lipjan', '⭐ 4.2', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800', 42.51920000, 21.12600000),
('Poliklinika Medita', 'Klinikë private me mjekë specialistë të fushave të ndryshme dhe pajisje moderne diagnostikuese.', 'Rr. Lidhja e Prizrenit, Lipjan', '⭐ 4.7', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', 42.52090000, 21.12420000);

-- 12. Tabela BANKS (Bankat)
DROP TABLE IF EXISTS `banks`;
CREATE TABLE `banks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `banks` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('TEB Dega Lipjan', 'Shërbime bankare për individë dhe biznese, karta krediti Starcard dhe kredi me vlerësime të shpejta.', 'Rr. Lidhja e Prizrenit, Lipjan', '⭐ 4.4', 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=800', 42.52120000, 21.12450000),
('NLB Banka Dega Lipjan', 'Hapje llogarish, transfere kombëtare dhe ndërkombëtare, mbështetje për biznese.', 'Rr. Isa Boletini, Lipjan', '⭐ 4.3', 'https://images.unsplash.com/photo-1541354451442-952fe7500b7a?w=800', 42.52080000, 21.12820000);

-- 13. Tabela INSTITUTIONS (Institucionet)
DROP TABLE IF EXISTS `institutions`;
CREATE TABLE `institutions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `institutions` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Komuna e Lipjanit', 'Objekti i administratës komunale. Këtu kryhen të gjitha shërbimet e gjendjes civile dhe aplikimet komunale.', 'Sheshi i Dëshmorëve, Lipjan', '⭐ 4.1', 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=800', 42.52150000, 21.12700000),
('Stacioni Policor Lipjan', 'Siguria dhe rendi publik në qytetin dhe fshatrat e Lipjanit. Shërbim 24/7.', 'Rr. Skënderbeu, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800', 42.51900000, 21.12100000);

-- 14. Tabela SPORTS (Sportet)
DROP TABLE IF EXISTS `sports`;
CREATE TABLE `sports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `sports` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Klubi i Volejbollit KV Ulpiana', 'Klubi i suksesshëm i volejbollit për vajza dhe djem me traditë të gjatë në sportin kosovar.', 'Palestra e Sporteve, Lipjan', '⭐ 4.8', 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800', 42.52040000, 21.12900000),
('Stadiumi Ndihmës i KF Ulpiana', 'Fushë futbolli ku zhvillohen stërvitjet e klubit të futbollit Ulpiana dhe shkollave të futbollit.', 'Lipjan', '⭐ 4.3', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', 42.51800000, 21.13300000);

-- 15. Tabela EDUCATION (Arsimi)
DROP TABLE IF EXISTS `education`;
CREATE TABLE `education` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(10, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `education` (`name`, `description`, `location`, `rating`, `image`, `latitude`, `longitude`) VALUES
('Gjimnazi "Ulpiana"', 'Shkolla e Mesme e Lartë publike me drejtime shoqërore dhe shkencore. Një nga shkollat kryesore në rajon.', 'Rr. e Shkollave, Lipjan', '⭐ 4.5', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', 42.52500000, 21.12200000),
('Shkolla Fillore "Vëllezërit Frashëri"', 'Shkollë fillore dhe e mesme e ulët me standarde të larta në mësimdhënie.', 'Qendër, Lipjan', '⭐ 4.4', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', 42.52260000, 21.12960000);

-- 16. Tabela TAXIS (Taksitë)
DROP TABLE IF EXISTS `taxis`;
CREATE TABLE `taxis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `rating` VARCHAR(50) DEFAULT '⭐ 5.0',
  `image` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `taxis` (`name`, `description`, `location`, `rating`, `image`) VALUES
('Lipjani Taxi 24/7', 'Shërbim i shpejtë taksie brenda dhe jashtë qytetit. Vetura të pastra dhe komode.', '044-111-222 (Viber & WhatsApp)', '⭐ 4.7', 'https://images.unsplash.com/photo-1494887205043-c5f291293cf6?w=800'),
('Taxi Ulpiana', 'Taksi zyrtar për të gjitha relacionet me çmime fikse dhe shoferë të licencuar.', '049-333-444', '⭐ 4.6', 'https://images.unsplash.com/photo-1492664738948-2ec93a5c0942?w=800');

-- 17. Tabela BUS LINES (Linjat e Autobusëve)
DROP TABLE IF EXISTS `bus_lines`;
CREATE TABLE `bus_lines` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route` VARCHAR(255) NOT NULL,
  `schedule` VARCHAR(255) NOT NULL,
  `price` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `bus_lines` (`route`, `schedule`, `price`) VALUES
('Lipjan - Prishtinë', 'Çdo 15 minuta (Nga ora 06:00 deri në 21:00)', '1.00 €'),
('Lipjan - Magure', 'Çdo 30 minuta (Nga ora 06:30 deri në 19:30)', '0.70 €'),
('Lipjan - Janjevë', 'Katër herë në ditë (07:00, 11:30, 15:00, 18:30)', '1.00 €'),
('Lipjan - Gadime', 'Çdo 45 minuta (Nga ora 07:00 deri në 20:00)', '0.50 €');

-- 18. Tabela REPORTS (Ankesat / Raportimet)
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. Tabela USERS (Përdoruesit për RBAC)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`username`, `password_hash`, `email`, `role`) VALUES
('admin', 'scrypt:32768:8:1$NVMH2UlClIvkG7lr$b0235e8c27d0fa0663187449aedeff93131bdb76a8876e91321f9c853b1dfb8ff1763ba44c4ea221f4235ac4211efe0ae28f17fe5c4866b9c053afe802d310e9', 'admin@lipjan.com', 'admin'),
('user', 'scrypt:32768:8:1$NVMH2UlClIvkG7lr$b0235e8c27d0fa0663187449aedeff93131bdb76a8876e91321f9c853b1dfb8ff1763ba44c4ea221f4235ac4211efe0ae28f17fe5c4866b9c053afe802d310e9', 'user@lipjan.com', 'user');
