const axios = require("axios");
const { create_offer_html, get_offer_html, update_offer_html } = require("../services/offer_html.service");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var data_array = require("../data/marocannonce_db.json");

//base links
//website link
const website = "www.marocannonces.com";
//the search page url is split into 2 parts since the arg we inject is in between the url
const searchpage_1 = "https://www.marocannonces.com/categorie/309/Emploi/Offres-emploi/";
const searchpage_2 = ".html"
//stoping after n duplicates
const stop_count = 10;
//time to sleep in between scrapping processes
//get html of an offer to scrap
exports.marocannonces_html = async (req, res, next) => {
    // res.status(201).json('in bg');
    while (true) {
        //init counting replicates
        let count_replicates = 0;
        for (let i = 1; i < 1000; i++) {
            try {
                //check to put process too sleep
                if (stop_count <= count_replicates) {
                    // console.log(count_replicates, stop_count)
                    //sleep for an hour
                    console.log('🚀 maroc annonces nothing new sleep for an hour ')
                    await new Promise(r => setTimeout(r, 1000 * 60 * 60));
                    //reset search
                    i = 1;
                    //reset duplicates count
                    count_replicates = 0;
                }
                // console.log(i);
                //get page
                const resp = await axios.get(searchpage_1 + i + searchpage_2);
                var dom = new JSDOM(resp.data);
                var document = dom.window.document;
                //check if page exists
                if (document.querySelector("#text > h2")?.textContent?.includes("La page que vous avez demandée n'existe pas")) {
                    count_replicates = stop_count; // force stoppage and re-init process
                    continue;
                }
                //get search page offers
                const table_elements = document.querySelectorAll("a");
                for (let j = 0; j < table_elements.length; j++) {
                    try {
                        if (table_elements[j]?.href?.includes('Offres-emploi/annonce/')) {
                            //  console.log(table_elements[j].href.split('/')[7])
                            const offer_exists = await get_offer_html({ website: website, source_id: table_elements[j].href.split('/')[7] });
                            if (offer_exists) {
                                count_replicates += 1;
                            }
                            else {
                                const resp_offer = await axios.get(table_elements[j].href);

                                const offer_html = {
                                    website: website,
                                    source_id: table_elements[j].href.split('/')[7],
                                    link: table_elements[j].href,
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
                console.log('🚀 error maroc annonces sleep for an hour ')
                await new Promise(r => setTimeout(r, 1000 * 60 * 60));
            }
        }
        //sleep for an hour before next scraping
        await new Promise(r => setTimeout(r, 1000 * 60 * 60));
    }
};

exports.marocannonces_html_from_file = async (req, res, next) => {

    try {
        for (let i = 0; i< data_array.length; i++){
            try {
                const offer_exists = await get_offer_html({ website: website, source_id: data_array[i].lien_url.split('/')[7] });
                if (!offer_exists) {
                    //get offer html 
                    const resp_offer = await axios.get(data_array[i].lien_url);

                    const offer_html = {
                        website: website,
                        source_id: data_array[i].lien_url.split('/')[7],
                        link: data_array[i].lien_url,
                        html: resp_offer.data,
                    };
                    const offer = await create_offer_html(offer_html);
                    console.log(offer._id)
                }
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
};