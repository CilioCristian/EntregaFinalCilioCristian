import db from "../Config/db.js"; // acá importás la conexión a la base de datos

class mailDAO {
    // Método para guardar un mail en la colección "mails"
    async saveMail(data){
        return await db.collection("mails").insertOne(data);
    }
}

// Exportás una instancia lista para usar
export default new mailDAO();