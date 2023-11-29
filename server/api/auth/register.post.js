import Users from '../../js/Users'

export default defineEventHandler(async (event) => {
    const app = useNitroApp();
    Users.setDB(app.$db);
    let data = await readBody(event);
    let result = await Users.register(data);
    setResponseStatus(event,  result.status);
    return result.body;    
});