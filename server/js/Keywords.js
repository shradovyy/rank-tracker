import Validate from './Validate'
import Serp from "./Serp";
import moment from "moment";
import GoogleCountries from '~/js/google-countries.json'
import validator from 'validator'
import { ObjectId } from 'mongodb';

export default class Keywords {

    constructor(db) {
        this.db = db;
        this.serp = new Serp(db);
    }

    isValidSite(url = '') {

        url = url.trim();

        if (!url.startsWith('https://')) {
            url = 'https://' + url;
        }

        if (!validator.isURL(url, { protocols: ['https'] })) {
            return null;
        }

        const parsedUrl = new URL(url);
        if (!(parsedUrl.pathname === '/' && !parsedUrl.search && !parsedUrl.hash)) {
            return null;
        }

        return parsedUrl.origin;
    }


    async addKeyword(userId, data) {

        let schema = new Validate.Schema({
            url: { type: 'string', required: true },
            keyword: { type: 'string', required: true },
            country: { type: 'string', required: true },
        });

        let validation = schema.validate(data);
        if (validation.errorCount() > 0) return { status: 422, body: { errors: validation.errors } }
        let body = validation.body;

        const isValidCountry = GoogleCountries.find(country => country.country_code === body.country);
        if (!isValidCountry) return { status: 422, body: { errors: { country: 'invalid' } } }
        body.country = isValidCountry.country_code;

        body.url = this.isValidSite(body.url);
        if (!body.url) return { status: 422, body: { errors: { url: 'invalid' } } };

        await this.db.collection('keywords').updateOne(
            { user: userId, keyword: body.keyword, site: body.url, country: body.country },
            {
                $set: {
                    user: userId,
                    keyword: body.keyword,
                    site: body.url,
                    country: body.country
                }
            },
            { upsert: true }
        );

        await this.updateSerpData(userId, body.keyword, body.url, body.country);

        return { status: 200, body: body }
    }

    async updateSerpData(userId, keyword, url, country) {

        // get serp data based on keyword and url
        let serpData = await this.serp.getSerpData(userId, keyword, url, country);
        if (serpData.status !== 200) return serpData;

        await this.db.collection('keywords').updateMany(
            { keyword: keyword, site: url, country: country },
            {
                $set: {
                    updatedOn: moment().toDate()
                }
            }
        );

        let startDay = moment().startOf('day');
        let endDay = moment().endOf('day');

        let items = serpData.body;
        let keywordUpdatedOnDate = moment().toDate();
        for (const item of items) {
            await this.db.collection('keywords-results').updateOne(
                { keyword: keyword, site: url, link: item.link, updatedOn: { $gte: startDay.toDate(), $lte: endDay.toDate() } },
                {
                    $set: {
                        ...item,
                        keyword,
                        site: url,
                        country: country,
                        updatedOn: keywordUpdatedOnDate
                    }
                },
                {
                    upsert: true
                }
            )
        }

    }


    async getKeywords(userId, data) {

        let schema = new Validate.Schema({
            country: { type: 'string', required: false },
            site: { type: 'string', required: false },
            keywordId: { type: 'string', required: false },
        });

        let validation = schema.validate(data);
        let body = validation.body;

        if (body.country) {
            const isValidCountry = GoogleCountries.find(country => country.country_code === body.country);
            if (!isValidCountry) body.country = null;
        }

        if (body.site) body.site = this.isValidSite(body.site);
        if (body.keywordId) {
            try {
                body.keywordId = new ObjectId(body.keywordId);
            } catch (e) {
                body.keywordId = null;
            }
        }

        try {

            let query = {
                user: userId
            };
            if (body.country) {
                query.country = body.country;
            }

            if (body.site) {
                query.site = body.site;
            }

            if (body.keywordId) {
                query._id = body.keywordId;
            }

            let keywords = await this.db.collection('keywords')
                .aggregate([
                    {
                        $match: query
                    },
                    {
                        $lookup: {
                            from: 'keywords-results',
                            localField: 'keyword',
                            foreignField: 'keyword',
                            let: {
                                country: "$country",
                                site: "$site"
                            },
                            as: 'results',
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$country", "$$country"] },
                                                { $eq: ["$site", "$$site"] },
                                            ]
                                        },
                                        updatedOn: { $gte: moment().subtract(30, 'days').toDate() }
                                    }
                                },
                                { $sort: { updatedOn: -1, position: 1, _id: 1 } },
                                {
                                    $group: {
                                        _id: "$link",
                                        items: { $push: "$$ROOT" },
                                        updatedOn: { $first: "$updatedOn" },
                                        position: { $first: "$position" },
                                        resId: { $first: "$_id" }
                                    }
                                },
                                { $sort: { updatedOn: -1, position: 1, resId: 1 } },
                                {
                                    $project: {
                                        current: { $arrayElemAt: ["$items", 0] },
                                        previous: { $arrayElemAt: ["$items", 1] },
                                        recentPositions: {
                                            $map: {
                                                input: "$items",
                                                as: "item",
                                                in: {
                                                    position: "$$item.position",
                                                    updatedOn: "$$item.updatedOn"
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            sortFieldExists: { $gt: [{ $size: "$results" }, 0] }
                        }
                    },
                    {
                        $sort: { sortFieldExists: -1, "results.0.current.position": 1, keyword: 1 }
                    },
                    {
                        $project: {
                            sortFieldExists: 0
                        }
                    }
                ]).toArray();

            return { status: 200, body: keywords }
        } catch (e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }

    }

    async getAvailableFilters(userId) {
        try {

            let filters = await this.db.collection('keywords')
                .aggregate([
                    {
                        $match: { user: userId }
                    },
                    {
                        $facet: {
                            "countries": [{ $group: { _id: "$country", } }],
                            "sites": [{ $group: { _id: "$site", } }],
                        }
                    }
                ]).toArray();

            if (filters.length <= 0) filters = { countries: [], sites: [] };
            else filters = filters[0];

            return { status: 200, body: filters }
        } catch (e) {
            return { status: 500, body: { message: 'Something went wrong. Please, try again!' } }
        }
    }

    async removeKeyword(userId, data) {


        let schema = new Validate.Schema({
            _id: { type: 'string', required: true },
        });

        let validation = schema.validate(data);
        if (validation.errorCount() > 0) return { status: 422, body: { errors: validation.errors } }
        let body = validation.body;

        try {
            body._id = new ObjectId(body._id);
        } catch (e) {
            return { status: 422, body: { message: `Provided keyword ID is invalid.` } }
        }

        await this.db.collection('keywords').deleteOne(
            { user: userId, _id: body._id }
        );

        return { status: 200, body: { ok: true } }
    }

    async getStats(userId, data) {

        let schema = new Validate.Schema({
            country: { type: 'string', required: false },
            site: { type: 'string', required: false },
            period: { type: 'string', required: false },
        });

        let validation = schema.validate(data);
        let body = validation.body;


        if (body.country) {
            const isValidCountry = GoogleCountries.find(country => country.country_code === body.country);
            if (!isValidCountry) body.country = null;
        }

        if (body.site) body.site = this.isValidSite(body.site);

        let query = {
            user: userId,
            updatedOn: {
                $gte: moment().subtract(30, 'days').toDate()
            }
        }

        if (body.country) {
            query.country = body.country;
        }

        if (body.site) {
            query.site = body.site;
        }

        let periodDate = moment().subtract(7, 'days').endOf('day');
        const isValidPeriod = ['1d', '7d', '1m', '3m', '6m', '1y'].includes(body.period);
        if (isValidPeriod) {
            switch (body.period) {
                case '1d':
                    periodDate = moment().subtract(1, 'days').endOf('day')
                    break;
                case '7d':
                    periodDate = moment().subtract(7, 'days').endOf('day')
                    break;
                case '1m':
                    periodDate = moment().subtract(1, 'month').endOf('day')
                    break;
                case '3m':
                    periodDate = moment().subtract(3, 'months').endOf('day')
                    break;
                case '6m':
                    periodDate = moment().subtract(6, 'months').endOf('day')
                    break;
                case '1y':
                    periodDate = moment().subtract(12, 'months').endOf('day')
                    break;
                default:
                    periodDate = moment().subtract(7, 'days').endOf('day')
                    break;
            }
        }

        let keywords = await this.db.collection('keywords')
            .aggregate([
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'keywords-results',
                        localField: 'keyword',
                        foreignField: 'keyword',
                        let: {
                            country: "$country",
                            site: "$site"
                        },
                        as: 'results',
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$country", "$$country"] },
                                            { $eq: ["$site", "$$site"] },
                                        ]
                                    },
                                    updatedOn: { $gte: moment().subtract(2, 'year').toDate() }
                                }
                            },
                            {
                                $facet: {
                                    current: [
                                        {
                                            $match: {
                                                updatedOn: { $gte: moment().subtract(30, 'days').toDate() }
                                            }
                                        },
                                        { $sort: { updatedOn: -1 } },
                                        {
                                            $group: {
                                                _id: "$link",
                                                position: { $first: "$position" },
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                organicPages: { $sum: 1 },
                                                position: { $avg: "$position" },
                                                pages: { $push: "$$ROOT" }
                                            }
                                        }
                                    ],
                                    previous: [
                                        {
                                            $match: {
                                                updatedOn: { $lte: periodDate.toDate() }
                                            }
                                        },
                                        { $sort: { updatedOn: -1 } },
                                        {
                                            $group: {
                                                _id: "$link",
                                                position: { $first: "$position" },
                                            }
                                        },
                                        {
                                            $group: {
                                                _id: null,
                                                organicPages: { $sum: 1 },
                                                position: { $avg: "$position" },
                                                pages: { $push: "$$ROOT" }
                                            }
                                        }
                                    ],
                                }
                            }

                        ]
                    }
                },
                {
                    $unwind: { path: "$results", preserveNullAndEmptyArrays: true }
                },
                { $unwind: { path: "$results.current", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$results.previous", preserveNullAndEmptyArrays: true } },
            ]).toArray();


        const topRankings = [1, 3, 5, 10, 100];
        let globalRankingChanges = topRankings.map(topRanking => ({
            topRanking,
            currentPages: 0,
            previousPages: 0,
            currentKeywordCount: 0,
            previousKeywordCount: 0
        }));

        let totalKeywords = keywords.length;
        let totalCurrentPages = 0;
        let totalPreviousPages = 0;
        let keywordsWentUp = 0;
        let keywordsWentDown = 0;

        keywords.forEach(item => {
            const current = item.results.current || { pages: [] };
            const previous = item.results.previous || { pages: [] };

            totalCurrentPages += current.pages.length;
            totalPreviousPages += previous.pages.length;

            if (current.position !== null && previous.position !== null) {
                if (current.position < previous.position) {
                    keywordsWentUp++;
                } else if (current.position > previous.position) {
                    keywordsWentDown++;
                }
            }

            topRankings.forEach(topRanking => {
                const currentTopRankingPages = current.pages.filter(page => page.position <= topRanking).length;
                const previousTopRankingPages = previous.pages.filter(page => page.position <= topRanking).length;

                const globalRankChange = globalRankingChanges.find(rank => rank.topRanking === topRanking);
                globalRankChange.currentPages += currentTopRankingPages;
                globalRankChange.previousPages += previousTopRankingPages;

                if (currentTopRankingPages > 0) {
                    globalRankChange.currentKeywordCount++;
                }
                if (previousTopRankingPages > 0) {
                    globalRankChange.previousKeywordCount++;
                }
            });
        });

        globalRankingChanges = globalRankingChanges.map(rank => ({
            topRanking: rank.topRanking,
            currentTotalPages: rank.currentPages,
            keywordsInTopRanking: rank.currentKeywordCount,
            keywordDifference: rank.currentKeywordCount - rank.previousKeywordCount,
            pageDifference: rank.currentPages - rank.previousPages
        }));

        let result = {
            totalKeywords,
            totalCurrentPages,
            totalPreviousPages,
            pageDifference: totalCurrentPages - totalPreviousPages,
            keywordsWentUp,
            keywordsWentDown,
            globalRankingChanges,
        };

        return { status: 200, body: result }
    }

}