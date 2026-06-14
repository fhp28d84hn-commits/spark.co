const { spawnSync } = require('child_process');

/**
 * Executes a SQL statement via the team-db CLI.
 * Bypasses bash/shell parsing using spawnSync.
 * 
 * @param {string} sql The SQL statement to run
 * @returns {Array<object>} The parsed JSON rows or results
 */
function query(sql) {
  const result = spawnSync('team-db', [sql]);
  if (result.status !== 0) {
    const errorMsg = result.stderr ? result.stderr.toString().trim() : 'Unknown error';
    throw new Error(`Database error: ${errorMsg}\nSQL was: ${sql}`);
  }
  try {
    return JSON.parse(result.stdout.toString());
  } catch (err) {
    throw new Error(`Failed to parse database output: ${result.stdout.toString()}`);
  }
}

/**
 * Escapes single quotes for SQLite string literals.
 * Replaces a single quote ' with two single quotes ''.
 * 
 * @param {any} val Value to escape
 * @returns {string} Escaped string literal, or string representation of the value
 */
function escape(val) {
  if (val === undefined || val === null) {
    return '';
  }
  const str = String(val);
  return str.replace(/'/g, "''");
}

module.exports = {
  query,
  escape
};
