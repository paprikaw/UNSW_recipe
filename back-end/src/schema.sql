-- use this file to reset database schema
drop table if exists AccountSessions, Accounts, Ingredients, Categories;

create table Accounts (
    accountId       serial primary key,
    username        varchar(10) not null,
    email           varchar(320) not null,
    password        varchar(256) not null,
    unique (email)
);

create table AccountSessions (
    sessionId       serial primary key,
    token           varchar(256) not null,
    accountId       bigint unsigned not null,
    foreign key (accountId) references Accounts(accountId)
);

create table Categories (
    categoryId      serial primary key,
    categoryName    text not null
);

create table Ingredients (
    ingredientId    serial primary key,
    ingredientName  text not null,
    categoryId      bigint unsigned not null,
    foreign key (categoryId) references Categories(categoryId)
);

insert into Categories (categoryName) values ('Vegetables');
insert into Categories (categoryName) values ('Fruits');
insert into Categories (categoryName) values ('Meat and Fish');
insert into Categories (categoryName) values ('Eggs and Dairy');
insert into Categories (categoryName) values ('Grains and Nuts');
insert into Categories (categoryName) values ('Pasta and Noodles');
insert into Categories (categoryName) values ('Baking Products');
insert into Categories (categoryName) values ('Herbs, Seasonings and Spices');
insert into Categories (categoryName) values ('Fats and Oils');
insert into Categories (categoryName) values ('Condiments and Dressings');

insert into Ingredients (ingredientName, categoryId) values ('Garlic', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Onion', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Carrot', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Potato', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Red Onion', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Celery', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Cabbage', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Lettuce', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Spinach', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Bok Choy', (select categoryId from Categories where categoryName = 'Vegetables'));
insert into Ingredients (ingredientName, categoryId) values ('Tomato', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Pumpkin', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Avocado', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Apple', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Orange', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Banana', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Lemon', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Lime', (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Mango',  (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Coconut',  (select categoryId from Categories where categoryName = 'Fruits'));
insert into Ingredients (ingredientName, categoryId) values ('Bacon',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Ground Beef',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Beef Steak',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Sausage',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Ground Pork',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Chicken Breast',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Chicken Thighs',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Salmon',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Ham',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Chicken Wings',  (select categoryId from Categories where categoryName = 'Meat and Fish'));
insert into Ingredients (ingredientName, categoryId) values ('Eggs (Chicken)',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Butter',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Milk',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Heavy Cream',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Sour Cream',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Yogurt',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Cheddar',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Mozerella',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Parmesan',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Cream Cheese',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'));
insert into Ingredients (ingredientName, categoryId) values ('Basmati Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Brown Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Jasmine Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Oats',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Short-grain Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('White Bread',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Baguette',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Bread Crumbs',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Almond',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Peanut',  (select categoryId from Categories where categoryName = 'Grains and Nuts'));
insert into Ingredients (ingredientName, categoryId) values ('Spaghetti',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Egg Noodles',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Rice Noodles',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Penne',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Udon',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Macaroni',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Linguine',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Ramen',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Soba',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('Lasagna',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'));
insert into Ingredients (ingredientName, categoryId) values ('White Flour',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Caster Sugar',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Baking Soda',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Baking Powder',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Yeast',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Brown Sugar',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Vanilla Extract',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Self-rising Flour',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Cornstarch',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Bread Flour',  (select categoryId from Categories where categoryName = 'Baking Products'));
insert into Ingredients (ingredientName, categoryId) values ('Rosemary',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Thyme',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Oregano',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Parsley',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Chilli Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Garam Masala',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Salt',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Pepper',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Onion Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Garlic Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Paprika',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'));
insert into Ingredients (ingredientName, categoryId) values ('Vegetable Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Shortening',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Olive Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Coconut Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Sesame Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Chilli Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Peanut Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Cooking Spray',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Canola Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'));
insert into Ingredients (ingredientName, categoryId) values ('Mustard',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Soy Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Worcestershire Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Fish Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Tomato Ketchup',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('BBQ Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Greek Salad Dressing',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Balsamic Vinegar',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
insert into Ingredients (ingredientName, categoryId) values ('Dark Soy Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'));
