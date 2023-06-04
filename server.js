import express from 'express';
import brain from 'brain.js';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
app.use(bodyParser.json());
app.options('*', cors());
app.post('/', async (req, res) => {
    let { songDatabase, userRatings } = req.body
    const net = new brain.NeuralNetwork();
    // Train the neural network on song database
    let trainingData = [];

    for (let song in songDatabase) {
        let input = { 'likes': songDatabase[song].likes };
        let output = { [song]: 1 };
        trainingData.push({ input, output });
    }

    net.train(trainingData);
    // Make a recommendation for the user based on their ratings
    let userInput = {};

    for (let song in userRatings) {
        let rating = userRatings[song];
        if (rating === 1) {
            // Add one to the number of likes for the song
            if (song in songDatabase) {
                songDatabase[song].likes += 1;
            } else {
                songDatabase[song] = { 'likes': 1 };
            }
        } else if (rating === -1) {
            // Subtract one from the number of likes for the song
            if (song in songDatabase) {
                songDatabase[song].likes -= 1;
            } else {
                songDatabase[song] = { 'likes': -1 };
            }
        }

        userInput['likes'] = songDatabase[song].likes;
    }

    let recommendation = net.run(userInput);

    // Sort the recommendation by number of likes in descending order
    let sortedRecommendation = Object.keys(recommendation)
        .sort((a, b) => songDatabase[b].likes - songDatabase[a].likes);

    console.log(sortedRecommendation);
    res.send(JSON.stringify(sortedRecommendation));
})


app.listen(3000, () => {
    console.log('Server started on port 3000');
});
