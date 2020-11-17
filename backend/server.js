// import stuffs
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Rooms from './rooms.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1105668",
    key: "71896e4509cd91bdad5f",
    secret: "c14883d90f73b2c01811",
    cluster: "ap2",
    useTLS: true
});

// middleware
app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     res.setHeader();
//     next();
// });

// DB config
const connection_url = `mongodb+srv://admin:tneNi7xw1OGK571k@cluster0.dwvlb.mongodb.net/whatsappdb?retryWrites=true&w=majority`;

mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connected");

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log("A change occured: ", change);
        
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    from: messageDetails.from,
                    to: messageDetails.to
                }
            );
        } else {
            console.log('Error triggering Pusher');
        }

    });

});

// ???

// api routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

app.get('/messages', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
});

app.post('/messages', (req, res) => {
    const dbMessage = req.body;
    
    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
});

app.get('/rooms', (req, res) => {
    Rooms.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
});

app.get('/rooms/:roomId', (req, res) => {
    Rooms.findById(req.params.roomId, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

app.post('/rooms', (req, res) => {
    const room = req.body;
    
    Rooms.create(room, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
});

// listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`));