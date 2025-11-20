## Vehicle Server Typescript

### Requirements

- nodejs
- docker

### Running the server

First start a database server

```bash
docker run -d -e POSTGRES_USER=vehicle -e POSTGRES_PASSWORD=vehicle -e POSTGRES_DB=vehicle -p 5432:5432 postgis/postgis:16-3.4-alpine
```

Then, in another terminal start the server

```bash
node dist/index.js
```

### Test plan

#### Create a Vehicle

```bash
curl -v -XPOST -H "Content-Type: application/json" --data '{"shortcode":"abbc", "battery": 12, "latitude": 53.43, "longitude": 43.43}' localhost:8080/vehicles | jq .
```

#### List all Vehicles

```bash
curl -v localhost:8080/vehicles
```

#### Delete a Vehicle

```bash
curl -v  -XDELETE localhost:8080/vehicles/${vehicle_id}
```
