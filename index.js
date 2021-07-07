// code away!
const server = require("./server");

const port = process.env.PORT || 5001;

server.listen(port, () => console.log(`\nServer running on port ${port}\n`))