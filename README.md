<h1 align="center">Minesweeper</h1>
<p align="center">A simple implementation of Minesweeper game in Ember</p>

## Architecture
There are two main Ember services in this application
* `game-service`
    <p>This is the service that handles the state of the game. It is responsible to initialize the minesweeper cells and to place the mines on randomly chosen cells. When player clicks on cell, the service will update the current cell state and also to reveal the neighbors of the clicked cell. The `game-service` uses the `timer-service` to keep track of elapsed time. It is responsible to mark the game as 'lost' when the timer has reached its maximum threshold (999 secs)</p>
* `timer-service`
    <p>This is the service that keeps track of elapsed time of an active game. Its main responsibilities are to update the elapsed time and to notify `game-service` that it has reached its maximum threshold (999 secs)</p>
    
There are three Ember components in this application
* `game-page` - the main container of the application. This component is responsible to communicate with the `game-service` for updating the game state. It is also responsible to set up a global listener to listen to `alt + s` button presses to re-start the game.
* `grid-cells` - the list of the minesweeper cells
* `grid-cell` - the individual minesweeper cell

## Accessibility Considerations
I have attempted to make this application as accessible as possible.
* All grid cells are `<button>` elements. Therefore, they are operatable by keyboard. They also have appropriately assigned label
* Start button has appropriate label assigned to it.
* Elapsed timer and mines count have proper label assigned to them.
* Focus and hover indicators are clearly visible.
* cell foreground and background colors have adequate contrast.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)

## Installation
* `git clone <repository-url>` this repository
* `cd minesweeper-game`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`
* `COVERAGE=true ember test`
