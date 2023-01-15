
generate-api:
	curl http://localhost:8080/spec/json > src/api/schema.json
	npx @openapitools/openapi-generator-cli generate -i src/api/schema.json -g typescript-fetch -o ./src/api/generated
