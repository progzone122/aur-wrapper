import AurWebWrapper from "../index";

let wrapper: AurWebWrapper = new AurWebWrapper({
    proxy: false
})

wrapper.rpc.searchSuggest("warp", "pkgbase").then(result => {
    console.log(result);
});

wrapper.rpc.searchSuggest("warp", "pkgname").then(result => {
    console.log(result);
});