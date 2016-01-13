import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('has an initial state', () => {
    const action = { type: 'SET_ENTRIES', entries: ['Terminator']};
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Terminator']
    }))
  });

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = { type: 'SET_ENTRIES', entries: ['Terminator'] };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Terminator']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Terminator', 'Supertroopers']
    });
    const action = { type: 'NEXT' };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Terminator', 'Supertroopers']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Terminator', 'Supertroopers']
      },
      entries: []
    });
    const action = { type: 'VOTE', entry: 'Supertroopers'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Terminator', 'Supertroopers'],
        tally: { 'Supertroopers': 1 }
      },
      entries: []
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      { type: 'SET_ENTRIES', entries: ['Supertroopers', 'Terminator'] },
      { type: 'NEXT' },
      { type: 'VOTE', entry: 'Supertroopers' },
      { type: 'VOTE', entry: 'Terminator' },
      { type: 'VOTE', entry: 'Supertroopers' },
      { type: 'NEXT' }
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Supertroopers'
    }));
  });

});