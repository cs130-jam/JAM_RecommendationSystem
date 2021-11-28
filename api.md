### POST `/get_match?page=<int>&uid=<string>`

` PRODUCES ``application/json``

Takes the uid of the given user and the current page index and returns the list of similar users in sorted order (first user being the most relevant) for the given page index. Also return the total number of pages.


**Response (200):**

```javascript
{
   "totalPages": <int>
	"users": [<string>, ...] // User UUIDs
}
```


### PUT `/insert_user`

CONSUMES `application/json` 

insert user in recommendation system's database
**Body:**

```javascript
{
	"uid": <string>,
	"genres": {
		"Chicago Blues": <int>,
		...
	}
}
```

**Response (200)** if successful