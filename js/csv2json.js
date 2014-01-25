/**
 * result format:
 * {
 *   "chouju": [
 *     "type": "鳥類",
 *     "name": "カワウ"
 *   ]
 * }
 */

var stdin = process.openStdin();
stdin.setEncoding("utf-8");

var buffer = "";

stdin.on("data", function(chunk) {
  buffer += chunk.replace(/\r/g, "");
});

stdin.on("end", function() {
  var chouju = [];
  var columns;

  buffer.split("\n").forEach(function(line, index) {
    // 最初の行はヘッダ
    if (index === 0) {
      columns = line.split(",");
      return;
    }

    var tokens = line.split(",");
    if (tokens[0].length <= 1) { return; }

    var obj = {};
    columns.forEach(function(col, index) {
      obj[col] = tokens[index];
    });
    chouju.push(obj);
  });

  process.stdout.write(JSON.stringify({chouju: chouju}, null, "  "));
});

