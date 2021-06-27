import { Component, STATE, ATTRIBUTE, createElement } from "./framework";
import { enableGesture } from "../gesture/gesture";

export {STATE, ATTRIBUTE} from "./framework.js"

export class List extends Component {
    constructor() {
        super();
    }
    
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
    }

    render() {
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>).render();
        return this.root;
    }
    appendChild (child) {
        this.template = (child);
        this.render();
    }
}