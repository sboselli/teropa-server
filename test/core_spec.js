import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  // setEntries
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Supertroopers', 'Terminator');
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Supertroopers', 'Terminator')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Supertroopers', 'Terminator'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Supertroopers', 'Terminator')
      }));
    });
  });

  // next
  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Supertroopers', 'Terminator', 'Blow')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Supertroopers', 'Terminator')
        }),
        entries: List.of('Blow')
      }));
    });

    it('puts a winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Supertroopers', 'Terminator'),
          tally: Map({
            'Supertroopers': 4,
            'Terminator': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', 'Oldboy')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('Oldboy', 'Supertroopers')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Supertroopers', 'Oldboy'),
          tally: Map({
            'Supertroopers': 3,
            'Oldboy': 3
          })
        }),
        entries: List.of('Terminator', 'Sunshine', 'Millions')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Terminator', 'Sunshine')
        }),
        entries: List.of('Millions', 'Supertroopers', 'Oldboy')
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Supertroopers', 'Blow'),
          tally: Map({
            'Supertroopers': 4,
            'Blow': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Supertroopers'
      }));
    });
  });

  // vote
  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Supertroopers', 'Terminator')
      });
      const nextState = vote(state, 'Supertroopers');

      expect(nextState).to.equal(Map({
        pair: List.of('Supertroopers', 'Terminator'),
        tally: Map({
          'Supertroopers': 1
        })
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Supertroopers', 'Terminator'),
        tally: Map({
          'Supertroopers': 3,
          'Terminator': 2
        })
      });
      const nextState = vote(state, 'Supertroopers');

      expect(nextState).to.equal(Map({
        pair: List.of('Supertroopers', 'Terminator'),
        tally: Map({
          'Supertroopers': 4,
          'Terminator': 2
        })
      }));
    });
  });

});