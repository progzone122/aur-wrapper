import AurWebWrapper from "../index";

let wrapper: AurWebWrapper = new AurWebWrapper({
    proxy: false
});

wrapper.rpc.getPackageInfo("warp-gui").then((info) => {
    if (info.success) {
        console.log(info);
    } else {
        console.error(info)
    }
})
wrapper.rpc.getPackagesInfo(["warp-gui", "mixerdialog"]).then((info) => {
    if (info.success) {
        console.log(info);
    } else {
        console.error(info)
    }
})