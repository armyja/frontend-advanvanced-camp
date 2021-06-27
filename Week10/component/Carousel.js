import { Component, STATE, ATTRIBUTE } from "./framework";
import { enableGesture } from "../gesture/gesture";
import { Timeline, Animation } from "./animation";
import { ease } from "./ease"

export {STATE, ATTRIBUTE} from "./framework.js"

export class Carousel extends Component {
    constructor() {
        super();
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (let record of this[ATTRIBUTE].src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record.image}')`;
            // child.src = record;
            this.root.appendChild(child);
        }

        enableGesture(this.root);
        let timeline = new Timeline;
        timeline.start();

        let children = this.root.children;
        this[STATE].position = 0;

        let t = 0;
        let ax = 0;
        let handler;

        this.root.addEventListener("start", event => {
            timeline.pause();
            clearInterval(handler)
            let progress = (Date.now() - t) / 500;
            if (progress > 1 || t === 0) {
                progress = 0;
            }
            
            ax = ease(progress) * 500 - 500;
            if (progress > 1 || t === 0) {
                ax = 0;
            }
        })

        this.root.addEventListener("tap", event=> {
            this.triggerEvent("click", {
                data: this[ATTRIBUTE].src[this[STATE].position],
                position: this[STATE].position
            })
        })
        this.root.addEventListener("pan", event => {
            let x = event.clientX - event.startX - ax;
            // if x > 0 and x < 250 current = pos
            // else current = pos - 1
            let current = this[STATE].position - Math.round((x - x % 500) / 500);
            current = (current + children.length) % children.length
            for (let offset of [-1, 0, 1]) {
                let pos = (current % children.length + offset + children.length) % children.length;
                children[pos].style.transition = "none";
                children[pos].style.transform = `translateX(${(- pos + offset) * 500 + x % 500}px)`;
            }
        })
        this.root.addEventListener("end", event => {
            timeline.reset();
            timeline.start();
            handler = setInterval(nextPicture, 3000);



            let x = event.clientX - event.startX - ax;
            let current = this[STATE].position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            if (event.isFlick) {
                console.log("fkex")
                if (event.velocity < 0) {
                    direction = Math.ceil((x % 500) / 500);
                } else {
                    direction = Math.floor((x % 500) / 500);
                }
            }

            for (let offset of [-1, 0, 1]) {
                let pos = (current % children.length + offset + children.length) % children.length;
                
                children[pos].style.transition = "none";
                timeline.add(new Animation(children[pos].style, "transform",
                    - pos * 500 + offset * 500 + x % 500, 
                    - pos * 500 + offset * 500 + direction * 500,
                    500, 0, ease, v => `translateX(${v}px)`)
                );
            }

            this[STATE].position = current - direction;
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            
            this.triggerEvent("change", {position: this[STATE].position})
        })


        let nextPicture = () => {
            console.log("nextPicture");
            let children = this.root.children;
            let nextPosition = (this[STATE].position + 1) % children.length;

            let current = children[this[STATE].position];
            let next = children[nextPosition];

            t = Date.now();

            timeline.add(new Animation(current.style, "transform",
                - this[STATE].position * 500, - 500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`));

            timeline.add(new Animation(next.style, "transform",
                500 - nextPosition * 500, - nextPosition * 500, 500, 0, ease, v => `translateX(${v}px)`));

            this[STATE].position = nextPosition;
            this.triggerEvent("change", {position: this[STATE].position})
        }

        handler = setInterval(nextPicture, 3000);

        /*
        this.root.addEventListener("mousedown", event => {
            let children = this.root.children;
            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;

                let current = position - ((x - x % 500) / 500);
                for (let offset of [-1, 0, 1]) {
                    let pos = (current + offset + children.length) % children.length;
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translateX(${(- pos + offset) * 500 + x % 500}px)`;
                }
            };
            let up = event => {
                let x = event.clientX - startX;
                position = position - (Math.round(x / 500));
                position = (position + children.length) % children.length;
                for (let offset of [0, Math.sign(x % 500 - 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    
                    pos = (pos % children.length + children.length) % children.length;
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${(- pos + offset) * 500 }px)`;
                }
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        })
        */


        return this.root;
    }
}