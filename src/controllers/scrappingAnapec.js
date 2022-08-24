const axios = require("axios");
const { create_offer_html, get_offer_html, update_offer_html } = require("../services/offer_html.service");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const helper = require('../helpers/helper');
const puppeteer = require("puppeteer");

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
    while (true) {
        //init counting replicates
        let count_replicates = 0;
        for (let i = 1; i < 300; i++) {
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
                        //init and lunch puppeteer browser 
                        var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                        var page = (await browser.pages())[0];
                        page.setDefaultNavigationTimeout(0);
                        // get project url content
                        await page.goto(offer_link, { waitUntil: 'networkidle2' });
                        //wait for page to load
                        await page.waitForTimeout(3000);
                        const page_data = await page.content();

                        const offer_html = {
                            website: website,
                            source_id: offer_elts[1].querySelector('a').href.split('/')[5],
                            offer_date: offer_elts[2].textContent,
                            offer_title: offer_elts[3].textContent,
                            nb_posts: offer_elts[4].textContent,
                            link: offer_link,
                            html: page_data,
                        };
                        await create_offer_html(offer_html);
                        await browser.close();
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
    }
};

exports.anapec_offer = async (req, res, next) => {
    // res.status(201).json('in bg');
    while (true) {
        //get one offer html from db
        const offer_html = await get_offer_html({
            config_html_processing: false,
            dev_config_html_processing: false,
            config_error_processing: false,
        });
        try {
            //parse html content
            console.log(offer_html.html)
            var dom = new JSDOM(offer_html.html);
            var document = dom.window.document;
            //get title
            const title = document.querySelector("p.intitule_poste")?.textContent;
            //get sector
            const sector = document.querySelector("p.secteur_activite")?.textContent;
            //get contract
            const contract = document.querySelector(".type-contrat")?.textContent;
            //salaire 
            const salaire = document.querySelector(".salaire")?.textContent;
            //get city
            const city = document.querySelector(".ville")?.textContent;
            //get desc
            const desc_1 = document.querySelector(".caracteristiques-poste")?.textContent;
            const desc_2 = document.querySelector(".profile-description")?.textContent;
            const desc = desc_1 + '\n\n\n\n' + desc_2;
            //get experience
            const experience = document.querySelector(".duree-experience")?.textContent;
            //get emploim-metier
            const emploim = document.querySelector(".emploim-metier")?.textContent;
            //get langues
            const lngs = document.querySelector(".emploi-langue")?.textContent;
            //get diplome
            const diplome = document.querySelector(".diplome-detail")?.textContent;
            const offer_data = {
                title: title,
                desc: desc,
                contract: contract,
                sector: sector,
                city: city,
                experience: experience,
                emploim: emploim,
                lngs: lngs,
                diplome: diplome,
                salary: salaire,
            }
            console.log(offer_data)

        }
        catch (err) {
            await update_offer_html({ _id: offer_html._id }, { config_error_processing: true });
            console.log('error offer : ' + offer_html._id)
        }



        break;
    }
};