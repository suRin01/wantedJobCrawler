module.exports = (()=>{
	const string = require("../common/constants");
	const process = require("../crawler/process");

	async function commandService(commandData){

		if(commandData.apiKey === string.keys.apiKey){
			let offset = 0;
			const timeStamp = Date.now();
			const tempTarget = String(string.url.baseURL) + timeStamp + string.url.baseURLgetQueryString + offset;

		
			await process.init();
		
			await process.start(commandData.server, tempTarget);

			return true;

		}
		else{
			console.log("Authentication failed.");
			return false;

		}
	}


	return{
		commandService: async (commandData)=>{
			await commandService(commandData);
		}
	};


})();