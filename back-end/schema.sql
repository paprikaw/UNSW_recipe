create table Accounts (
    accountId       serial primary key,
    username        varchar(10) not null,
    email           varchar(320) not null,
    password        varchar(256) not null,
    unique (email)
)

create table Sessions (
    sessionId       serial primary key,
    token           varchar(256) not null,
    accountId       bigint unsigned not null,
    foreign key (accountId) references Accounts(accountId)
)

create table Categories (
    categoryId      serial primary key,
    categoryName    text not null
)

create table Ingredients (
    ingredientId    serial primary key,
    ingredientName  text not null,
    categoryId      bigint unsigned not null,
    foreign key (categoryId) references Categories(categoryId)
)
