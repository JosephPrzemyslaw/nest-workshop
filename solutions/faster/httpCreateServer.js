const http = require("http");

const server = http.createServer((req, res) => {
    if (req.url === "/test" && req.method === "GET") {
        res.setHeader('content-type', 'text/plain; charset=utf-8');
        res.end("This is a test !");
    }
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => console.log(`Server is running on PORT=${PORT}`));
