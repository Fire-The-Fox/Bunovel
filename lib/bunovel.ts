/// <reference lib="dom" />
let globaEngine: null | Engine = null;

type taskType = "changeBackground";

interface execution {
    task: taskType;
    data: any;
}

const getResource = async (url: string) => {
    const req = await fetch("/assets/" + url);
    return await req.blob();
}

const css = (el: Element, obj: any) => {
    for (const key in obj) {
        if (key.match(/[a-z].*[A-Z].*/g)) {
            const starts = key.match(/[A-Z]/g) ?? [];
            let new_key: string = key;
            starts.forEach(k => {
                new_key = new_key.replace(k, `-${k.toLowerCase()}`)
            });

            // @ts-ignore it is string
            el.style[new_key] = obj[key];
        } else {
            // @ts-ignore it is string
            el.style[key] = obj[key];
        }
    }
}

export class Engine {
    private static count = 0;
    private disabled = false;
    private body = document.body;
    __executionQueue: execution[] = [];

    constructor() {
        Engine.count++;
        if (Engine.count > 1) {
            this.disabled = true;
            throw new Error("There cannot be more than one engine!");
        } else {
            globaEngine = this;
        }
    }

    private async setBackground(image: string) {
        const bg = document.querySelector(".background")!;
        css(bg, {
            backgroundImage: `url("/assets/${image}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
        });
    }

    async run() {
        if (this.disabled) return;
        const background = document.createElement("div");
        background.setAttribute("class", "background");
        this.body.appendChild(background);
        css(this.body, {
            margin: 0,
            padding: 0
        });
        css(background, {
            width: "100vw",
            height: "100vh"
        })
        
        while(this.__executionQueue.length) {
            const task: execution = this.__executionQueue.shift()!;
            switch (task.task) {
                case "changeBackground":
                    await this.setBackground(task.data.img);
                    break;
            }
        }
    }

    isDisabled() { return this.disabled }
}

export class Scene {
    private static count = 0;
    private backgroundImage = "blank";

    constructor() {
        Scene.count++;
        if (Scene.count > 1) {
            throw new Error("There cannot be more than one scene!");
        }
    }

    setBackground(fileName: string) {
        this.backgroundImage = fileName;
        globaEngine?.__executionQueue.push({
            task: "changeBackground",
            data: {
                img: fileName
            }
        })
    }
    
    getBackground() { return this.backgroundImage }
}
