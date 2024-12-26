const redisClient = require("../redis/client")

async function deleteKeysByPattern(pattern) {
  let cursor = "0";
  let deletedCount = 0;
  const batchSize = 100; // Ajuste o tamanho do lote conforme necessário

  do {
    try {
      // Usa SCAN para encontrar todas as chaves que terminam com o padrão especificado
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: batchSize
      });
      cursor = reply.cursor;
      const keys = reply.keys;

      // Deleta as chaves encontradas em lote
      if (Array.isArray(keys) && keys.length > 0) {
        await redisClient.del(...keys);  // Deleta todas as chaves encontradas de uma vez
        deletedCount += keys.length;
        break;
      }
    } catch (error) {
      console.error("Erro ao executar SCAN ou DEL:", error);
      break;
    }
  } while (cursor !== "0");

  return deletedCount;
}

module.exports = deleteKeysByPattern;