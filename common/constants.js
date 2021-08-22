function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("url", {
    baseURL: "https://www.wanted.co.kr/api/v4/jobs?",
    baseURLgetQueryString: "&country=kr&tag_type_id=872&job_sort=job.latest_order&locations=all&years=-1&limit=20&offset=",
    targetURL: "http://127.0.0.1:3000/job",
});