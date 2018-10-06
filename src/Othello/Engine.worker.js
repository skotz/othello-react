import Engine from './Engine.js'

export default () => {
    self.addEventListener('message', function(e) { // eslint-disable-line no-restricted-globals
        console.log(e);
        var board = e.data[0];
        var player = e.data[1];
        var depth = e.data[2];
        var engine = new Engine(); // eslint-disable-line no-undef
        var bestMove = engine.findMove(board, player, depth); // { score: 5, x: 3, y: 2 }; // 
        postMessage(bestMove);
    }, false);
}