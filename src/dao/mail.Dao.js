import db from "../Config/db.js";

class mailDAO {
    async saveMail(data){
        return await db.collection("mails").insertOne(data);

    }
}
export default new mailDAO();