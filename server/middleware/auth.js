import Users from '../js/Users'

export default defineEventHandler(async (event) => {
    const app = useNitroApp();
    Users.setDB(app.$db);
    const token = getCookie(event, 'APP_TOKEN') || null;
    let result = await Users.verify(token);
    if(result.status === 200) {
        event.context.user = result.body;
    }
});