import Hooks from 'src/models/hooks';
import HookLink from 'src/models/hook-link';
import {expect} from 'chai';
import benv from 'benv';

before(function(done) {
  benv.setup(function() {
    benv.expose({
      angular: benv.require('../../node_modules/angular/angular.js', 'angular')
    });

    done();
  });
});

describe('Hooks', () => {
  it('should be a function', () => {
    expect(Hooks).to.be.a('function');
  });

  it('should only call with a \'new\' keyword', () => {
    expect(() => { Hooks() }).to.throw();
    expect(() => { new Hooks() }).to.not.throw();
  });

  context('instance', () => {
    it('should be an instance of Hooks', () => {
      const hooks = new Hooks();
      expect(hooks.constructor.name).to.equal('Hooks');
      expect(hooks).to.be.an.instanceof(Hooks);
    });

    it('should have an initial empty array hooks', () => {
      const hooks = new Hooks();
      expect(hooks.hooks).to.be.an('array').that.is.an.empty;
    });  

    it('should exactly have a hooks property and addHook and attemptRunAll methods', () => {
      const hooks = new Hooks();
      expect(hooks).to.have.all.keys('hooks');
      expect(hooks).to.respondTo('addHook');
      expect(hooks).to.respondTo('attemptRunAll');
    });
  });

  context('addHook method', () => {
    it('should require first parameter (actionQuery) to be either a string, array or regexp', () => {
      const hooks = new Hooks();
      const noop = angular.noop;

      expect(() => { hooks.addHook(null, [noop], {}) }).to.throw();
      expect(() => { hooks.addHook(undefined, [noop], {}) }).to.throw();
      expect(() => { hooks.addHook(true, [noop], {}) }).to.throw();
      expect(() => { hooks.addHook(123, [noop], {}) }).to.throw();
      expect(() => { hooks.addHook(function () {}, [noop], {}) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], {}) }).to.not.throw();
      expect(() => { hooks.addHook([], [noop], {}) }).to.not.throw();
      expect(() => { hooks.addHook(/.*/, [noop], {}) }).to.not.throw();
    });

    it('should require second parameter (reducers) to be an array of function', () => {
      const hooks = new Hooks();
      const noop = angular.noop;

      expect(() => { hooks.addHook('foo', null, {}) }).to.throw();
      expect(() => { hooks.addHook('foo', undefined, {}) }).to.throw();
      expect(() => { hooks.addHook('foo', true, {}) }).to.throw();
      expect(() => { hooks.addHook('foo', 'foo', {}) }).to.throw();
      expect(() => { hooks.addHook('foo', 123, {}) }).to.throw();
      expect(() => { hooks.addHook('foo', [], {}) }).to.throw();
      expect(() => { hooks.addHook('foo', ['bar', noop], {}) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], {}) }).to.not.throw();
      expect(() => { hooks.addHook('foo', [noop, function () {}, () => {}], {}) }).to.not.throw();
    });

    it('should require third parameter (initialRunState) to be an object', () => {
      const hooks = new Hooks();
      const noop = angular.noop;

      expect(() => { hooks.addHook('foo', [noop], null) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], undefined) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], true) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], 'foo') }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], 123) }).to.throw();
      expect(() => { hooks.addHook('foo', [noop], {}) }).to.not.throw();
    });
  });
});

after(function() {
  benv.teardown();
});