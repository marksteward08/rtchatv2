import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (err, res) => {
    res.render('index.ejs');
});

// CHAT VAR
let username = '';

app.post('/', (req, res) => {
    username = req.body.username.trim();
    
    if(username !== '') {
        res.render('chat.ejs', {
            username : username
        })
    } else {
        res.redirect('/');
    }
});

io.on('connection', (socket) => {
    io.emit('onJoin', `<b>${username}</b> joined the chat.`);

    socket.on('disconnect', () => {
        io.emit('onLeave', `<b>${username}</b> left the chat.`);
    });

    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
    });
});

server.listen(PORT, () => {
    console.log(`listening to port @ ${PORT}`);
});
