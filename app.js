const http = require("http");
const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const server = http.createServer(app);

require(path.join(__dirname,'app/Providers/LibraryServiceProvider')).load(app);
require(path.join(__dirname,'app/Providers/RouteServiceProvider')).loadApiRoutes(app);
require(path.join(__dirname,'app/Providers/RouteServiceProvider')).loadAdminRoutes(app);
require(path.join(__dirname,'app/Providers/SocketServiceProvider')).load(server);


server.listen(process.env.port, () => {
    console.log(`Server running in http://127.0.0.1:${process.env.port}`);
});


