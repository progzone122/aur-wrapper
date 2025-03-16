import AurWebWrapper from "../index";

let wrapper: AurWebWrapper = new AurWebWrapper({
    proxy: false
});

wrapper.rss.getLatestPackages().then((packages) => {
    if (packages.success) {
        console.log(packages.data);
    } else {
        console.error(packages.error);
    }
})