/* I app.js we make a server and have routes for our CRUD operations here*/

const express = require('express');
const fs = require('fs/promises');

const app = express();

const PORT = 5000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });


app.get('/movies', async (req, res) => {
  try {
    const movies = await fs.readFile('./movies.json');
    res.send(JSON.parse(movies));
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/movies', async (req, res) => {
  try {
    const movie = req.body;
    const listBuffer = await fs.readFile('./movies.json');
    const currentMovies = JSON.parse(listBuffer);
    let maxMovieId = 1;
    if (currentMovies && currentMovies.length > 0) {
      maxMovieId = currentMovies.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxMovieId
      );
    }

    const newMovie = { id: maxMovieId + 1, ...movie };
    const newList = currentMovies ? [...currentMovies, newMovie] : [newMovie];

    await fs.writeFile('./movies.json', JSON.stringify(newList));
    res.send(newMovie);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/movies/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./movies.json');
    const currentMovies = JSON.parse(listBuffer);
    if (currentMovies.length > 0) {
      await fs.writeFile(
        './movies.json',
        JSON.stringify(currentMovies.filter((movie) => movie.id != id))
      );
      res.send({ message: `Film med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen film att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
