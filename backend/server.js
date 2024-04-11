const jsonServer = require("json-server"); // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();


server.use(middlewares);
server.use("/",router);

server.listen(process.env.PORT || 5000, ()=> {
    console.log("JSON server is running");
})
