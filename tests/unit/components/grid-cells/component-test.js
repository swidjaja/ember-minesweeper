import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Ember from 'ember';
import sinon from 'sinon';

describe('Unit | Component | grid cells', () => {
  setupComponentTest('grid-cells', {
    unit: true
  });

  it('send gridCellClicked action with correct params', function () {
    const payload = { cellState: {}, actionType: 'flag' };
    const component = this.subject();
    const sendActionSpy = sinon.spy();

    Ember.set(component.actions, 'sendAction', sendActionSpy);

    component.actions.gridCellClicked(payload);

    const args = sendActionSpy.firstCall.args;
    expect(args[0]).to.equal('gridCellClicked');
    expect(args[1]).to.deep.equal(payload);
  });
});
