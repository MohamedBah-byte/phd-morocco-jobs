const axios = require("axios");
const { create_offer_html, get_offer_html } = require("../services/offer_html.service");
const jsdom = require("jsdom");
const { keyDefinitions } = require("puppeteer");
const { JSDOM } = jsdom;

//base links
//website link
const website = "http://www.anapec.org";
//the search page url is split into 2 parts since the arg we inject is in between the url
const anapec_searchpage_1 = "http://www.anapec.org/sigec-app-rv/chercheurs/resultat_recherche/page:";
const anapec_searchpage_2 = "/tout:all/language:fr"
//the offer  mobile view version is more structured than the web version
const anapec_offer_mobile = "http://m.anapec.org/mobile/offer.html?id="
//stoping after n duplicates
const stop_count = 15;
//time to sleep in between scrapping processes
//get html of an offer to scrap
exports.anapec_html = async (req, res, next) => {
    // res.status(201).json('in bg');
    //init counting replicates
    let count_replicates = 0;
    for (let i = 1; i < 500; i++) {
        try {
            //check to put process too sleep
            if (stop_count == count_replicates) {
                console.log(count_replicates, stop_count)
                //sleep for an hour
                console.log('🚀 anapec nothing new sleep for an hour ')
                await new Promise(r => setTimeout(r, 1000 * 60 * 60));
                //reset search
                i = 1;
                //reset duplicates count
                count_replicates = 0;
            }
            console.log(i)
            //get page
            const resp = await axios.get(anapec_searchpage_1 + i + anapec_searchpage_2);
            var dom = new JSDOM(resp.data);
            var document = dom.window.document;
            //get search page offers
            const table_elements = document.querySelectorAll("#myTable > tbody > tr");
            for (let j = 0; j < table_elements.length; j++) {
                try {
                    //get all offers elements from search page
                    const offer_elts = table_elements[j].querySelectorAll('td');
                    const offer_link = anapec_offer_mobile + offer_elts[1].querySelector('a').href.split('/')[5];
                    //check if offer exists in db and if so skip to next one
                    const offer_exists = await get_offer_html({ website: website, source_id: offer_elts[1].querySelector('a').href.split('/')[5] });
                    if (offer_exists) {
                        count_replicates += 1;
                        continue;
                    }
                    //get offer html
                    axios.get(offer_link).then(async (offer_page) => {
                        //create offer object
                        console.log(website)
                        const offer_html = await create_offer_html({
                            website: website,
                            source_id: offer_elts[1].querySelector('a').href.split('/')[5],
                            offer_date: offer_elts[2].textContent,
                            offer_title: offer_elts[3].textContent,
                            nb_posts: offer_elts[4].textContent,
                            link: offer_link,
                            html: offer_page.data,
                        });
                    });
                }
                catch (e) {
                    console.log(' error scrapping page : ', i, ' offer : ', j, ' error : ', e);
                }

            }
        } catch (e) {
            console.log('🚀 Error !!!!!!!', e);
            console.log('🚀 error anapec sleep for an hour ')
            await new Promise(r => setTimeout(r, 1000 * 60 * 60));
        }

    }


};