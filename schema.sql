drop database if exists cttd;

create database cttd;

use cttd;

drop table if exists matches;

create table matches (
	matchNumber int primary key,
	played tinyint(1) default 0,
	red1 int,
	red2 int,
	red3 int,
	blue1 int,
	blue2 int,
	blue3 int
);

drop table if exists stack;

create table stack (
	teamNumber int,
	matchNumber int,
	height int,
	bin tinyint(1),
	litter tinyint(1)
);

drop table if exists auto;

create table auto (
	teamNumber int,
	matchNumber int,
	type int
);

drop table if exists cap;

create table cap (
	teamNumber int,
	matchNumber int,
	height int
);

drop table if exists error;

create table error (
	teamNumber int,
	matchNumber int,
	type int
);
