// example url
// https://www.wanted.co.kr/api/v4/jobs?1628970613194&country=kr&tag_type_id=872&job_sort=job.latest_order&locations=all&years=-1&limit=20&offset=480
// base url
// https://www.wanted.co.kr/api/v4/jobs?
// +
// linux  timestamp in milli sec
// 1628970613194
// + 
// options(korea, server developer, sort in latest, all location, new)
// +
// get 20 count hiring
// +
// starting offset
// 480


const querystring = require("querystring");
const puppeteer = require("puppeteer");
const string = require("./common/constants");
// const axios = require("axios");


async function main(){
    let browser = await puppeteer.launch({ headless: true, devtools: true, defaultViewport: null });
    let page = await browser.newPage();
    let requestSender = await browser.newPage();


    let status = true;
    let offset = 0;
    let jobPageList = [];
    
    while(status){

        const timeStamp = Date.now();
        const tempTarget = String(string.url.baseURL) + timeStamp + string.url.baseURLgetQueryString + offset;
        offset += 20;

        console.log(tempTarget);
        await page.goto(tempTarget);
        // eslint-disable-next-line no-undef
        let bodyHTML = await page.evaluate(() => document.body.innerText);
        const parsedJobList = JSON.parse(bodyHTML).data;

        // console.log(JSON.parse(bodyHTML));
        for(let  job of parsedJobList){
            if(!parsedJobList.includes(job.id)){
                jobPageList.push(job.id);
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
                await requestSender.goto(string.url.targetURL);
                await requestSender.setRequestInterception(false);

            }
            else{
                status = false;
            }
        }

    
        status = false;
    }

}


main();