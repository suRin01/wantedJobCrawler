
const main = (()=>{
	const express = require("express");
	const commandRouter = require("./router/commandRouter");

	function init(){
		const app = express();
		const port = 5000;
		app.use(express.json());
		app.use(express.urlencoded());
		app.use("/", commandRouter);
		app.listen(port, ()=>{
			console.log(`server start on ${port}.`);
		});
	}

	return{
		init: ()=>{
			init();
		}
	};
	
})();

main.init();