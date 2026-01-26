import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __filename: convierte la URL del archivo actual en una ruta de archivo común.
const __filename = fileURLToPath(import.meta.url);

// __dirname: obtiene el directorio donde está el archivo actual.
const __dirname = dirname(__filename);

// Exportamos __dirname para poder usarlo en otros módulos.
export default __dirname;