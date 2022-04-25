import express from "express";
import cors from 'cors';
import chalk from "chalk";

import users from './data/users.js';
import tweets from './data/tweets.js';

const app = express();
app.use(express.json());
app.use(cors());


app.post("/sign-up", (req, res) =>{
    const {username, avatar} = req.body;
    const user = {
        username,
        avatar
    };
    if (!username || !avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
    } else if(!isValidUrl(avatar)){
        res.status(400).send("A foto precisa ser um link!!!")
    } else {
        users.push(user)
        res.status(201).send("OK")
    }
})

app.post("/tweets", (req, res) =>{

    const {tweet} = req.body;
    const {user: username} = req.headers;

    const user = users.find(user => user.username === username);
    const avatar = user.avatar;

    const postTweet = {
        username,
        avatar,
        tweet
    };

    if (!tweet || !username) {
        res.status(400).send("Todos os campos são obrigatórios!");
    } else {
        tweets.push(postTweet);
        res.status(201).send("OK");
    }
});

app.get("/tweets", (req,res) => {
    const lastTweets = tweets.slice(-10, tweets.length ).reverse();
    res.send(lastTweets);
});

app.get("/tweets/:idUser", (req,res) => {
    const {idUser} = req.params;
    const userTweets = tweets.filter(tweet => tweet.username == idUser);
    res.send(userTweets);
});


app.listen(5000,() => console.log(chalk.bold.green('Servidor funcionando!!!')));


function isValidUrl(_string) {
    const matchpattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(_string);
  }
