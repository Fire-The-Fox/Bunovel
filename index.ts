import { readdirSync, statSync } from "fs";

const charCount = (str: string, char: string) => {
    let count = 0;
    for (const s of str.split("")) {
        if (s == char) count++;
    }
    return count;
}

const getFiles = (path: string, files: string[] = []) => {
    let localFiles = readdirSync(path);

    let length = localFiles.length;

    for (let i = 0; i < length; i++) {
        if (statSync(path + '/' + localFiles[i]).isDirectory())
            files = getFiles(path + '/' + localFiles[i], files);
        else
            files.push(path + '/' + localFiles[i]);
    }

    return files;
}

const htmlize = (bundle: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
  </head>
  <body>
  </body>
  <script>${bundle}</script>
</html>`

const simpleRouter = new Map();

for (let file of getFiles("scenes")) {
    const mod = await (await Bun.build({
        entrypoints: [file],
    })).outputs[0].text();
    file = file.slice(6);
    if (file.endsWith("index.ts") && charCount(file, "/") == 1) {
        simpleRouter.set("/", htmlize(mod));
    } else {
        const split = file.split(".");
        split.pop();
        simpleRouter.set(split.join(".") + "/", htmlize(mod));
    }
}

for (const file of getFiles("assets")) {
    simpleRouter.set("/" + file, Bun.file(file));
}

Bun.serve({
    fetch(r) {
        const path = new URL(r.url).pathname;
        const data = simpleRouter.get(path) ?? "No route";
        if (typeof data == "string") {
            return new Response(data,
                                { headers: { "Content-Type": "text/html" }});
        }

        return new Response(data, { headers: { "Content-Type": data.type}});
    },
    port: 3000
})
