
// const Component = require("./framework.js");
import { createElement } from "./framework.js"
import { Carousel } from "./Carousel"
import { Button } from "./Button"
import { List } from "./List"
// import {Timeline, Animation} from "./animation"

let d = [
    {
        image: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
        url: "https://time.geekbang.org",
        title: "蓝猫"
    },
    {
        image: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
        url: "https://time.geekbang.org"
    },
    {
        image: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
        url: "https://time.geekbang.org"
    },
    {
        image: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
        url: "https://time.geekbang.org"
    },
];
// let a = <Carousel src={d}
//     onChange={event => console.log(event.detail.position)}
//     onClick={event => window.location.href = event.detail.data.url} />
// a.mountTo(document.body);

// let tl = new Timeline();
// window.tl = tl;
// window.animation = new Animation({ set a(v) { console.log(v) } }, "a", 0, 100, 1000, null);
// tl.start();
let a = <List data={d} >
    {(record) =>
        <div>
            <img src={record.image}></img>
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>
a.mountTo(document.body);