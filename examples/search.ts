import AurWebWrapper from "../index";

let wrapper: AurWebWrapper = new AurWebWrapper({
    proxy: false
});

wrapper.rpc.search("warp").then(result => {
    if (result.success) {
        console.log(result.data.results.slice(0, 2));
    }
});