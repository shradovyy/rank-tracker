import Serp from "~/server/js/Serp";

export default defineEventHandler(async (event) => {
    if(!event.context.user) {
        setResponseStatus(event, 401);
        return { message: 'Unauthorized' };
    } 
    const app = useNitroApp();
    const serp = new Serp(app.$db);
    let tokens = await serp.getUserToken(event.context.user._id);

    setResponseStatus(event, tokens.status);
    return tokens.body;
});