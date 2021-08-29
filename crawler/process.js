module.exports = (()=>{
	const puppeteer = require("puppeteer");
	const querystring = require("querystring");

	let browser;
	async function init(debugMode=false){
		console.log("init puppeteer");
		browser = await puppeteer.launch({ headless: !debugMode, devtools: debugMode, defaultViewport: null });
	}
	
	
	async function start(host, target) {
		let page = await browser.newPage();
	
		page = await goto(page, target);
	
		if(page !== undefined){
			const result = await parser(page);
			await sendResult(host, result);
		}
		else{
			sendFail();
		}
	
	
	}
	
	
	async function goto(page, url){
		return await page.goto(url)
			.then(()=>{
				console.log(`move to ${url}`);
				return page;
			})
			.catch((e) => {
				console.log("error here");
				console.log(e);
				return undefined;
			});
	}
	
	async function parser(page){
		// eslint-disable-next-line no-undef
		let bodyHTML = await page.evaluate(() => document.body.innerText)
			.then((result)=>{
				return JSON.parse(result).data;
			});
	
		return bodyHTML;
	}
	
	async function sendResult(host, parsedJobList){
		let requestSender = await browser.newPage();
	
		for(let job of parsedJobList){
			let postData = {
				company_name: job.company.name,
				page_id: job.id,
				company_address: job.address.country + job.address.location,
				hiring_position: job.position
			};
				
			await requestSender.setRequestInterception(true);
	
			requestSender.once("request", interceptedRequest =>{
				const data = {
					"method": "POST",
					"postData": querystring.stringify(postData),
					"headers": {
						...interceptedRequest.headers(),
						"Content-Type": "application/x-www-form-urlencoded"
					},
				};
	
				interceptedRequest.continue(data);
			});
			console.log(`${postData.page_id} data sent`);
			await requestSender.goto(host);
			await requestSender.setRequestInterception(false);
		}
	
		await requestSender.close();
	}
	
	function sendFail(){
	
	}


	return{
		init: async ()=>{
			await init();
		},
		start: async (target)=>{
			await start(target);
		}
	};

})();	