import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".mjs":"text/javascript", ".jpeg":"image/jpeg", ".jpg":"image/jpeg", ".png":"image/png" };

createServer(async (req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = normalize(join(root,relative));
    if(!file.startsWith(root)) throw new Error("Invalid path");
    const data = await readFile(file);
    res.writeHead(200,{"Content-Type":types[extname(file)]||"application/octet-stream"});
    res.end(data);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(8080,"127.0.0.1",()=>console.log("http://127.0.0.1:8080"));
