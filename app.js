const path = require('path');
const express = require('express');
const app = express();

require(path.join(__dirname,'app/Providers/LibraryServiceProvider')).load(app);
require(path.join(__dirname,'app/Providers/RouteServiceProvider')).loadApiRoutes(app);

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.listen(process.env.port,() => {
    console.log(`Server running in ${process.env.port} on port ${process.env.port}`);
});

