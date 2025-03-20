const pool = require('../config/database');

/**
 * Execute a transactional query with rollback support
 * @param {Function} transactionCallback - Async function containing queries
 * @returns {Promise<any>} - The result of the transaction
 */
async function executeTransaction(transactionCallback) {
    let connection;
    try {
        connection = await pool.getConnection(); // ✅ Ensure connection is valid
        if (!connection) throw new Error('Database connection failed');

        await connection.beginTransaction(); // ✅ Start transaction
        console.log('🚀 Transaction Started');

        const result = await transactionCallback(connection);

        await connection.commit(); // ✅ Commit Transaction
        console.log('✅ Transaction Committed');
        return result;
    } catch (error) {
        if (connection) await connection.rollback(); // ❌ Rollback Transaction
        console.error('❌ Transaction Rolled Back:', error.message);
        throw error;
    } finally {
        if (connection) connection.release(); // 🔄 Release Connection
        console.log('🔄 Connection Released');
    }
}

module.exports = { executeTransaction };
