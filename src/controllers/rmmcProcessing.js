var savoir = require('../models/savoir');
var savoirfaire = require('../models/savoirfaire');
var connaissanceprocedurale = require('../models/connaissanceprocedurale');
var connaissancetheorique = require('../models/connaissancetheorique');
var activite = require('../models/activite');
var job_nomenclature = require('../models/jobs_nomenclature');

//create a function that gets all savoir and remove punctuation at the end of the field nom  if exists
exports.remove_punctuation_savoir = async () => {
    const savoirs = await savoir.find({});
    for (let i = 0; i < savoirs.length; i++) {
        const savoir = savoirs[i];
        savoir.nom = savoir.nom.trim();
        if (savoir.nom.endsWith('.') || savoir.nom.endsWith(',') || savoir.nom.endsWith(';') || savoir.nom.endsWith(':') || savoir.nom.endsWith('!') || savoir.nom.endsWith('?')) {
            savoir.nom = savoir.nom.substring(0, savoir.nom.length - 1)?.trim();
            savoir['syntax_process'] = true;
            await savoir.save();
        }
        else {
            savoir['syntax_process'] = true;
            await savoir.save();
        }
    }
    console.log('ok');
}
exports.remove_punctuation_savoirfaire = async () => {
    const savoirfares = await savoirfaire.find({});
    for (let i = 0; i < savoirfares.length; i++) {
        const savoirfaire = savoirfares[i];
        savoirfaire.nom = savoirfaire.nom.trim();
        if (savoirfaire.nom.endsWith('.') || savoirfaire.nom.endsWith(',') || savoirfaire.nom.endsWith(';') || savoirfaire.nom.endsWith(':') || savoirfaire.nom.endsWith('!') || savoirfaire.nom.endsWith('?')) {
            savoirfaire.nom = savoirfaire.nom.substring(0, savoirfaire.nom.length - 1)?.trim();
            savoirfaire['syntax_process'] = true;
            await savoirfaire.save();
        }
        else {
            savoirfaire['syntax_process'] = true;
            await savoirfaire.save();
        }
    }
    console.log('ok');
}
exports.remove_punctuation_connaissanceprocedurale = async () => {
    const connaissancesprocedurales = await connaissanceprocedurale.find({});
    for (let i = 0; i < connaissancesprocedurales.length; i++) {
        const connaissanceprocedurale = connaissancesprocedurales[i];
        connaissanceprocedurale.nom = connaissanceprocedurale.nom.trim();
        if (connaissanceprocedurale.nom.endsWith('.') || connaissanceprocedurale.nom.endsWith(',') || connaissanceprocedurale.nom.endsWith(';') || connaissanceprocedurale.nom.endsWith(':') || connaissanceprocedurale.nom.endsWith('!') || connaissanceprocedurale.nom.endsWith('?')) {
            connaissanceprocedurale.nom = connaissanceprocedurale.nom.substring(0, connaissanceprocedurale.nom.length - 1)?.trim();
            connaissanceprocedurale['syntax_process'] = true;
            await connaissanceprocedurale.save();
        }
        else {
            connaissanceprocedurale['syntax_process'] = true;
            await connaissanceprocedurale.save();
        }
    }
    console.log('ok');
}
exports.remove_punctuation_connaissancetheorique = async () => {
    const connaissancestheoriques = await connaissancetheorique.find({});
    for (let i = 0; i < connaissancestheoriques.length; i++) {
        const connaissancetheorique = connaissancestheoriques[i];
        connaissancetheorique.nom = connaissancetheorique.nom.trim();
        if (connaissancetheorique.nom.endsWith('.') || connaissancetheorique.nom.endsWith(',') || connaissancetheorique.nom.endsWith(';') || connaissancetheorique.nom.endsWith(':') || connaissancetheorique.nom.endsWith('!') || connaissancetheorique.nom.endsWith('?')) {
            connaissancetheorique.nom = connaissancetheorique.nom.substring(0, connaissancetheorique.nom.length - 1)?.trim();
            connaissancetheorique['syntax_process'] = true;
            await connaissancetheorique.save();
        }
        else {
            connaissancetheorique['syntax_process'] = true;
            await connaissancetheorique.save();
        }
    }
    console.log('ok');
}
exports.remove_punctuation_activite = async () => {
    const activites = await activite.find({});
    for (let i = 0; i < activites.length; i++) {
        const activite = activites[i];
        activite.nom = activite.nom.trim();
        if (activite.nom.endsWith('.') || activite.nom.endsWith(',') || activite.nom.endsWith(';') || activite.nom.endsWith(':') || activite.nom.endsWith('!') || activite.nom.endsWith('?')) {
            activite.nom = activite.nom.substring(0, activite.nom.length - 1)?.trim();
            activite['syntax_process'] = true;
            await activite.save();
        }
        else {
            activite['syntax_process'] = true;
            await activite.save();
        }

    }
    console.log('ok');
}


//create a function that gets all unique noms in savoir and their duplicates in a list
exports.remove_duplicates_savoir = async () => {
    const savoirs = await savoir.aggregate([
        {
            '$group': {
                '_id': '$nom',
                'dupes': {
                    '$push': '$_id'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$match': {
                'count': {
                    '$gt': 1
                }
            }
        }
    ]);
    console.log('savoir', savoirs.length);
    for (let i = 0; i < savoirs.length; i++) {
        const savoir = savoirs[i];
        for (let k = 1; k < savoir.dupes.length; k++) {
            const jobs = await job_nomenclature.find({ 'savoirs': savoir.dupes[k] });
            for (let j = 0; j < jobs.length; j++) {
                let job = jobs[j];
                if (job.savoirs?.length) {
                    console.log('###############################################', savoir.dupes[k]);
                    console.log(job._id, job.savoirs.length);
                    job.savoirs = job.savoirs.filter((s) => savoir.dupes[k].toString() !== s.toString());
                    if (!job.savoirs.find((s) => savoir.dupes[0].toString() == s.toString())) job.savoirs.push(savoir.dupes[0]);
                    console.log(job._id, job.savoirs.length);

                    await job.save();
                }

            }

        }
        // break

    }
    console.log('ok');
}

//create a function that gets all unique noms in savoirfaire and their duplicates in a list
exports.remove_duplicates_savoirfaire = async () => {
    const savoirfares = await savoirfaire.aggregate([
        {
            '$group': {
                '_id': '$nom',
                'dupes': {
                    '$push': '$_id'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$match': {
                'count': {
                    '$gt': 1
                }
            }
        }
    ]);
    console.log('savoirfaire', savoirfares.length);
    for (let i = 0; i < savoirfares.length; i++) {
        const savoirfaire = savoirfares[i];
        for (let k = 1; k < savoirfaire.dupes.length; k++) {
            try {
                const jobs = await job_nomenclature.find({ 'savoirfaires': savoirfaire.dupes[k] });
                for (let j = 0; j < jobs.length; j++) {
                    let job = jobs[j];
                    if (job.savoirfaires?.length) {
                        console.log('###############################################', savoirfaire.dupes[k]);
                        console.log(job._id, job.savoirfaires.length);
                        job.savoirfaires = job.savoirfaires.filter((s) => savoirfaire.dupes[k].toString() !== s.toString());
                        if (!job.savoirfaires.find((s) => savoirfaire.dupes[0].toString() == s.toString())) job.savoirfaires.push(savoirfaire.dupes[0]);
                        console.log(job._id, job.savoirfaires.length);

                        await job.save();
                    }

                }
            }
            catch (e) {
                console.log(e);
                continue;
            }

        }
        // break

    }
    console.log('ok');
}

//create a function that gets all unique noms in connaissanceprocedurale and their duplicates in a list
exports.remove_duplicates_connaissanceprocedurale = async () => {
    const connaissanceprocedurales = await connaissanceprocedurale.aggregate([
        {
            '$group': {
                '_id': '$nom',
                'dupes': {
                    '$push': '$_id'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$match': {
                'count': {
                    '$gt': 1
                }
            }
        }
    ]);
    console.log('connaissanceprocedurale', connaissanceprocedurales.length);
    for (let i = 0; i < connaissanceprocedurales.length; i++) {
        const connaissanceprocedurale = connaissanceprocedurales[i];
        for (let k = 1; k < connaissanceprocedurale.dupes.length; k++) {
            try {
                const jobs = await job_nomenclature.find({ 'connaissanceprocedurales': connaissanceprocedurale.dupes[k] });
                for (let j = 0; j < jobs.length; j++) {
                    let job = jobs[j];
                    if (job.connaissanceprocedurales?.length) {
                        console.log('###############################################', connaissanceprocedurale.dupes[k]);
                        console.log(job._id, job.connaissanceprocedurales.length);
                        job.connaissanceprocedurales = job.connaissanceprocedurales.filter((s) => connaissanceprocedurale.dupes[k].toString() !== s.toString());
                        if (!job.connaissanceprocedurales.find((s) => connaissanceprocedurale.dupes[0].toString() == s.toString())) job.connaissanceprocedurales.push(connaissanceprocedurale.dupes[0]);
                        console.log(job._id, job.connaissanceprocedurales.length);

                        await job.save();
                    }

                }
            }
            catch (e) {
                console.log(e);
                continue;
            }

        }
        // break

    }
    console.log('ok');
}

//create a function that gets all unique noms in connaissancetheorique and their duplicates in a list
exports.remove_duplicates_connaissancetheorique = async () => {
    const connaissancetheoriques = await connaissancetheorique.aggregate([
        {
            '$group': {
                '_id': '$nom',
                'dupes': {
                    '$push': '$_id'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$match': {
                'count': {
                    '$gt': 1
                }
            }
        }
    ]);
    console.log('connaissancetheorique', connaissancetheoriques.length);
    for (let i = 0; i < connaissancetheoriques.length; i++) {
        const connaissancetheorique = connaissancetheoriques[i];
        for (let k = 1; k < connaissancetheorique.dupes.length; k++) {
            try {
                const jobs = await job_nomenclature.find({ 'connaissancetheoriques': connaissancetheorique.dupes[k] });
                for (let j = 0; j < jobs.length; j++) {
                    let job = jobs[j];
                    if (job.connaissancetheoriques?.length) {
                        console.log('###############################################', connaissancetheorique.dupes[k]);
                        console.log(job._id, job.connaissancetheoriques.length);
                        job.connaissancetheoriques = job.connaissancetheoriques.filter((s) => connaissancetheorique.dupes[k].toString() !== s.toString());
                        if (!job.connaissancetheoriques.find((s) => connaissancetheorique.dupes[0].toString() == s.toString())) job.connaissancetheoriques.push(connaissancetheorique.dupes[0]);
                        console.log(job._id, job.connaissancetheoriques.length);

                        await job.save();
                    }

                }

            }
            catch (e) {
                console.log(e);
                continue;
            }
        }

    }
    console.log('ok');
}

//create a function that gets all unique noms in activite and their duplicates in a list
exports.remove_duplicates_activite = async () => {
    const activites = await activite.aggregate([
        {
            '$group': {
                '_id': '$nom',
                'dupes': {
                    '$push': '$_id'
                },
                'count': {
                    '$sum': 1
                }
            }
        }, {
            '$match': {
                'count': {
                    '$gt': 1
                }
            }
        }
    ]);
    console.log('activite', activites.length);
    for (let i = 0; i < activites.length; i++) {
        const activite = activites[i];
        for (let k = 1; k < activite.dupes.length; k++) {
            try {


                const jobs = await job_nomenclature.find({ 'activites': activite.dupes[k] });
                for (let j = 0; j < jobs.length; j++) {
                    let job = jobs[j];
                    if (job.activites?.length) {
                        console.log('###############################################', activite.dupes[k]);
                        console.log(job._id, job.activites.length);
                        job.activites = job.activites.filter((s) => activite.dupes[k].toString() !== s.toString());
                        if (!job.activites.find((s) => activite.dupes[0].toString() == s.toString())) job.activites.push(activite.dupes[0]);
                        console.log(job._id, job.activites.length);
                        await job.save();
                    }

                }

            }
            catch (e) {
                console.log(e);
                continue;
            }

        }

    }
    console.log('ok');
}



//get all connaissancetheoriques that have no job_nomenclature relation and delete them
exports.delete_connaissancetheoriques = async () => {
    const connaissancetheoriques = await connaissancetheorique.find({});
    console.log('connaissancetheoriques', connaissancetheoriques.length);
    for (let i = 0; i < connaissancetheoriques.length; i++) {
        const connaissancetheorique = connaissancetheoriques[i];
        const jobs = await job_nomenclature.find({ 'connaissancetheoriques': connaissancetheorique._id });
        if (!jobs.length) {
            await connaissancetheorique.delete();
            console.log('deleted', connaissancetheorique._id);
        }
    }
    console.log('ok');
}
//get all connaissanceprocedurales that have no job_nomenclature relation and delete them
exports.delete_connaissanceprocedurales = async () => {
    const connaissanceprocedurales = await connaissanceprocedurale.find({});
    console.log('connaissanceprocedurales', connaissanceprocedurales.length);
    for (let i = 0; i < connaissanceprocedurales.length; i++) {
        const connaissanceprocedurale = connaissanceprocedurales[i];
        const jobs = await job_nomenclature.find({ 'connaissanceprocedurales': connaissanceprocedurale._id });
        if (!jobs.length) {
            await connaissanceprocedurale.delete();
            console.log('deleted', connaissanceprocedurale._id);
        }
    }
    console.log('ok');
}
//get all activites that have no job_nomenclature relation and delete them
exports.delete_activites = async () => {
    const activites = await activite.find({});
    console.log('activites', activites.length);
    for (let i = 0; i < activites.length; i++) {
        const activite = activites[i];
        const jobs = await job_nomenclature.find({ 'activites': activite._id });
        if (!jobs.length) {
            await activite.delete();
            console.log('deleted', activite._id);
        }
    }
    console.log('ok');
}
//get all savoirfaire that have no job_nomenclature relation and delete them
exports.delete_savoirfaires = async () => {
    const savoirfaires = await savoirfaire.find({});
    console.log('savoirfaires', savoirfaires.length);
    for (let i = 0; i < savoirfaires.length; i++) {
        const savoirfair = savoirfaires[i];
        const jobs = await job_nomenclature.find({ 'savoirfaires': savoirfair._id });
        if (!jobs.length) {
            await savoirfair.delete();
            console.log('deleted', savoirfair._id);
        }
    }
    console.log('ok');
}
//get all savoirs that have no job_nomenclature relation and delete them
exports.delete_savoirs = async () => {
    const savoirs = await savoir.find({});
    console.log('savoirs', savoirs.length);
    for (let i = 0; i < savoirs.length; i++) {
        const savoir = savoirs[i];
        const jobs = await job_nomenclature.find({ 'savoirs': savoir._id });
        if (!jobs.length) {
            await savoir.delete();
            console.log('deleted', savoir._id);
        }
    }
    console.log('ok');
}

//get all jobs and for each job check if savoirs, savoirfaires, connaissancetheoriques, connaissanceprocedurales, activites exist their collection and if not delete them from the job
exports.delete_job_nomenclature_orphan_refrences = async () => {
    const jobs = await job_nomenclature.find({});
    console.log('jobs', jobs.length);
    for (let i = 0; i < jobs.length; i++) {
        for(let j=0;j<jobs[i].savoirs.length;j++){
            const savoirs = await savoir.findById(jobs[i].savoirs[j]);
            if(!savoirs){
                console.log('savoirs',jobs[i].savoirs[j])
                jobs[i].savoirs.splice(j,1);
                j--;
            }
        }
        for(let j=0;j<jobs[i].savoirfaires.length;j++){
            const savoirfaires = await savoirfaire.findById(jobs[i].savoirfaires[j]);
            if(!savoirfaires){
                console.log('savoirfaires',jobs[i].savoirfaires[j])
                jobs[i].savoirfaires.splice(j,1);
                j--;
            }
        }
        for(let j=0;j<jobs[i].connaissancetheoriques.length;j++){
            const connaissancetheoriques = await connaissancetheorique.findById(jobs[i].connaissancetheoriques[j]);
            if(!connaissancetheoriques){
                console.log('connaissancetheoriques',jobs[i].connaissancetheoriques[j])
                jobs[i].connaissancetheoriques.splice(j,1);
                j--;
            }
        }
        for(let j=0;j<jobs[i].connaissanceprocedurales.length;j++){
            const connaissanceprocedurales = await connaissanceprocedurale.findById(jobs[i].connaissanceprocedurales[j]);
            if(!connaissanceprocedurales){
                console.log('connaissanceprocedurales',jobs[i].connaissanceprocedurales[j])
                jobs[i].connaissanceprocedurales.splice(j,1);
                j--;
            }
        }
        for(let j=0;j<jobs[i].activites.length;j++){
            const activites = await activite.findById(jobs[i].activites[j]);
            if(!activites){
                console.log('activites',jobs[i].activites[j])
                jobs[i].activites.splice(j,1);
                j--;
            }
        }
        await jobs[i].save();
    }
    console.log('ok');
}
