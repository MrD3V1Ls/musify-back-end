import brain from 'brain.js'
// Define song database with scores for each user
const songDatabase = {
    'song1': {
        'likes': 10,
    },
    'song2': {
        'likes': 5,
    },
    'song3': {
        'likes': 5,
    },
    'song4': {
        'likes': 8,
    },
};

// Define user's song ratings
const userRatings = {
    'song1': 1, // Liked
    'song2': -1, // Disliked
    'song3': 1, // Neutral
    'song4': 1, // Liked
};

// Define the neural network
const net = new brain.NeuralNetwork();

// Train the neural network on song database
let trainingData = [];

for (let song in songDatabase) {
    let input = { 'likes': songDatabase[song].likes };
    let output = { [song]: 1 };
    trainingData.push({ input, output });
}
console.log(trainingData)
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