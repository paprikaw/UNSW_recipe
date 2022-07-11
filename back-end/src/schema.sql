-- use this file to reset database schema
drop truncate table if exists AccountSessions, Accounts, RecipeIngredients, Recipes, IngredientSets, NoResultIngredientSets, Ingredients, Categories;

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
    numUses         int,
    emoji           text,
    foreign key (categoryId) references Categories(categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

create table NoResultIngredientSets (
    setId           serial primary key,
    hits            int
);

create table IngredientSets (
    setId           bigint unsigned not null,
    ingredientId    bigint unsigned not null,
    primary key     (setId, ingredientId),
    foreign key (setId) references NoResultIngredientSets(setId),
    foreign key (ingredientId) references Ingredients(ingredientId)
);

create table Recipes (
    recipeId        serial primary key,
    recipeName      text,
    mealType        text, -- do we want contributors to require a mealType input
    cookTime        int, -- in minutes
    likes           int unsigned,
    accountId       bigint unsigned,
    thumbnailPath   text not null,
    -- storing images: we can save file locally and store the filepath in database, or store image (takes up lots of space)
    foregin key (accountId) references Accounts(accountId)
);

create table RecipeIngredients (
    recipeId        bigint unsigned not null,
    ingredientId    bigint unsigned not null,
    quantity        int,
    unit            text,
    primary key     (recipeId, ingredientId),
    foreign key (recipeId) references Recipes(recipeId),
    foreign key (ingredientId) references Ingredients(ingredientId)
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

insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Garlic', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🧄');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Onion', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🧅');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Carrot', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥕');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Potato', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥔');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Red Onion', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🧅');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Celery', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥬');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Shiitake Mushrooms', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🍄');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Lettuce', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥬');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Broccoli', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥦');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Bok Choy', (select categoryId from Categories where categoryName = 'Vegetables'), 0, '🥬');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Tomato', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍅');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Strawberry', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍓');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Avocado', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🥑');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Apple', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍎');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Orange', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍊');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Banana', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍌');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Lemon', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍋');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Pineapple', (select categoryId from Categories where categoryName = 'Fruits'), 0, '🍍');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Mango',  (select categoryId from Categories where categoryName = 'Fruits'), 0, '🥭');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Coconut',  (select categoryId from Categories where categoryName = 'Fruits'), 0, '🥥');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Bacon',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🥓');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Ground Beef',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🐮');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Beef Steak',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🥩');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Sausage',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🌭');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Ground Pork',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🐷');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Chicken Breast',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🐔');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Chicken Thighs',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🍗');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Salmon',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🐟');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Ham',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🍖');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Chicken Wings',  (select categoryId from Categories where categoryName = 'Meat and Fish'), 0, '🐔');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Eggs (Chicken)',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🥚');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Butter',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🧈');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Milk',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🥛');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Heavy Cream',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🥛');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Sour Cream',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🥛');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Yogurt',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🥛');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Cheddar',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🧀');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Mozerella',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🧀');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Parmesan',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🧀');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Cream Cheese',  (select categoryId from Categories where categoryName = 'Eggs and Dairy'), 0, '🧀');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Basmati Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍚');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Brown Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍚');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Jasmine Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍚');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Oats',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🌾');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Short-grain Rice',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍚');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('White Bread',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍞');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Baguette',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🥖');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Bread Crumbs',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🍞');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Almond',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🌰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Peanut',  (select categoryId from Categories where categoryName = 'Grains and Nuts'), 0, '🥜');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Spaghetti',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍝');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Egg Noodles',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🥡');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Rice Noodles',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🥡');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Penne',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍝');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Udon',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍜');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Macaroni',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍝');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Linguine',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍝');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Ramen',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍜');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Soba',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍜');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Lasagna',  (select categoryId from Categories where categoryName = 'Pasta and Noodles'), 0, '🍝');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('White Flour',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🌾');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Caster Sugar',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Baking Soda',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Baking Powder',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Yeast',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Brown Sugar',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Vanilla Extract',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍰');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Self-rising Flour',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🌾');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Cornstarch',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🌽');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Bread Flour',  (select categoryId from Categories where categoryName = 'Baking Products'), 0, '🍞');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Rosemary',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🌿');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Thyme',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🌿');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Oregano',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🌿');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Parsley',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🌿');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Chilli Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🌶');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Garam Masala',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Salt',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Pepper',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Onion Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Garlic Powder',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Paprika',  (select categoryId from Categories where categoryName = 'Herbs, Seasonings and Spices'), 0, '🧂');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Vegetable Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🥬');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Shortening',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🧈');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Olive Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🫒');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Coconut Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🥥');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Sesame Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🌱');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Chilli Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🌶');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Peanut Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🥜');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Cooking Spray',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Canola Oil',  (select categoryId from Categories where categoryName = 'Fats and Oils'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Mustard',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Soy Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Worcestershire Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Fish Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🐟');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Tomato Ketchup',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🍅');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('BBQ Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🍖');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Greek Salad Dressing',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥗');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Balsamic Vinegar',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥫');
insert into Ingredients (ingredientName, categoryId, numUses, emoji) values ('Dark Soy Sauce',  (select categoryId from Categories where categoryName = 'Condiments and Dressings'), 0, '🥫');
