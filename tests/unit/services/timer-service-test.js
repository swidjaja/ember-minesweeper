import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Service | timer-service', () => {
  setupTest('service:timer-service', {});

  it('properly initialize its properties on init', function () {
    const { elapsedTime, hasTimedOut } = this.subject();

    expect(elapsedTime).to.equal(0);
    expect(hasTimedOut).to.equal(false);
  });

  it('runs incElapsedTime when timer starts', function () {
    const service = this.subject();
    
    service.incElapsedTime = sinon.spy();
    service.start();

    expect(service.incElapsedTime.calledOnce).to.equal(true);
  });

  it('sets hasTimedOut to true if the timer times out', function () {
    const service = this.subject({});

    service.elapsedTime = 998;
    service.stop = sinon.spy();
    service.incElapsedTime();

    expect(service.hasTimedOut).to.equal(true);
    expect(service.stop.calledOnce).to.equal(true);
  });
});
