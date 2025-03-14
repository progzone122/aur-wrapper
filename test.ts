import AurWebWrapper from "./index";

import {
	isWrapperError
} from "./types/error";

let wrapper = new AurWebWrapper({
	proxy: false
});

// let resp = await wrapper.rpc.search("warp");
// if (!isWrapperError(resp)) {
// 	console.log(resp.results);
// } else {
// 	console.error(`ERROR: ${resp.message}`)
// }

await wrapper.rpc.searchSuggest("warpasdasdasd").then((results) => {
	console.log(results);
});