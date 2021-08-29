module.exports = (()=>{

	const service = require("../serivce/commandService");

	async function parseCommand(request, response){
		const body = request.body;
		const data = {
			server: body.server,
			apiKey: body.apiKey
		};

		const result = await service.commandService(data);

		if(result === true){
			response.json({status: "success"});
		}
		else{
			response.json({status: "failed"});
		}
	}


	return{
		parseCommand: async (request, response)=>{
			await parseCommand(request, response);
		}
	};


})();