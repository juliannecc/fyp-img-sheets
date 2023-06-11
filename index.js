const core = require('@actions/core');
const github = require('@actions/github');

const added_files = core.getInput('added_files');
const levenshtein = require('fast-levenshtein'); 

const levenshteinFilter = (source, maximum = 3) => {
  let _source, matches, x, y;
  _source = source.slice();
  matches = [];
  for (x = _source.length - 1; x >= 0; x--) {
    let output = _source.splice(x, 1);
    for (y = _source.length - 1; y >= 0; y--) {
      if (levenshtein.get(output[0], _source[y]) <= maximum) {
        output.push(_source[y]);
        _source.splice(y, 1);
        x--;
      }
    }
    matches.push(output);
  }
  return matches;
}


function strToArr (str){
    return str.split(' ');
}

(
    async () => {
        try {
            core.notice("Sample");
            core.info(strToArr(added_files));

            let source = ['06-05-23/Control/1.png', '06-05-23/Control/2.png', '06-05-23/-K/1.png', '06-05-23/-K/2.png', '06-05-23/-N/1.png', '06-06-23/-N/1.png'];
            let output = levenshteinFilter(source);
            core.info(output);
            console.log(JSON.stringify(output));

        } catch (error) {
            core.setFailed(error.message);
        }
    }
)();