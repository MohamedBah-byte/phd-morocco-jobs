const axios = require("axios");
const { create_offer_html, get_offer_html, update_offer_html } = require("../services/offer_html.service");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//base links
//website link
const website = "www.linkedin.com";
//the search page url is split into 2 parts since the arg we inject is in between the url
const searchpage_1 = "https://fr.linkedin.com/jobs/search?keywords=&location=Maroc&locationId=&geoId=102787409&f_TPR=r86400&start=";
const step = 25;
//job api : "https://fr.linkedin.com/jobs-guest/jobs/api/jobPosting/3388481587?refId=AAYuuvOeZ/VAxYizoja6fQ==&trackingId=YHFSzXyj1HRBpRgSiTGk/Q=="
const job_api = "https://fr.linkedin.com/jobs-guest/jobs/api/jobPosting/";
//stoping after n duplicates
const stop_count = 10;
//time to sleep in between scrapping processes
//get html of an offer to scrap
exports.linkedin_html = async (req, res, next) => {
    // res.status(201).json('in bg');
    while (true) {
        //init counting replicates
        // let count_replicates = 0;
        for (let i = 0; i < 30; i++) {
            try {

                //get page
                const resp = await axios.get(searchpage_1 + (i * step));
                // const random_sleep = Math.floor(Math.random() * 10) + 1;
                await new Promise(r => setTimeout(r, 20000 ));
                // if negative response from api lay low and restart in 4 hours
                if (resp.status !== 200) {
                    console.log('🚀 error maroc annonces sleep for 4 hours');
                    await new Promise(r => setTimeout(r, 1000 * 60 * 60 * 4));
                    break;
                }
                var dom = new JSDOM(resp.data);
                var document = dom.window.document;
                //check if page exists
                //get search page offers
                const table_elements = document.querySelectorAll("li");
                for (let j = 0; j < table_elements.length; j++) {
                    try {
                        if (table_elements[j].querySelector('div').getAttribute('data-entity-urn')) {


                            //get job tokens 
                            const job_id = table_elements[j].querySelector('div').getAttribute('data-entity-urn').split(':').pop();
                            const job_tracking = table_elements[j].querySelector('div').getAttribute('data-tracking-id');
                            const job_token = table_elements[j].querySelector('div').getAttribute('data-search-id');
                            // console.log(job_id, job_tracking, job_token);
                            const offer_exists = await get_offer_html({ website: website, source_id: job_id });
                            if (offer_exists) {
                                continue;
                            }
                            else {
                                const resp_offer = await axios.get(job_api + job_id + '?refId=' + job_token + '&trackingId=' + job_tracking);
                                // const random_sleep_job = Math.floor(Math.random() * 10) + 1;
                                await new Promise(r => setTimeout(r, 1000 * 10));
                                const offer_html = {
                                    website: website,
                                    source_id: job_id,
                                    link: job_api + job_id + '?refId=' + job_token + '&trackingId=' + job_tracking,
                                    html: resp_offer.data,
                                };
                                await create_offer_html(offer_html);
                            }
                        }
                    }


                    catch (e) {
                        console.log(' error scrapping page : ', i, ' offer : ', j, ' error : ', e);
                    }

                }
            } catch (e) {
                console.log('🚀 Error !!!!!!!', e);
                console.log('🚀 error maroc annonces sleep for a day')
                await new Promise(r => setTimeout(r, 1000 * 60 * 60 * 24));
            }
        }
        //sleep for 4 hours before next scraping
        await new Promise(r => setTimeout(r, 1000 * 60 * 60 * 4));
    }
};