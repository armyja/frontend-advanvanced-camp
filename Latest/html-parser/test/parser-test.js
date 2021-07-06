var assert = require('assert');
import { parseHTML }  from '../src/parser.js'


describe("parse html:", function() {
    it('<a></a>', function () {
        let tree = parseHTML('<a></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a href="//www.baidu.com"></a>', function () {
        let tree = parseHTML('<a href="//www.baidu.com"></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a href></a>', function () {
        let tree = parseHTML('<a href></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a href id></a>', function () {
        let tree = parseHTML('<a href id></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a href="abc" id></a>', function () {
        let tree = parseHTML('<a href="abc" id></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a id="abc"></a>', function () {
        let tree = parseHTML('<a id="abc"></a>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a id="abc"/>', function () {
        let tree = parseHTML('<a id="abc"/>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a id="abc"class="aa"/>', function () {
        let tree = parseHTML('<a id="abc"class="aa"/>');
        assert.strictEqual(tree.children[0].attributes[1].value, "aa");
        assert.strictEqual(tree.children[0].attributes[1].name, "class");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<a id=\'abc\'/>', function () {
        let tree = parseHTML('<a id=\'abc\'/>');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
    })
    it('<a />', function () {
        let tree = parseHTML('<a />');
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<A />', function () {
        let tree = parseHTML('<A />');
        assert.strictEqual(tree.children[0].tagName, "A");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    })
    it('<>', function () {
        let tree = parseHTML('<>');
        assert.strictEqual(tree.children.length, 0);
    })
    it('long', function () {
        let tree = parseHTML(
`<html maaa=a>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`
        );
        
        assert.strictEqual(tree.children[0].tagName, "html");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 3);
        
})
})
