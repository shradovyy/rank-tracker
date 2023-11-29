import Keywords from "~/server/js/Keywords";

export default defineEventHandler(async (event) => {

    if(!event.context.user) {
        setResponseStatus(event, 401);
        return { message: 'Unauthorized' };
    } 

    const body = await readBody(event);
    const app = useNitroApp();
    const keywords = new Keywords(app.$db);
    let tokens = await keywords.addKeyword(event.context.user._id, body);

    setResponseStatus(event, tokens.status);
    return tokens.body;
});