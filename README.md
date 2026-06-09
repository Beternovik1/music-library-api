# Music Library REST API

A RESTful API built with Express and MongoDB (Mongoose) for managing a music library. Supports CRUD operations for three collections: interpreters, albums, and songs, along with relationships between them.

## Tech Stack

- Node.js + Express
- MongoDB 7 (via Docker) + Mongoose 9
- Joi for request validation

## Project Structure

```
app.js                 entry point, middleware, route mounting
models/                Mongoose schemas
  interprete_model.js   name, nationality, birth date, status, albums[]
  album_model.js        title, label, publisher, year, status, songs[]
  cancion_model.js      title, duration, status
routes/                Express routers
  interpretes.js        CRUD + duplicate name validation
  albums.js             CRUD + duplicate [title, label, year] validation
  canciones.js          CRUD
  albumsInterprete.js   assign/remove albums from an interpreter
  cancionesAlbum.js     assign/remove songs from an album
package.json
```

## Endpoints

### Interpreters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/interpretes | List all active interpreters |
| GET | /api/interpretes/:id | Get one interpreter |
| POST | /api/interpretes | Create (name must be unique) |
| PUT | /api/interpretes/:id | Update (name must not exist in another) |
| DELETE | /api/interpretes/:id | Soft delete (sets estado to false) |

### Albums
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/albums | List all active albums |
| GET | /api/albums/:id | Get one album |
| POST | /api/albums | Create (combo title + label + year must be unique) |
| PUT | /api/albums/:id | Update (combo must not exist in another album) |
| DELETE | /api/albums/:id | Soft delete |

### Songs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/canciones | List all active songs |
| GET | /api/canciones/:id | Get one song |
| POST | /api/canciones | Create (no extra validation) |
| PUT | /api/canciones/:id | Update |
| DELETE | /api/canciones/:id | Soft delete |

### Album-Interpreter Relationship
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/albums-interprete/:interpreteId | List album IDs of an interpreter |
| GET | /api/albums-interprete/:interpreteId/:albumId | Get specific album from interpreter |
| POST | /api/albums-interprete/:interpreteId/:albumId | Assign album (uses $addToSet) |
| PUT | /api/albums-interprete/:interpreteId/:albumId | Placeholder |
| DELETE | /api/albums-interprete/:interpreteId/:albumId | Remove album (uses $pullAll) |

### Song-Album Relationship
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/canciones-album/:albumId | List song IDs of an album |
| GET | /api/canciones-album/:albumId/:cancionId | Get specific song from album |
| POST | /api/canciones-album/:albumId/:cancionId | Assign song (uses $addToSet) |
| PUT | /api/canciones-album/:albumId/:cancionId | Placeholder |
| DELETE | /api/canciones-album/:albumId/:cancionId | Remove song (uses $pullAll) |

## Key Design Decisions

- Soft deletes: all models have an `estado` boolean field (default true). DELETE sets it to false instead of removing documents.
- Relationships stored as string ID arrays (`[String]`) on the parent document. Album IDs are stored in the interpreter's `albumes` array, song IDs in the album's `canciones` array.
- `$addToSet` prevents duplicate entries when assigning relationships. `$pullAll` removes entries.
- Request validation uses Joi schemas. Additional database-level checks ensure uniqueness of names and title-label-year combinations.
- Logger middleware logs every request with timestamp, method, and URL.

## Setup

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
npm install
node app.js
```

Server starts on port 3000 and connects to MongoDB at `localhost:27017/biblioteca_musica`.
