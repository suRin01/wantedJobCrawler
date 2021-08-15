
let target = "https://www.wanted.co.kr/api/v4/jobs?";



const puppeteer = require("puppeteer");
const axios = require("axios");

async function main(){
    let browser = await puppeteer.launch({ headless: true, devtools: true, defaultViewport: null });
    let page = await browser.newPage();

    let status = true;
    let offset = 0;
    let jobPageList = [];
    
    while(status){
        // example url
        // https://www.wanted.co.kr/api/v4/jobs?1628970613194&country=kr&tag_type_id=872&job_sort=job.latest_order&locations=all&years=-1&limit=20&offset=480
        // base url
        // https://www.wanted.co.kr/api/v4/jobs?
        // +
        // linux  timestamp in mill sec
        // 1628970613194
        // + 
        // options(korea, server developer, sort in latest, all location, new)
        // +
        // get 20 count hiring
        // +
        // starting offset
        // 480

        const timeStamp = Date.now();
        const tempTarget = target + timeStamp + "&country=kr&tag_type_id=872&job_sort=job.latest_order&locations=all&years=-1&limit=20&" + offset;
        offset += 20;

        await page.goto(tempTarget);
        // eslint-disable-next-line no-undef
        let bodyHTML = await page.evaluate(() => document.body.innerText);
        const parsedJobList = JSON.parse(bodyHTML).data;


        // console.log(JSON.parse(bodyHTML));
        for(let idx=0, len = parsedJobList.length; idx<len ; idx++){
            console.log(parsedJobList[idx].id);
            if(!parsedJobList.includes(parsedJobList[idx].id)){
                jobPageList.push(parsedJobList[idx].id);

                // company name:    parsedJobList[idx].company.name
                // hiring page id:  parsedJobList[idx].id
                // company address: parsedJobList[idx].address.country + parsedJobList[idx].address.location
                // position:        parsedJobList[idx].position
                // 
                
                axios.post(
                    "http://127.0.0.1:3000/postjob",{
                        company_name: parsedJobList[idx].company.name,
                        page_id: parsedJobList[idx].id,
                        company_address: parsedJobList[idx].address.country + parsedJobList[idx].address.location,
                        hiring_position: parsedJobList[idx].position
                    }
                ).then((res)=>{
                    console.log(res);
                });


            }
            else{
                status = false;
                break;
            }
        }

        console.log(jobPageList);


        
    
        status = false;
    }




}


main();