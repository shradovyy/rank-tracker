import Serp from "~/server/js/Serp";

export default defineEventHandler(async (event) => {

    if(!event.context.user) {
        setResponseStatus(event, 401);
        return { message: 'Unauthorized' };
    } 

    const body = await readBody(event);
    const app = useNitroApp();
    const serp = new Serp(app.$db);
    let tokens = await serp.addToken(event.context.user._id, body);

    setResponseStatus(event, tokens.status);
    return tokens.body;
});