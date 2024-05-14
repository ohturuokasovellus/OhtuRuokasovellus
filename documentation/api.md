# API

The API consists of endpoints under `/api/` path.
All of the request bodies must be JSON-formatted.

## Register

HTTP method must be POST.

The request body must be JSON-encoded object with `username` and `password` fields.

Status code is responded according to the following table:

status code | situation
--- | ---
200 | user has been created successfully
400 | username and/or password is invalid
500 | unexpected internal server error

If status code is not 200, response body contains JSON-encoded object with `errorMessage` item describing the error. With status code 200 the response body is empty.
