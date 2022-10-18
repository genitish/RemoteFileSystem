const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');


app.get('/', (req, res) => {
    res.sendfile("index.html")
})



io.on('connection', function (socket) {

    fs.readFile('data.txt', 'utf8', function async(err, data) {
        let fileData = "";
        data = data.split("\n");
        if (data.length > 15) {
            fileData = "";
            for (let i = data.length - 15; i < data.length; i++) {
                fileData += data[i] + "\n";
            }

        }
        else {
            data = data.join("\n");
            fileData = data
        }
        socket.emit("key", fileData);
    })

    fs.watchFile('data.txt', (curr, prev) => {
        fs.readFile('data.txt', 'utf8', function async(err, data) {
            let fileData = "";
            data = data.split("\n");
            if (data.length > 15) {
                fileData = "";
                for (let i = data.length - 15; i < data.length; i++) {
                    fileData += data[i] + "\n";
                }
            }
            else {
                data = data.join("\n");
                fileData = data
            }
            socket.emit("key", fileData);
        })
    });
});


http.listen(3000, () => {
    console.log("Server is running")
})