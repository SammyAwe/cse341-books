
# W02 Assignment: Develop the Specification

# Version 1

## 1. Books Specification

# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## 2. Authors Specification

## Feature 2: Author CRUD Operations

### Goal

Create an authors API that supports all CRUD operations. Each author will have a custom string ID that can be referenced by books through the `authorId` field.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, custom ID such as `a1`.
- `name`: string, author's full name.
- `birthYear`: number, year the author was born.

Example:

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

### Relationship to Books

Each book must reference an existing author through its `authorId` field. An author cannot be deleted while one or more books still reference that author. The API must return a `409 Conflict` response in this situation.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- `200 OK`: Returns an array of authors.

Errors:

- `500 Internal Server Error`: Unexpected server error.

#### GET /authors/:id

Purpose: Return one author by custom ID.

Success:

- `200 OK`: Returns the requested author.

Errors:

- `404 Not Found`: Author does not exist.
- `500 Internal Server Error`: Unexpected server error.

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

Success:

- `201 Created`: Returns the newly created author.

Errors:

- `400 Bad Request`: A required field is missing, a field is invalid, or the author ID already exists.
- `500 Internal Server Error`: Unexpected server error.

#### PUT /authors/:id

Purpose: Update an existing author. The ID is supplied in the URL and cannot be changed.

Request body:

```json
{
  "name": "Updated Author Name",
  "birthYear": 1985
}
```

Success:

- `200 OK`: Returns the updated author.

Errors:

- `400 Bad Request`: A required field is missing or a field is invalid.
- `404 Not Found`: Author does not exist.
- `500 Internal Server Error`: Unexpected server error.

#### DELETE /authors/:id

Purpose: Delete an author by ID.

Success:

- `204 No Content`: Author was successfully deleted. No response body.

Errors:

- `404 Not Found`: Author does not exist.
- `409 Conflict`: Author cannot be deleted because one or more books still reference that author.
- `500 Internal Server Error`: Unexpected server error.

## Evaluation of Version 1

### 1. Books Specification

#### Question 1: Are there any bugs or short-sighted decisions?

The specification does not clearly define the required format for publicationDate. Although an example uses YYYY-MM-DD, it does not explicitly require that format. It also does not explain how invalid dates should be handled.

#### Question 2: Are there any security considerations?

The API should validate incoming request data to prevent invalid or unexpected values from being stored in the database. It should also avoid exposing database errors or sensitive server information in error responses.

#### Question 3: Are there any efficiency concerns?

The specification does not mention database indexes for custom book IDs or authorId. Adding indexes could improve book lookups and make it faster to find books belonging to an author.

#### Question 4: Are any response examples or error behaviors unclear?

The specification lists HTTP status codes but does not provide examples of error response bodies. It should define consistent JSON error messages so API users understand why a request failed.

### 2. Authors Specification

#### Question 1: Are there any bugs or short-sighted decisions?

The specification does not clearly define the validation rules for the author's name and birth year. For example, it does not explain whether an empty name, a negative birth year, or a future birth year should be accepted.

#### Question 2: Are there any security considerations?

The API should validate all incoming author data and reject unexpected values. It should also avoid exposing sensitive database information when an error occurs.

#### Question 3: Are there any efficiency concerns?

The specification does not mention database indexes for author IDs. Adding a unique index to the custom `id` field would improve lookups and help prevent duplicate author IDs. An index on `authorId` in the books collection would also make it faster to check whether an author is still referenced by books.

#### Question 4: Are any response examples or error behaviors unclear?

The specification does not include examples of error response bodies. It should define consistent JSON messages for cases such as an author not being found, duplicate author IDs, and attempting to delete an author who still has books.

# Version 2

## 1. Improved Books Specification

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 Books API so book documents reference existing authors using custom string IDs. The API must support all CRUD operations, validate incoming data, provide consistent error responses, and document every route in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required fields:

- `id`: string, required, unique custom ID such as `b1`.
- `authorId`: string, required, must reference an existing author's custom ID.
- `title`: string, required, must not be empty or contain only whitespace.
- `publicationDate`: string, required, must use the `YYYY-MM-DD` format and represent a valid calendar date.

Example:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Things Fall Apart",
  "publicationDate": "1958-06-17"
}
```

MongoDB's `_id` field will remain internal. API routes will use the custom `id` field.

### Validation Rules

- All required fields must be provided when creating a book.
- IDs must be non-empty strings.
- Book titles must be non-empty strings after trimming whitespace.
- Publication dates must be valid dates in `YYYY-MM-DD` format.
- The `authorId` must match an existing author.
- Duplicate book IDs must be rejected.
- During updates, the book ID must not be changed.
- Unknown fields and attempts to change protected fields must be rejected.

### Relationship to Authors

Every book must reference an existing author through `authorId`.

When creating or updating a book, the API must verify that the referenced author exists. If the author does not exist, the API must return `400 Bad Request`.

An author cannot be deleted while books still reference that author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- `200 OK`: Returns an array of book objects.

Errors:

- `500 Internal Server Error`: Unexpected server or database error.

#### GET /books/:id

Purpose: Return one book by its custom ID.

Success:

- `200 OK`: Returns the matching book object.

Errors:

- `404 Not Found`: No book exists with the requested ID.
- `500 Internal Server Error`: Unexpected server or database error.

#### POST /books

Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:

- `201 Created`: Returns the newly created book object.

Errors:

- `400 Bad Request`: A required field is missing, a field is invalid, the ID already exists, or the author does not exist.
- `500 Internal Server Error`: Unexpected server or database error.

#### PUT /books/:id

Purpose: Update an existing book. The book ID is supplied in the URL and cannot be changed.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:

- `200 OK`: Returns the updated book object.

Errors:

- `400 Bad Request`: A required field is missing, a field is invalid, or the referenced author does not exist.
- `404 Not Found`: No book exists with the requested ID.
- `500 Internal Server Error`: Unexpected server or database error.

#### DELETE /books/:id

Purpose: Delete a book by its custom ID.

Success:

- `204 No Content`: Book was successfully deleted. No response body.

Errors:

- `404 Not Found`: No book exists with the requested ID.
- `500 Internal Server Error`: Unexpected server or database error.

### Error Response Format

All error responses must use a consistent JSON format.

Example:

```json
{
  "message": "Book not found"
}
```

For invalid requests:

```json
{
  "message": "Invalid request data",
  "details": "The publicationDate must use YYYY-MM-DD format."
}
```

Unexpected server errors must return a generic message without exposing database credentials, stack traces, or internal implementation details.

### Database Efficiency

- Create a unique index on the custom `id` field in the books collection.
- Create an index on `authorId` to improve searches for books belonging to an author.
- Use database queries that retrieve only the required records.
- Consider pagination if the number of books grows significantly.

### Swagger Documentation

Swagger must document all book routes, request bodies, response examples, validation rules, and possible HTTP status codes.

### Deployment Expectations

All book routes must work locally and on the deployed Render application. The Swagger documentation must be available at `/api-docs` and allow users to test every book route.

## 2. Improved Authors Specification

## Feature 2: Author CRUD Operations

### Goal

Create an Authors API that supports all CRUD operations. Author documents must use custom string IDs and be referenced by books through their `authorId` fields.

### Data Model

Author documents will be stored in the `authors` collection.

Required fields:

- `id`: string, required, unique custom ID such as `a1`.
- `name`: string, required, must not be empty or contain only whitespace.
- `birthYear`: number, required, must be a positive integer and cannot be a future year.

Example:

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

MongoDB's `_id` field will remain internal. API routes will use the custom `id` field.

### Validation Rules

- All required fields must be provided when creating an author.
- Author IDs must be non-empty strings.
- Author names must be non-empty strings after trimming whitespace.
- Birth years must be positive integers and cannot be in the future.
- Duplicate author IDs must be rejected.
- During updates, the author ID must not be changed.
- Unknown fields and attempts to change protected fields must be rejected.

### Relationship to Books

Books reference authors through the `authorId` field.

When an author is deleted, the API must first check whether any books still reference that author.

If books reference the author, deletion must be rejected with `409 Conflict`. The books must first be reassigned to another existing author or deleted.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- `200 OK`: Returns an array of author objects.

Errors:

- `500 Internal Server Error`: Unexpected server or database error.

#### GET /authors/:id

Purpose: Return one author by custom ID.

Success:

- `200 OK`: Returns the matching author object.

Errors:

- `404 Not Found`: No author exists with the requested ID.
- `500 Internal Server Error`: Unexpected server or database error.

#### POST /authors

Purpose: Create a new author.

Request body:

```json
{
  "id": "a4",
  "name": "Example Author",
  "birthYear": 1980
}
```

Success:

- `201 Created`: Returns the newly created author object.

Errors:

- `400 Bad Request`: A required field is missing, a field is invalid, or the author ID already exists.
- `500 Internal Server Error`: Unexpected server or database error.

#### PUT /authors/:id

Purpose: Update an existing author. The author ID is supplied in the URL and cannot be changed.

Request body:

```json
{
  "name": "Updated Author Name",
  "birthYear": 1985
}
```

Success:

- `200 OK`: Returns the updated author object.

Errors:

- `400 Bad Request`: A required field is missing or a field is invalid.
- `404 Not Found`: No author exists with the requested ID.
- `500 Internal Server Error`: Unexpected server or database error.

#### DELETE /authors/:id

Purpose: Delete an author by custom ID.

Success:

- `204 No Content`: Author was successfully deleted. No response body.

Errors:

- `404 Not Found`: No author exists with the requested ID.
- `409 Conflict`: The author cannot be deleted because one or more books still reference that author.
- `500 Internal Server Error`: Unexpected server or database error.

### Error Response Format

All author error responses must use a consistent JSON format.

Example:

```json
{
  "message": "Author not found"
}
```

For invalid author data:

```json
{
  "message": "Invalid request data",
  "details": "The birthYear must be a positive integer and cannot be a future year."
}
```

For an author deletion conflict:

```json
{
  "message": "Cannot delete author because books still reference this author."
}
```

Unexpected server errors must return a generic message without exposing database credentials, stack traces, or internal implementation details.

### Database Efficiency

- Create a unique index on the custom `id` field in the authors collection.
- Create an index on the `authorId` field in the books collection.
- Use efficient queries when checking whether books reference an author.
- Consider pagination if the number of authors grows significantly.

### Swagger Documentation

Swagger must document all author routes, request bodies, response examples, validation rules, and possible HTTP status codes.

### Deployment Expectations

All author routes must work locally and on the deployed Render application. The Swagger documentation must be available at `/api-docs` and allow users to test every author route.
