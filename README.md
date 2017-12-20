# CS 340 Final Project

This project entails the back-end implementation of social brewery website.

## Brewery

This table contains data for breweries which includes:

id | lattitude | longitude | name | address | city | state | number | website | description | owner_id
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---

In the website the user is able to search the breweries in a populated drop down list and view the information of the brewery itself along with comments that are associated with it. It will also display the beers that the company owns. Currently the owner functionality is not incorporated into the project. A user may also delete a brewery but can only do so if they are an owner.

## Beer

This table contains data for beers and includes:

id | brew_id | category | style | abv | ibu | description 
--- | --- | --- | --- | --- | --- | ---

The functionality for this table is similar to the brewery table. The user can view beers and their associated comments with them after searching with the drop down table. Then they are able to delete beers although this functionality will be transferred only to owners of the beer. 

## User

This table contains data for user and includes:

id | first_name | last_name | email | password | city | state 
--- | --- | --- | --- | --- | --- | ---

A user can create a new user and also delete users.

## Comment

This table contains data for comments and includes:

id | user_id | beer_id | brew_id | text  
--- | --- | --- | --- | --- 

A user may comment on a beer or brewery and edit that same comment if they so choose.

## User likes

This table contains data for user likes and includes:

user_id | beer_id 
--- | ---

This table allows a user to like a beer. Under each beer in the beers directory it will list off users who "liked" the beer.
