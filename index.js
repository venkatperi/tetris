const Game = require( './game' )
const Input = require( './input' )

const stdin = process.stdin;
const stdout = process.stdout;
stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );


// Listen for user input.
stdin.on( 'data', function ( key ) {
  switch ( key ) {
    // Handle the arrow keys.
    case '\u001B\u005B\u0041':
      handleInput( Input.UP );
      break;
    case '\u001B\u005B\u0043':
      handleInput( Input.RIGHT );
      break;
    case '\u001B\u005B\u0042':
      handleInput( Input.DOWN );
      break;
    case '\u001B\u005B\u0044':
      handleInput( Input.LEFT );
      break;
    case 'q':
      handleInput( Input.QUIT );
      break;
    case ' ':
      handleInput( Input.SPACE );
      break;
  }
} );

const game = new Game( 10, 10 );

function handleInput( input ) {
  if ( input === Input.QUIT ) {
    console.log( 'exiting' );
    process.exit();
  }
  game.handleInput( input )
}
