const express = require("express");
const app = express();

const albumsData = [
  {
    albumId: "10",
    artistName: "Beyoncé",
    collectionName: "Lemonade",
    artworkUrl100:
      "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
    releaseDate: "2016-04-25T07:00:00Z",
    primaryGenreName: "Pop",
    url: "https://www.youtube.com/embed/PeonBmeFR8o?rel=0&amp;controls=0&amp;showinfo=0",
  },
  {
    albumId: "11",
    artistName: "Beyoncé",
    collectionName: "Dangerously In Love",
    artworkUrl100:
      "http://is1.mzstatic.com/image/thumb/Music/v4/18/93/6d/18936d85-8f6b-7597-87ef-62c4c5211298/source/100x100bb.jpg",
    releaseDate: "2003-06-24T07:00:00Z",
    primaryGenreName: "Pop",
    url: "https://www.youtube.com/embed/ViwtNLUqkMY?rel=0&amp;controls=0&amp;showinfo=0",
  },
  {
    albumId: "12",
    artistName: "Beyoncé",
    collectionName: "New Album",
    artworkUrl100:
      "http://is1.mzstatic.com/image/thumb/Music/v4/18/93/6d/18936d85-8f6b-7597-87ef-62c4c5211298/source/100x100bb.jpg",
    releaseDate: "2003-06-24T07:00:00Z",
    primaryGenreName: "Pop",
    url: "https://www.youtube.com/embed/ViwtNLUqkMY?rel=0&amp;controls=0&amp;showinfo=0",
  },
];

let nextId = 13;

app.use(express.json()); // before our routes definition

app.get("/albums", (req, res) => {
  res.send(albumsData);
});

app.get("/albums/:albumId", (req, res) => {
  let chosenAlbum = albumsData.find(
    (album) => album.albumId === req.params.albumId
  );
  if (chosenAlbum) {
    res.send(chosenAlbum);
  } else {
    res.status(404).send({ message: "Album not found" });
  }
});

// notice .post (not .get)
app.post("/albums", (req, res) => {
  // console.log("POST /albums route");
  // console.log(req.body);
  const newAlbum = {
    // albumId: req.body.albumId,
    albumId: "" + nextId,
    artistName: req.body.artistName,
    collectionName: req.body.collectionName,
    artworkUrl100: req.body.artworkUrl100,
    releaseDate: req.body.releaseDate,
    primaryGenreName: req.body.primaryGenreName,
    url: req.body.url,
  };
  if (albumsData.find((album) => album.albumId === newAlbum.albumId)) {
    res.status(400).send({ message: "Album already exists" });
  } else if (
    !newAlbum.albumId ||
    !newAlbum.artistName ||
    !newAlbum.collectionName ||
    !newAlbum.artworkUrl100 ||
    !newAlbum.releaseDate ||
    !newAlbum.primaryGenreName ||
    !newAlbum.url
  ) {
    res.status(400).send({ message: "Album data missing" });
  } else {
    albumsData.push(newAlbum);
    nextId++;
    res.send(newAlbum);
  }
});

// notice .delete

app.delete("/albums/:albumId", (req, res) => {
  console.log("DELETE /albums route");
  const albumId = req.params.albumId;
  const positionAlbum = albumsData.findIndex(
    (album) => album.albumId === albumId
  );
  if (positionAlbum === -1) {
    res.status(400).send({ message: "Album not found" });
  } else {
    albumsData.splice(positionAlbum, 1);
    res.status(200).send({ success: true });
  }
});

app.put("/albums/:albumId", (req, res) => {
  console.log("PUT /albums route");
  let oldAlbum = {};
  let newAlbum = {};

  albumsData.forEach((album, index) => {
    if (album.albumId == req.params.albumId) {
      newAlbum = { ...album, ...req.body };
      oldAlbum = albumsData[index];

      albumsData[index] = newAlbum;
    }
  });

  res.json({
    success: true,
    oldAlbum: oldAlbum,
    newAlbum: newAlbum,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});