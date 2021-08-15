function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
define("strings", {
    waitUntil: "networkidle0",
    elementInnerContentType:{
        link: "href",
        text: "innerText"
    },
    commentTage: "a.btn_comment"
    
});


