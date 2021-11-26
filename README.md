# JAM_RecommendationSystem
# API contract for recommendation system
GET
/get_match?page=<int>&uid=<string>

Response (200):
{
	"totalPages": <int>
	"users": [<string>, ...] // User UUIDs
}

PUT
/insert_user
BODY:
{
	"uid": <string>,
	"genres": {
		"Chicago Blues": <int>,
		...
	}
}

Response (200) if succesful