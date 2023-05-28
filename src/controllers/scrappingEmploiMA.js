const axios = require("axios");
const { create_offer_html, get_offer_html, update_offer_html } = require("../services/offer_html.service");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const helper = require('../helpers/helper');
const puppeteer = require("puppeteer");

//base links
//website link
const website = "www.emploi.ma";
//the search page url is split into 2 parts since the arg we inject is in between the url
const searchpage_1 = "https://www.emploi.ma/recherche-jobs-maroc?page=";
//stoping after n duplicates
const stop_count = 10;
//time to sleep in between scrapping processes
//get html of an offer to scrap
exports.emploima_html = async (req, res, next) => {
    // res.status(201).json('in bg');
    while (true) {
        //init counting replicates
        let count_replicates = 0;
        for (let i = 0; i < 200; i++) {
            try {
                //check to put process too sleep
                if (stop_count <= count_replicates) {
                    // console.log(count_replicates, stop_count)
                    //sleep for an hour
                    // console.log('🚀 emploi ma nothing new sleep for an hour ')
                    await new Promise(r => setTimeout(r, 1000 * 60 * 60));
                    //reset search
                    i = 1;
                    //reset duplicates count
                    count_replicates = 0;
                }
                // console.log(i);
                //get page
                const resp = await axios.get(searchpage_1 + i);
                var dom = new JSDOM(resp.data);
                var document = dom.window.document;
                //check if page exists
                if (document.querySelector("#noresults-search-box > div > h2")?.textContent?.includes("nous n'avons trouvé aucune offre correspondant à votre recherche")) {
                    count_replicates = stop_count; // force stoppage and re-init process
                    continue;
                }
                //get search page offers
                const table_elements = document.querySelectorAll("div > div > div.col-lg-5.col-md-5.col-sm-5.col-xs-12.job-title > h5 > a");
                for (let j = 0; j < table_elements.length; j++) {
                    try {
                            //  console.log(table_elements[j].href)
                            const offer_exists = await get_offer_html({ website: website, source_id: table_elements[j].href.split('/').pop()});
                            if (offer_exists) {
                                count_replicates += 1;
                            }
                            else {
                                const resp_offer = await axios.get('https://www.emploi.ma' + table_elements[j].href);

                                const offer_html = {
                                    website: website,
                                    source_id: table_elements[j].href.split('/').pop(),
                                    link: 'https://www.emploi.ma' + table_elements[j].href,
                                    html: resp_offer.data,
                                };
                                await create_offer_html(offer_html);
                            }
                    }
                    catch (e) {
                        // console.log(' error scrapping page : ', i, ' offer : ', j, ' error : ', e);
                    }

                }
            } catch (e) {
                // console.log('🚀 Error !!!!!!!', e);
                // console.log('🚀 error emploi ma sleep for an hour ')
                await new Promise(r => setTimeout(r, 1000 * 60 * 60));
            }
        }
        //sleep for an hour before next scraping
        await new Promise(r => setTimeout(r, 1000 * 60 * 60));
    }
};