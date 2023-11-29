import { getAccount, getJson } from "serpapi";
import Validate from './Validate'
import { ObjectId } from "mongodb";

export default class Serp {

    constructor(db) {
        this.db = db;
    }

    async addToken(userId, data) {

        let schema = new Validate.Schema({
            key: { type: 'string', required: true },
        });
    
        let validation = schema.validate(data);
        if(validation.errorCount() > 0)  return { status: 422, body: { errors: validation.errors } }
        let body = validation.body;

        try {
            let serpAccountInfo = await getAccount({ api_key: body.key });

            await this.db.collection('serp-tokens').updateOne(
                { user: userId, api_key: body.key },
                {
                    $set: {
                        user: userId,
                        ...serpAccountInfo
                    }
                },
                { upsert: true }
            );

            return { status: 200, body: serpAccountInfo };
        } catch(e) {
            try {
                let error = JSON.parse(e).error;
                return { status: 500, body: { message: error } }
            } catch(err) {
                return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
            }
        }

    }

    async removeToken(userId, data) {

        let schema = new Validate.Schema({
            id: { type: 'string', required: true },
        });
    
        let validation = schema.validate(data);
        if(validation.errorCount() > 0)  return { status: 422, body: { errors: validation.errors } }
        let body = validation.body;

        try {
            body.id = new ObjectId(body.id);
        } catch(e) {
            return { status: 422, body: { message: `API Key ID is invalid.` } }
        }


        try {
            await this.db.collection('serp-tokens').deleteOne({ user: userId, _id: body.id })
            return { status: 200, body: { success: true } };
        } catch(e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }

    }

    async getUserToken(userId, query = {}) {
        try {
            let tokens = await this.db.collection('serp-tokens').find({ user: userId, ...query }).toArray();
            return { status: 200, body: tokens }
        } catch(e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }
    }

    async findUserTokenToUse(userId) {
        try {
            let token = await this.db.collection('serp-tokens').findOne({ user: userId, total_searches_left: { $gt: 0 } });
            if(!token) return { status: 404, body: { message: `There are no active API Keys at the moment.` } }
            return { status: 200, body: token };
        } catch(e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }
    }

    async getSerpData(userId, keyword, url, country = 'us') {

        try {
            let userToken = await this.findUserTokenToUse(userId);
            if(userToken.status !== 200) return userToken;

            let updatedToken = await this.addToken(userId, { key: userToken.body.api_key });
            if(updatedToken.status !== 200) return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }

            let accountInfo = updatedToken.body;
            if(accountInfo.total_searches_left <= 0) return { status: 422, body: { message: `API Key doesn't have any searches left for the current billing period.` } }

            let serpResult = await getJson({
                api_key: accountInfo.api_key,
                engine: "google",
                q: keyword,
                google_domain: "google.com",
                gl: country,
                hl: "en",
                num: "100"
            });

            let matchedPages = serpResult.organic_results.filter(result => {
                if (result.link.includes(url)) return true;
                return false;
            });

            await this.addToken(userId, { key: userToken.body.api_key });

            return { status: 200, body: matchedPages }
        } catch(e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }
    }


}