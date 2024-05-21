# API

The API consists of endpoints under `/api/` path.
All of the request bodies must be JSON-formatted.

## Register

Send HTTP POST request to `/api/register`.

The request body must be JSON-encoded object with `username`, `password` and `email` fields.

Status code is responded according to the following table:

status code | situation
--- | ---
200 | user has been created successfully
400 | username and/or password is invalid
500 | unexpected internal server error

If status code is not 200, response body contains JSON-encoded object with `errorMessage` item describing the error. With status code 200 the response body is empty.

## Meal creation

Send HTTP POST request to `/api/meals`.

The request body must be JSON-encoded object with `name` and `image` fields.

Status code is 200 if everything went well and the meal is added to the database.
Otherwise the status is 400 (missing or invalid request fields) or
500 (unexpected internal server error).

## Meal fetch

Get a list of all meals by sending an HTTP GET request to `/api/meals`.

The response body is a JSON-encoded array of objects that have `name` and `image` keys.
