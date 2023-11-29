import Keywords from "~/server/js/Keywords";

export default defineEventHandler(async (event) => {

    if(!event.context.user) {
        setResponseStatus(event, 401);
        return { message: 'Unauthorized' };
    } 

    const app = useNitroApp();
    const keywords = new Keywords(app.$db);
    let result = await keywords.getAvailableFilters(event.context.user._id);

    setResponseStatus(event, result.status);
    return result.body;
});