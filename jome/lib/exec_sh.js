const {spawnSync} = require("child_process");

function execSh(cmd) {
  let s = cmd.split(' ')
  let cmdName = s[0]
  let args = s.slice(1)
  spawnSync(cmdName, args, { encoding: 'utf-8', stdio: 'inherit' })
}

module.exports = execSh