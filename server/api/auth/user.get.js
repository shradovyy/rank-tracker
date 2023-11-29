export default defineEventHandler(async (event) => {
    if(event.context.user) {
        return event.context.user;
    } else {
        setResponseStatus(event, 401);
        return { message: "Unauthorized" }
    }
});